import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Bill, BillConcepto, ComprobanteType } from '@prisma/client';

import {
    mapBillToAfipVoucher,
    mapBillToQRData,
    mapComprobanteTypeToAfip,
    calculateBillAmounts,
    AFIP_CBTE_TIPO_LABELS,
    AFIP_ALICUOTA_IVA_LABELS,
    AfipVoucherResponse,
    validateBillForAfip,
    getBillTypeLabel,
} from './afip';
import { getAfipCompanyConfig } from './afip/config';
import { mapAlicuotaIVAToAfip } from './afip/mapper';
import { AfipService } from './afipService';
import { generatePdfFromHtml } from './pdfService';
import { renderTemplate, InvoiceTemplateData } from './templateService';

import { BillInput } from '@/api/graphql';
import {
    calculateIVAAmount,
    pascalCaseToSpaces,
    paymentConditionLabel,
} from '@/lib/utils';
import { PaymentCondition } from '@/modules/Forms/Accounting/CreateBillingForm/types';
import { prisma } from 'lib/prisma';

import { s3Client, getFileSignedUrl } from '../s3Client';

// ============================================================================
// TIPOS
// ============================================================================

interface CAEDataResult {
    code: string;
    expirationDate: Date;
    status: 'Autorizado' | 'Rechazado' | 'Observado';
}

// Mapeo de condición de venta a días (coincide con frontend)
const PAYMENT_CONDITION_DAYS: Record<string, number | null> = {
    Contado: null,
    CuentaCorriente: null,
    Cheque: null,
    Transferencia: null,
    '15Dias': 15,
    '30Dias': 30,
    '60Dias': 60,
    '90Dias': 90,
    TarjetaCredito: null,
    Otros: null,
};

// interface EmitirFacturaResult {
//     bill: Bill;
//     caeData: CAEDataResult;
//     pdfUrl: string;
// }

// ============================================================================
// FUNCIÓN PRINCIPAL: Emitir Factura Electrónica
// ============================================================================

/**
 * Emite una factura electrónica: llama a AFIP, genera el PDF, sube a S3 y asocia el File a la Bill existente.
 * @param billId - ID de la factura ya creada en la base de datos
 * @returns Bill actualizada con el PDF asociado
 */
export async function emitirFacturaElectronica(billId: string): Promise<Bill> {
    // 1. Buscar la factura y sus relaciones necesarias
    const bill = await prisma.bill.findUnique({
        where: { id: billId },
        include: {
            billingProfile: { include: { business: true } },
            details: true,
        },
    });

    if (!bill) {
        throw new Error('Factura no encontrada');
    }

    // 2. Validar datos antes de enviar a AFIP
    const validation = validateBillForAfip({
        tipoDocumento: bill.billingProfile.tipoDocumento,
        numeroDocumento: bill.billingProfile.numeroDocumento,
        comprobanteType: bill.comprobanteType,
        ivaCondition: bill.billingProfile.IVACondition,
        details: bill.details,
        concepto: bill.punctualService || bill.startDate ? 'servicios' : 'productos',
        serviceDate: bill.serviceDate,
        startDate: bill.startDate,
        endDate: bill.endDate,
        dueDate: bill.dueDate,
        pointOfSale: bill.pointOfSale,
    });

    if (!validation.isValid) {
        throw new Error(`Datos de factura inválidos: ${validation.errors.join(', ')}`);
    }

    // 3. Obtener el punto de venta y tipo de comprobante
    const afipConfig = getAfipCompanyConfig();
    const pointOfSale = bill.pointOfSale || afipConfig.defaultPointOfSale;
    const cbteTipo = mapComprobanteTypeToAfip(bill.comprobanteType);

    // 4. Obtener el próximo número de comprobante
    const lastVoucherNumber = await AfipService.getLastVoucherNumber({
        ptoVta: pointOfSale,
        cbteTipo,
    });
    const nextVoucherNumber = lastVoucherNumber + 1;

    // 5. Calcular fecha de vencimiento respecto a la fecha de emisión (si corresponde)
    const emissionDate = new Date();
    const paymentDays = PAYMENT_CONDITION_DAYS[bill.saleCondition];
    let dueDateToUpdate: Date | undefined = undefined;
    if (typeof paymentDays === 'number') {
        const d = new Date(emissionDate);
        d.setDate(d.getDate() + paymentDays);
        dueDateToUpdate = d;
    }

    // 6. Mapear datos de la factura al formato de AFIP
    const voucherData = mapBillToAfipVoucher(
        {
            ...bill,
            pointOfSale,
            dueDate: dueDateToUpdate || bill.dueDate,
        },
        nextVoucherNumber,
    );

    // 7. Emitir en AFIP
    let afipResponse: AfipVoucherResponse;
    try {
        afipResponse = await AfipService.createVoucher({
            ptoVta: pointOfSale,
            cbteTipo,
            data: voucherData,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        throw new Error(`Error al comunicarse con AFIP: ${errorMessage}`);
    }

    // 8. Verificar resultado
    if (afipResponse.Resultado === 'R') {
        const errors =
            afipResponse.Errors?.map((e) => e.Msg).join(', ') || 'Error desconocido';
        throw new Error(`AFIP rechazó el comprobante: ${errors}`);
    }

    // 9. Calcular importes
    const amounts = calculateBillAmounts(bill.details);

    // 10. Preparar datos del CAE (sin comprobanteNumber, ahora está en Bill)
    const caeData: CAEDataResult = {
        code: afipResponse.CAE,
        expirationDate: parseAfipDate(afipResponse.CAEFchVto),
        status: afipResponse.Resultado === 'A' ? 'Autorizado' : 'Observado',
    };

    // 11. Determinar el concepto AFIP basado en la factura
    const concepto: BillConcepto =
        bill.punctualService || bill.startDate
            ? BillConcepto.Servicios
            : BillConcepto.Productos;

    // 12. Construir observaciones si AFIP las envió
    const afipObservations = afipResponse.Observaciones?.map(
        (obs) => `[${obs.Code}] ${obs.Msg}`,
    ).join('; ');

    // 13. Actualizar la Bill con todos los datos de AFIP (incluye dueDate si fue calculada)
    await prisma.bill.update({
        where: { id: billId },
        data: {
            caeData,
            pointOfSale,
            // Número de comprobante formateado
            comprobanteNumber: formatVoucherNumber(pointOfSale, afipResponse.CbteDesde),
            // Fecha de emisión
            emissionDate,
            // Importes calculados
            totalAmount: amounts.impTotal,
            nonTaxableNetAmount: amounts.impTotConc,
            taxableNetAmount: amounts.impNeto,
            exemptAmount: amounts.impOpEx,
            ivaAmount: amounts.impIVA,
            tributesAmount: amounts.impTrib,
            // Concepto
            concepto,
            // Observaciones de AFIP (si las hay)
            ...(afipObservations && { observations: afipObservations }),
            // Fecha de vencimiento calculada según condición de venta y fecha de emisión
            ...(dueDateToUpdate !== undefined && { dueDate: dueDateToUpdate }),
        },
    });

    // 13. Generar QR de AFIP (URL oficial)
    const qrData = mapBillToQRData(
        {
            ...bill,
            pointOfSale,
        },
        afipResponse.CAE,
        afipResponse.CbteDesde,
        afipConfig.cuitFormatted,
    );
    const { qrPng } = await AfipService.generateBillQR(qrData);

    // 14. Armar los datos para la plantilla
    const invoiceData: InvoiceTemplateData = {
        company: {
            name: afipConfig.name,
            cuit: afipConfig.cuitFormatted,
            address: afipConfig.address,
            grossIncome: afipConfig.grossIncome,
            ivaCondition: afipConfig.ivaCondition,
        },
        client: {
            name: bill.billingProfile.legalName || '',
            documentType: bill.billingProfile.tipoDocumento || '',
            documentNumber: bill.billingProfile.numeroDocumento || '',
            address: bill.billingProfile.comercialAddress || '',
            ivaCondition: bill.billingProfile.IVACondition || '',
        },
        billType: AFIP_CBTE_TIPO_LABELS[cbteTipo] || bill.comprobanteType,
        billNumber: formatVoucherNumber(pointOfSale, afipResponse.CbteDesde),
        billDate: new Date().toLocaleDateString('es-AR'),
        emissionDate: bill.emissionDate?.toLocaleDateString('es-AR'),
        pointOfSale: pointOfSale,
        items: bill.details.map((d) => {
            const alicuotaAfip = mapAlicuotaIVAToAfip(d.alicuotaIVA);
            const alicuotaLabel = AFIP_ALICUOTA_IVA_LABELS[alicuotaAfip] || d.alicuotaIVA;
            return {
                description: d.description,
                quantity: d.quantity,
                unitPrice: d.unitPrice,
                subtotal: d.unitPrice * d.quantity,
                alicuotaIVA: alicuotaLabel,
            };
        }),
        // Importes desglosados
        subtotal: amounts.impNeto,
        taxableNetAmount: amounts.impNeto,
        nonTaxableNetAmount: amounts.impTotConc,
        exemptAmount: amounts.impOpEx,
        ivaAmount: amounts.impIVA,
        tributesAmount: amounts.impTrib,
        total: amounts.impTotal,
        withholdingAmount: bill.withholdingAmount || undefined,
        // Datos AFIP
        cae: caeData.code,
        caeDueDate: caeData.expirationDate.toLocaleDateString('es-AR'),
        qrDataUrl: qrPng,
        // Información adicional
        footerText: '',
        concepto: concepto ? BillConcepto[concepto] : undefined,
        // Fechas y períodos de servicio
        serviceDate: bill.serviceDate?.toLocaleDateString('es-AR'),
        servicePeriod:
            bill.startDate && bill.endDate
                ? `${bill.startDate.toLocaleDateString('es-AR')} - ${bill.endDate.toLocaleDateString('es-AR')}`
                : undefined,
        dueDate: bill.dueDate?.toLocaleDateString('es-AR'),
        saleCondition: paymentConditionLabel(bill.saleCondition as PaymentCondition),
    };

    // 15. Renderizar HTML y generar PDF
    const html = renderTemplate<InvoiceTemplateData>('invoice', invoiceData);
    const pdfBuffer = await generatePdfFromHtml(html);

    // 16. Subir PDF a S3
    const pdfKey = `bills/${formatVoucherNumber(pointOfSale, afipResponse.CbteDesde)}-${bill.billingProfile.legalName}.pdf`;
    await s3Client.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: pdfKey,
            Body: pdfBuffer,
            ContentType: 'application/pdf',
        }),
    );

    // 17. Obtener URL firmada y expiración (forzar descarga con filename)
    const { url, urlExpire } = await getFileSignedUrl(
        pdfKey,
        'application/pdf',
        `${formatVoucherNumber(pointOfSale, afipResponse.CbteDesde)}-${bill.billingProfile.legalName}.pdf`,
    );

    // 18. Crear el objeto File
    const file = await prisma.file.create({
        data: {
            key: pdfKey,
            filename: `${formatVoucherNumber(pointOfSale, afipResponse.CbteDesde)}-${bill.billingProfile.legalName}.pdf`,
            mimeType: 'application/pdf',
            size: pdfBuffer.length,
            url,
            urlExpire: new Date(urlExpire),
        },
    });

    // 19. Asociar el PDF a la Bill y actualizar estado
    const billActualizada = await prisma.bill.update({
        where: { id: bill.id },
        data: {
            pdfId: file.id,
            status: 'Pendiente', // La factura fue emitida correctamente
        },
        include: {
            pdf: true,
            tasks: true, // Incluir tareas asociadas
            billingProfile: true,
            business: true,
        },
    });

    return billActualizada;
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Parsea una fecha en formato AFIP (YYYYMMDD) a Date
 */
function parseAfipDate(dateStr: string): Date {
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1;
    const day = parseInt(dateStr.substring(6, 8), 10);
    return new Date(year, month, day);
}

/**
 * Formatea el número de comprobante para mostrar (PPPP-NNNNNNNN)
 */
function formatVoucherNumber(pointOfSale: number, voucherNumber: number): string {
    const ptoVta = String(pointOfSale).padStart(4, '0');
    const nroCbte = String(voucherNumber).padStart(8, '0');
    return `${ptoVta}-${nroCbte}`;
}

/**
 * Obtener el próximo número de comprobante para un tipo y punto de venta
 */
export async function getNextVoucherNumber(
    pointOfSale: number,
    comprobanteType: ComprobanteType,
): Promise<number> {
    const cbteTipo = mapComprobanteTypeToAfip(comprobanteType);
    const lastNumber = await AfipService.getLastVoucherNumber({
        ptoVta: pointOfSale,
        cbteTipo,
    });
    return lastNumber + 1;
}

/**
 * Validar si un comprobante existe en AFIP
 */
export async function validateVoucherExists(
    pointOfSale: number,
    comprobanteType: ComprobanteType,
    voucherNumber: number,
): Promise<boolean> {
    const cbteTipo = mapComprobanteTypeToAfip(comprobanteType);
    try {
        const voucherInfo = await AfipService.getVoucherInfo({
            ptoVta: pointOfSale,
            cbteTipo,
            nroCbte: voucherNumber,
        });
        return voucherInfo !== null;
    } catch {
        return false;
    }
}

/**
 * Regenera el PDF de una factura existente: renderiza plantilla, genera PDF,
 * sube a S3, actualiza o crea el `File` y asocia el PDF a la `Bill`.
 */
export async function regenerateBillPdf(billId: string): Promise<Bill> {
    const bill = await prisma.bill.findUnique({
        where: { id: billId },
        include: {
            billingProfile: {
                include: { business: true },
            },
            pdf: true,
            details: true,
        },
    });

    if (!bill) {
        throw new Error('Factura no encontrada');
    }

    const afipConfig = getAfipCompanyConfig();
    const pointOfSale = bill.pointOfSale || afipConfig.defaultPointOfSale;

    // Necesitamos el número de comprobante (nro) para regenerar el QR
    const comprobanteNumber = bill.comprobanteNumber || '';
    const nroPart = comprobanteNumber.split('-')[1];
    const cbteDesde = nroPart ? parseInt(nroPart, 10) : NaN;
    if (!bill.caeData?.code || Number.isNaN(cbteDesde)) {
        throw new Error('No se puede regenerar PDF: falta CAE o número de comprobante');
    }

    // Generar QR
    const qrData = mapBillToQRData(
        {
            ...bill,
            pointOfSale,
        },
        bill.caeData.code,
        cbteDesde,
        afipConfig.cuitFormatted,
    );
    const { qrPng } = await AfipService.generateBillQR(qrData);

    // Calcular importes y preparar items para la plantilla
    const amounts = calculateBillAmounts(bill.details);

    const invoiceData: InvoiceTemplateData = {
        company: {
            name: afipConfig.name,
            cuit: afipConfig.cuitFormatted,
            address: afipConfig.address,
            grossIncome: afipConfig.grossIncome,
            ivaCondition: afipConfig.ivaCondition,
        },
        client: {
            name: bill.billingProfile.legalName || '',
            documentType: bill.billingProfile.tipoDocumento || '',
            documentNumber: bill.billingProfile.numeroDocumento || '',
            address: bill.billingProfile.comercialAddress || '',
            ivaCondition: pascalCaseToSpaces(bill.billingProfile.IVACondition) || '',
        },
        billType: getBillTypeLabel(bill.comprobanteType) || bill.comprobanteType,
        billNumber: bill.comprobanteNumber || formatVoucherNumber(pointOfSale, cbteDesde),
        billDate: new Date().toLocaleDateString('es-AR'),
        emissionDate: bill.emissionDate?.toLocaleDateString('es-AR'),
        pointOfSale: pointOfSale,
        items: bill.details.map((d) => {
            const alicuotaAfip = mapAlicuotaIVAToAfip(d.alicuotaIVA);
            const alicuotaLabel = AFIP_ALICUOTA_IVA_LABELS[alicuotaAfip] || d.alicuotaIVA;
            const ivaAmount = calculateIVAAmount(d.quantity * d.unitPrice, d.alicuotaIVA);
            const subtotal = d.unitPrice * d.quantity;
            return {
                description: d.description,
                quantity: d.quantity,
                unitPrice: d.unitPrice,
                subtotal,
                ivaAmount,
                total: subtotal + ivaAmount,
                alicuotaIVA: alicuotaLabel,
            };
        }),
        subtotal: amounts.impNeto,
        taxableNetAmount: amounts.impNeto,
        nonTaxableNetAmount: amounts.impTotConc,
        exemptAmount: amounts.impOpEx,
        ivaAmount: amounts.impIVA,
        tributesAmount: amounts.impTrib,
        total: amounts.impTotal,
        withholdingAmount: bill.withholdingAmount || undefined,
        cae: bill.caeData.code,
        caeDueDate: bill.caeData.expirationDate.toLocaleDateString('es-AR'),
        qrDataUrl: qrPng,
        footerText: '',
        concepto: bill.concepto ? BillConcepto[bill.concepto] : undefined,
        serviceDate: bill.serviceDate?.toLocaleDateString('es-AR'),
        servicePeriod:
            bill.startDate && bill.endDate
                ? `${bill.startDate.toLocaleDateString('es-AR')} - ${bill.endDate.toLocaleDateString('es-AR')}`
                : undefined,
        dueDate: bill.dueDate?.toLocaleDateString('es-AR'),
        saleCondition: paymentConditionLabel(bill.saleCondition as PaymentCondition),
    };
    console.log('periodo de servicio:', invoiceData.servicePeriod);
    const html = renderTemplate<InvoiceTemplateData>('invoice', invoiceData);
    const pdfBuffer = await generatePdfFromHtml(html);

    const pdfKey = `bills/${bill.comprobanteNumber}-${bill.billingProfile.legalName}.pdf`;
    await s3Client.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: pdfKey,
            Body: pdfBuffer,
            ContentType: 'application/pdf',
        }),
    );

    const { url, urlExpire } = await getFileSignedUrl(
        pdfKey,
        'application/pdf',
        bill.pdf?.filename ||
            `${bill.comprobanteNumber}-${bill.billingProfile.legalName}.pdf`,
    );

    let fileRecordId: string;
    if (bill.pdfId) {
        // Actualizar archivo existente
        const updated = await prisma.file.update({
            where: { id: bill.pdfId },
            data: {
                size: pdfBuffer.length,
                url,
                urlExpire: new Date(urlExpire),
            },
        });
        fileRecordId = updated.id;
    } else {
        const created = await prisma.file.create({
            data: {
                key: pdfKey,
                filename: `${bill.comprobanteNumber}-${bill.billingProfile.legalName}.pdf`,
                mimeType: 'application/pdf',
                size: pdfBuffer.length,
                url,
                urlExpire: new Date(urlExpire),
            },
        });
        fileRecordId = created.id;
    }

    const updatedBill = await prisma.bill.update({
        where: { id: bill.id },
        data: { pdfId: fileRecordId },
        include: {
            pdf: true,
            tasks: true,
            billingProfile: true,
            business: true,
        },
    });

    return updatedBill;
}

export async function linkTasksToBill(billId: string, input: BillInput): Promise<void> {
    const directTasks = input.taskIds || [];
    directTasks.forEach(async (taskId) => {
        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });
        if (task?.billId || task?.billDetailId) {
            return;
        }
        await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                billId,
            },
        });
    });
    const detailsWithTasks = input.details.filter((detail) => detail.taskId);
    detailsWithTasks.forEach(async (detail) => {
        const taskId = detail.taskId!;
        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });
        if (task?.billId || task?.billDetailId) {
            return;
        }
        await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                billDetailId: detail.id, // Asociar la tarea al detalle específico de la factura
            },
        });
    });
}

export async function handleTaskRelations(
    billId: string,
    input: BillInput,
): Promise<void> {
    const bill = await prisma.bill.findUnique({
        where: { id: billId },
        include: {
            tasks: true,
            details: true,
        },
    });

    if (!bill) {
        return;
    }
    const detailsToUnlink = bill.details.filter((detail) => {
        return !input.details.some((inputDetail) => inputDetail.id === detail.id);
    });
    const directTasks = input.taskIds || [];
    const billTasksToUnlink = bill.tasks.filter((task) => !directTasks.includes(task.id));
    directTasks.forEach(async (taskId) => {
        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });
        if (task?.billId || task?.billDetailId) {
            return;
        }
        await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                billId,
            },
        });
    });
    const detailsWithTasks = input.details.filter((detail) => detail.taskId);
    const detailTasksToUnlink = bill.details.filter((detail) => {
        return !input.details.some((inputDetail) => inputDetail.taskId === detail.taskId);
    });
    detailsWithTasks.forEach(async (detail) => {
        const taskId = detail.taskId!;
        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });
        if (task?.billId || task?.billDetailId) {
            return;
        }
        await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                billDetailId: detail.id, // Asociar la tarea al detalle específico de la factura
            },
        });
    });

    billTasksToUnlink.forEach(async (task) => {
        await prisma.task.update({
            where: { id: task.id },
            data: { billId: null },
        });
    });

    detailTasksToUnlink.forEach(async (detail) => {
        if (detail.taskId) {
            await prisma.task.update({
                where: { id: detail.taskId },
                data: { billDetailId: null },
            });
        }
    });
    detailsToUnlink.forEach(async (detail) => {
        if (detail.taskId) {
            await prisma.task.update({
                where: { id: detail.taskId },
                data: { billDetailId: null },
            });
        }
    });
}
