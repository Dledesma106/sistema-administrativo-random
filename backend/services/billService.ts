import { PutObjectCommand } from '@aws-sdk/client-s3';
import {
    Bill,
    BillingProfile,
    Business,
    BillConcepto,
    ComprobanteType,
} from '@prisma/client';

import {
    mapBillToAfipVoucher,
    mapBillToQRData,
    mapComprobanteTypeToAfip,
    calculateBillAmounts,
    AFIP_CBTE_TIPO_LABELS,
    AFIP_ALICUOTA_IVA_LABELS,
    AfipVoucherResponse,
    validateBillForAfip,
} from './afip';
import { getAfipCompanyConfig } from './afip/config';
import { mapAlicuotaIVAToAfip } from './afip/mapper';
import { AfipService } from './afipService';
import { generatePdfFromHtml } from './pdfService';
import { renderTemplate, InvoiceTemplateData } from './templateService';

import { prisma } from 'lib/prisma';

import { s3Client, getFileSignedUrl } from '../s3Client';

// ============================================================================
// TIPOS
// ============================================================================

interface BillWithRelations extends Bill {
    billingProfile: BillingProfile & {
        business: Business;
    };
}

interface CAEDataResult {
    code: string;
    expirationDate: Date;
    status: 'Autorizado' | 'Rechazado' | 'Observado';
}

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
    const bill = (await prisma.bill.findUnique({
        where: { id: billId },
        include: {
            billingProfile: { include: { business: true } },
        },
    })) as BillWithRelations | null;

    if (!bill) {
        throw new Error('Factura no encontrada');
    }

    // 2. Validar datos antes de enviar a AFIP
    const validation = validateBillForAfip({
        tipoDocumento: bill.billingProfile.tipoDocumento,
        numeroDocumento: bill.CUIT,
        comprobanteType: bill.comprobanteType,
        ivaCondition: bill.IVACondition,
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

    // 5. Mapear datos de la factura al formato de AFIP
    const voucherData = mapBillToAfipVoucher(
        {
            ...bill,
            pointOfSale,
        },
        nextVoucherNumber,
    );

    // 6. Emitir en AFIP
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

    // 7. Verificar resultado
    if (afipResponse.Resultado === 'R') {
        const errors =
            afipResponse.Errors?.map((e) => e.Msg).join(', ') || 'Error desconocido';
        throw new Error(`AFIP rechazó el comprobante: ${errors}`);
    }

    // 8. Calcular importes
    const amounts = calculateBillAmounts(bill.details);

    // 9. Preparar datos del CAE (sin comprobanteNumber, ahora está en Bill)
    const caeData: CAEDataResult = {
        code: afipResponse.CAE,
        expirationDate: parseAfipDate(afipResponse.CAEFchVto),
        status: afipResponse.Resultado === 'A' ? 'Autorizado' : 'Observado',
    };

    // 10. Determinar el concepto AFIP basado en la factura
    const concepto: BillConcepto =
        bill.punctualService || bill.startDate
            ? BillConcepto.Servicios
            : BillConcepto.Productos;

    // 11. Construir observaciones si AFIP las envió
    const afipObservations = afipResponse.Observaciones?.map(
        (obs) => `[${obs.Code}] ${obs.Msg}`,
    ).join('; ');

    // 12. Actualizar la Bill con todos los datos de AFIP
    await prisma.bill.update({
        where: { id: billId },
        data: {
            caeData,
            pointOfSale,
            // Número de comprobante formateado
            comprobanteNumber: formatVoucherNumber(pointOfSale, afipResponse.CbteDesde),
            // Fecha de emisión
            emissionDate: new Date(),
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
            name: bill.legalName || '',
            cuit: bill.CUIT || '',
            address: bill.billingAddress || '',
            ivaCondition: bill.IVACondition || '',
        },
        billType: AFIP_CBTE_TIPO_LABELS[cbteTipo] || bill.comprobanteType,
        billLetter: bill.comprobanteType,
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
        observations: bill.observations || afipObservations || undefined,
        concepto: concepto ? BillConcepto[concepto] : undefined,
        // Fechas y períodos de servicio
        serviceDate: bill.serviceDate?.toLocaleDateString('es-AR'),
        servicePeriod:
            bill.startDate && bill.endDate
                ? `${bill.startDate.toLocaleDateString('es-AR')} - ${bill.endDate.toLocaleDateString('es-AR')}`
                : undefined,
        dueDate: bill.dueDate?.toLocaleDateString('es-AR'),
        saleCondition: bill.saleCondition,
    };

    // 15. Renderizar HTML y generar PDF
    const html = renderTemplate<InvoiceTemplateData>('invoice', invoiceData);
    const pdfBuffer = await generatePdfFromHtml(html);

    // 16. Subir PDF a S3
    const pdfKey = `bills/${bill.id}.pdf`;
    await s3Client.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: pdfKey,
            Body: pdfBuffer,
            ContentType: 'application/pdf',
        }),
    );

    // 17. Obtener URL firmada y expiración
    const { url, urlExpire } = await getFileSignedUrl(pdfKey, 'application/pdf');

    // 18. Crear el objeto File
    const file = await prisma.file.create({
        data: {
            key: pdfKey,
            filename: `${bill.id}.pdf`,
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
