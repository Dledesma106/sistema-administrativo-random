/**
 * Funciones para mapear datos de la base de datos al formato de AFIP
 */

import {
    AlicuotaIVA,
    ComprobanteType,
    IVACondition,
    TipoDocumento,
} from '@prisma/client';

import {
    AfipVoucherData,
    AfipIvaItem,
    AfipQRData,
    AfipCbteTipo,
    AfipDocTipo,
    AfipConcepto,
    AfipAlicuotaIva,
    AFIP_CBTE_TIPO,
    AFIP_DOC_TIPO,
    AFIP_CONCEPTO,
    AFIP_ALICUOTA_IVA,
    AFIP_ALICUOTA_IVA_PORCENTAJE,
    AFIP_MONEDA,
} from './types';

// ============================================================================
// TIPOS DE LA BASE DE DATOS (Bill y BillDetail)
// ============================================================================
interface BillDetail {
    description: string;
    quantity: number;
    unitPrice: number;
    alicuotaIVA: AlicuotaIVA;
}

interface BillFromDB {
    id: string;
    createdAt: Date;
    comprobanteType: ComprobanteType;
    CUIT: string;
    IVACondition: IVACondition;
    details: BillDetail[];
    punctualService: boolean;
    serviceDate?: Date | null;
    startDate?: Date | null;
    endDate?: Date | null;
    dueDate?: Date | null;
    pointOfSale?: number | null;
    withholdingAmount?: number | null;
}

// ============================================================================
// MAPEO: Tipo de Documento DB -> AFIP
// ============================================================================
export function mapTipoDocumentoToAfip(tipoDoc: TipoDocumento): AfipDocTipo {
    const mapping: Record<TipoDocumento, AfipDocTipo> = {
        CUIT: AFIP_DOC_TIPO.CUIT,
        CUIL: AFIP_DOC_TIPO.CUIL,
        DNI: AFIP_DOC_TIPO.DNI,
        CDI: AFIP_DOC_TIPO.CDI,
        Pasaporte: AFIP_DOC_TIPO.PASAPORTE,
        LE: AFIP_DOC_TIPO.LE,
        LC: AFIP_DOC_TIPO.LC,
        CIExtranjera: AFIP_DOC_TIPO.CI_EXTRANJERA,
        EnTramite: AFIP_DOC_TIPO.EN_TRAMITE,
        ActaNacimiento: AFIP_DOC_TIPO.ACTA_NACIMIENTO,
        SinIdentificar: AFIP_DOC_TIPO.SIN_IDENTIFICAR,
        Otro: AFIP_DOC_TIPO.OTRO,
    };
    return mapping[tipoDoc] ?? AFIP_DOC_TIPO.OTRO;
}

// ============================================================================
// MAPEO: Tipo de Comprobante DB -> AFIP
// ============================================================================
export function mapComprobanteTypeToAfip(tipo: ComprobanteType): AfipCbteTipo {
    const mapping: Record<ComprobanteType, AfipCbteTipo> = {
        // Facturas
        FacturaA: AFIP_CBTE_TIPO.FACTURA_A,
        FacturaB: AFIP_CBTE_TIPO.FACTURA_B,
        FacturaC: AFIP_CBTE_TIPO.FACTURA_C,
        // Notas de Débito
        NotaDebitoA: AFIP_CBTE_TIPO.NOTA_DEBITO_A,
        NotaDebitoB: AFIP_CBTE_TIPO.NOTA_DEBITO_B,
        NotaDebitoC: AFIP_CBTE_TIPO.NOTA_DEBITO_C,
        // Notas de Crédito
        NotaCreditoA: AFIP_CBTE_TIPO.NOTA_CREDITO_A,
        NotaCreditoB: AFIP_CBTE_TIPO.NOTA_CREDITO_B,
        NotaCreditoC: AFIP_CBTE_TIPO.NOTA_CREDITO_C,
        // Facturas M
        FacturaM: AFIP_CBTE_TIPO.FACTURA_M,
        NotaDebitoM: AFIP_CBTE_TIPO.NOTA_DEBITO_M,
        NotaCreditoM: AFIP_CBTE_TIPO.NOTA_CREDITO_M,
        // Exportación
        FacturaE: AFIP_CBTE_TIPO.FACTURA_E,
        NotaDebitoE: AFIP_CBTE_TIPO.NOTA_DEBITO_E,
        NotaCreditoE: AFIP_CBTE_TIPO.NOTA_CREDITO_E,
    };
    return mapping[tipo];
}

// ============================================================================
// MAPEO: Alícuota IVA DB -> AFIP
// ============================================================================
export function mapAlicuotaIVAToAfip(alicuota: AlicuotaIVA): AfipAlicuotaIva {
    const mapping: Record<AlicuotaIVA, AfipAlicuotaIva> = {
        NoGravado: AFIP_ALICUOTA_IVA.NO_GRAVADO,
        Exento: AFIP_ALICUOTA_IVA.EXENTO,
        IVA_0: AFIP_ALICUOTA_IVA.IVA_0,
        IVA_10_5: AFIP_ALICUOTA_IVA.IVA_10_5,
        IVA_21: AFIP_ALICUOTA_IVA.IVA_21,
        IVA_27: AFIP_ALICUOTA_IVA.IVA_27,
        IVA_5: AFIP_ALICUOTA_IVA.IVA_5,
        IVA_2_5: AFIP_ALICUOTA_IVA.IVA_2_5,
    };
    return mapping[alicuota];
}

// ============================================================================
// MAPEO: Condición IVA DB -> Tipo Documento AFIP (para determinar DocTipo)
// ============================================================================
export function getDocTipoFromIVACondition(condition: IVACondition): AfipDocTipo {
    // Consumidor Final no requiere CUIT
    if (condition === 'ConsumidorFinal') {
        return AFIP_DOC_TIPO.SIN_IDENTIFICAR;
    }
    // Resto de condiciones requieren CUIT
    return AFIP_DOC_TIPO.CUIT;
}

// ============================================================================
// DETERMINAR CONCEPTO AFIP
// ============================================================================
export function getConceptoAfip(bill: BillFromDB): AfipConcepto {
    // Si es un servicio puntual o tiene fechas de servicio, es un servicio
    if (bill.punctualService || bill.startDate || bill.endDate) {
        return AFIP_CONCEPTO.SERVICIOS;
    }
    // Por defecto, productos
    return AFIP_CONCEPTO.PRODUCTOS;
}

// ============================================================================
// FORMATEAR FECHA PARA AFIP (YYYYMMDD)
// ============================================================================
export function formatDateForAfip(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// ============================================================================
// FORMATEAR FECHA PARA QR AFIP (YYYY-MM-DD)
// ============================================================================
export function formatDateForQR(date: Date): string {
    return date.toISOString().split('T')[0];
}

// ============================================================================
// LIMPIAR CUIT (remover guiones y espacios)
// ============================================================================
export function cleanCuit(cuit: string): number {
    return parseInt(cuit.replace(/[-\s]/g, ''), 10);
}

// ============================================================================
// CALCULAR IMPORTES DE LA FACTURA
// ============================================================================
interface BillAmounts {
    /** Importe neto gravado (suma de subtotales sin IVA) */
    impNeto: number;
    /** Importe total de IVA */
    impIVA: number;
    /** Importe total (neto + IVA) */
    impTotal: number;
    /** Importe de operaciones exentas */
    impOpEx: number;
    /** Importe de conceptos no gravados */
    impTotConc: number;
    /** Importe de tributos */
    impTrib: number;
    /** Detalle de IVA por alícuota */
    ivaItems: AfipIvaItem[];
}

export function calculateBillAmounts(details: BillDetail[]): BillAmounts {
    // Agrupar por alícuota de IVA
    const ivaByRate: Map<AfipAlicuotaIva, { baseImp: number; importe: number }> =
        new Map();

    let impNeto = 0;
    let impIVA = 0;
    let impOpEx = 0;
    let impTotConc = 0;

    for (const detail of details) {
        const subtotal = detail.quantity * detail.unitPrice;
        const alicuotaAfip = mapAlicuotaIVAToAfip(detail.alicuotaIVA);
        const porcentajeIva = AFIP_ALICUOTA_IVA_PORCENTAJE[alicuotaAfip];
        const importeIva = subtotal * (porcentajeIva / 100);

        // Clasificar según el tipo de alícuota
        // Exento: operaciones exentas de IVA
        if (
            alicuotaAfip === AFIP_ALICUOTA_IVA.EXENTO ||
            detail.alicuotaIVA === 'Exento'
        ) {
            impOpEx += subtotal;
            // No Gravado: conceptos que no integran el precio neto gravado
        } else if (
            alicuotaAfip === AFIP_ALICUOTA_IVA.NO_GRAVADO ||
            detail.alicuotaIVA === 'NoGravado'
        ) {
            impTotConc += subtotal;
            // Resto: operaciones gravadas
        } else {
            impNeto += subtotal;
            impIVA += importeIva;

            // Agregar al grupo de IVA (solo para alícuotas > 0)
            if (porcentajeIva > 0) {
                const existing = ivaByRate.get(alicuotaAfip);
                if (existing) {
                    existing.baseImp += subtotal;
                    existing.importe += importeIva;
                } else {
                    ivaByRate.set(alicuotaAfip, {
                        baseImp: subtotal,
                        importe: importeIva,
                    });
                }
            }
        }
    }

    // Convertir mapa a array de IvaItems
    const ivaItems: AfipIvaItem[] = Array.from(ivaByRate.entries()).map(([id, data]) => ({
        Id: id,
        BaseImp: roundToTwoDecimals(data.baseImp),
        Importe: roundToTwoDecimals(data.importe),
    }));

    const impTotal = impNeto + impIVA + impOpEx + impTotConc;

    return {
        impNeto: roundToTwoDecimals(impNeto),
        impIVA: roundToTwoDecimals(impIVA),
        impTotal: roundToTwoDecimals(impTotal),
        impOpEx: roundToTwoDecimals(impOpEx),
        impTotConc: roundToTwoDecimals(impTotConc),
        impTrib: 0, // Sin tributos adicionales por ahora
        ivaItems,
    };
}

// ============================================================================
// REDONDEAR A 2 DECIMALES
// ============================================================================
export function roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
}

// ============================================================================
// MAPPER PRINCIPAL: Bill DB -> AfipVoucherData
// ============================================================================
export function mapBillToAfipVoucher(
    bill: BillFromDB,
    nextVoucherNumber: number,
): AfipVoucherData {
    const concepto = getConceptoAfip(bill);
    const amounts = calculateBillAmounts(bill.details);
    const docTipo = getDocTipoFromIVACondition(bill.IVACondition);
    const docNro = docTipo === AFIP_DOC_TIPO.SIN_IDENTIFICAR ? 0 : cleanCuit(bill.CUIT);

    const voucherData: AfipVoucherData = {
        Concepto: concepto,
        DocTipo: docTipo,
        DocNro: docNro,
        CbteDesde: nextVoucherNumber,
        CbteHasta: nextVoucherNumber,
        CbteFch: formatDateForAfip(bill.createdAt),
        ImpTotal: amounts.impTotal,
        ImpTotConc: amounts.impTotConc,
        ImpNeto: amounts.impNeto,
        ImpOpEx: amounts.impOpEx,
        ImpIVA: amounts.impIVA,
        ImpTrib: amounts.impTrib,
        MonId: AFIP_MONEDA.PESO_ARGENTINO,
        MonCotiz: 1,
    };

    // Si es servicio, agregar fechas de servicio
    if (
        concepto === AFIP_CONCEPTO.SERVICIOS ||
        concepto === AFIP_CONCEPTO.PRODUCTOS_Y_SERVICIOS
    ) {
        if (bill.punctualService && bill.serviceDate) {
            // Servicio puntual: misma fecha inicio y fin
            voucherData.FchServDesde = formatDateForAfip(bill.serviceDate);
            voucherData.FchServHasta = formatDateForAfip(bill.serviceDate);
        } else {
            // Servicio con rango de fechas
            if (bill.startDate) {
                voucherData.FchServDesde = formatDateForAfip(bill.startDate);
            }
            if (bill.endDate) {
                voucherData.FchServHasta = formatDateForAfip(bill.endDate);
            }
        }

        // Fecha de vencimiento del pago
        if (bill.dueDate) {
            voucherData.FchVtoPago = formatDateForAfip(bill.dueDate);
        } else {
            // Si no hay fecha de vencimiento, usar 10 días desde la fecha de emisión
            const defaultDueDate = new Date(bill.createdAt);
            defaultDueDate.setDate(defaultDueDate.getDate() + 10);
            voucherData.FchVtoPago = formatDateForAfip(defaultDueDate);
        }
    }

    // Agregar detalle de IVA si hay items gravados
    // Los comprobantes C no requieren detalle de IVA (son para Monotributistas o Exentos)
    const isComprobanteC = ['FacturaC', 'NotaDebitoC', 'NotaCreditoC'].includes(
        bill.comprobanteType,
    );
    if (amounts.ivaItems.length > 0 && !isComprobanteC) {
        voucherData.Iva = amounts.ivaItems;
    }

    return voucherData;
}

// ============================================================================
// MAPPER: Datos para generar QR de AFIP
// ============================================================================
export function mapBillToQRData(
    bill: BillFromDB,
    cae: string,
    comprobanteNumber: number,
    emisorCuit: string,
): AfipQRData {
    const amounts = calculateBillAmounts(bill.details);
    const docTipo = getDocTipoFromIVACondition(bill.IVACondition);
    const docNro = docTipo === AFIP_DOC_TIPO.SIN_IDENTIFICAR ? 0 : cleanCuit(bill.CUIT);

    return {
        ver: 1,
        fecha: formatDateForQR(bill.createdAt),
        cuit: cleanCuit(emisorCuit),
        ptoVta: bill.pointOfSale || 1,
        tipoCmp: mapComprobanteTypeToAfip(bill.comprobanteType),
        nroCmp: comprobanteNumber,
        importe: amounts.impTotal,
        moneda: AFIP_MONEDA.PESO_ARGENTINO,
        ctz: 1,
        tipoDocRec: docTipo,
        nroDocRec: docNro,
        tipoCodAut: 'E',
        codAut: parseInt(cae, 10),
    };
}
