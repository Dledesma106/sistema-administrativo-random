/**
 * Tipos de TypeScript para la integración con AFIP SDK
 * Basado en el servicio WSFEv1 de AFIP
 */

// ============================================================================
// TIPOS DE DOCUMENTO (DocTipo)
// ============================================================================
export const AFIP_DOC_TIPO = {
    CUIT: 80,
    CUIL: 86,
    DNI: 96,
    CDI: 87,
    LE: 89, // Libreta de Enrolamiento
    LC: 90, // Libreta Cívica
    CI_EXTRANJERA: 91,
    EN_TRAMITE: 92,
    ACTA_NACIMIENTO: 93,
    PASAPORTE: 94,
    CI_BS_AS_RNP: 95,
    SIN_IDENTIFICAR: 99, // Consumidor Final
    OTRO: 0,
} as const;

export type AfipDocTipo = (typeof AFIP_DOC_TIPO)[keyof typeof AFIP_DOC_TIPO];

// Labels legibles para tipos de documento
export const AFIP_DOC_TIPO_LABELS: Record<AfipDocTipo, string> = {
    [AFIP_DOC_TIPO.CUIT]: 'CUIT',
    [AFIP_DOC_TIPO.CUIL]: 'CUIL',
    [AFIP_DOC_TIPO.DNI]: 'DNI',
    [AFIP_DOC_TIPO.CDI]: 'CDI',
    [AFIP_DOC_TIPO.LE]: 'Libreta de Enrolamiento',
    [AFIP_DOC_TIPO.LC]: 'Libreta Cívica',
    [AFIP_DOC_TIPO.CI_EXTRANJERA]: 'CI Extranjera',
    [AFIP_DOC_TIPO.EN_TRAMITE]: 'En Trámite',
    [AFIP_DOC_TIPO.ACTA_NACIMIENTO]: 'Acta de Nacimiento',
    [AFIP_DOC_TIPO.PASAPORTE]: 'Pasaporte',
    [AFIP_DOC_TIPO.CI_BS_AS_RNP]: 'CI Bs. As. RNP',
    [AFIP_DOC_TIPO.SIN_IDENTIFICAR]: 'Sin Identificar / Consumidor Final',
    [AFIP_DOC_TIPO.OTRO]: 'Otro',
};

// ============================================================================
// TIPOS DE COMPROBANTE (CbteTipo)
// ============================================================================
export const AFIP_CBTE_TIPO = {
    FACTURA_A: 1,
    NOTA_DEBITO_A: 2,
    NOTA_CREDITO_A: 3,
    FACTURA_B: 6,
    NOTA_DEBITO_B: 7,
    NOTA_CREDITO_B: 8,
    FACTURA_C: 11,
    NOTA_DEBITO_C: 12,
    NOTA_CREDITO_C: 13,
    FACTURA_M: 51,
    NOTA_DEBITO_M: 52,
    NOTA_CREDITO_M: 53,
    FACTURA_E: 19, // Exportación
    NOTA_DEBITO_E: 20,
    NOTA_CREDITO_E: 21,
} as const;

export type AfipCbteTipo = (typeof AFIP_CBTE_TIPO)[keyof typeof AFIP_CBTE_TIPO];

// Labels legibles para tipos de comprobante
export const AFIP_CBTE_TIPO_LABELS: Record<AfipCbteTipo, string> = {
    [AFIP_CBTE_TIPO.FACTURA_A]: 'Factura A',
    [AFIP_CBTE_TIPO.NOTA_DEBITO_A]: 'Nota de Débito A',
    [AFIP_CBTE_TIPO.NOTA_CREDITO_A]: 'Nota de Crédito A',
    [AFIP_CBTE_TIPO.FACTURA_B]: 'Factura B',
    [AFIP_CBTE_TIPO.NOTA_DEBITO_B]: 'Nota de Débito B',
    [AFIP_CBTE_TIPO.NOTA_CREDITO_B]: 'Nota de Crédito B',
    [AFIP_CBTE_TIPO.FACTURA_C]: 'Factura C',
    [AFIP_CBTE_TIPO.NOTA_DEBITO_C]: 'Nota de Débito C',
    [AFIP_CBTE_TIPO.NOTA_CREDITO_C]: 'Nota de Crédito C',
    [AFIP_CBTE_TIPO.FACTURA_M]: 'Factura M',
    [AFIP_CBTE_TIPO.NOTA_DEBITO_M]: 'Nota de Débito M',
    [AFIP_CBTE_TIPO.NOTA_CREDITO_M]: 'Nota de Crédito M',
    [AFIP_CBTE_TIPO.FACTURA_E]: 'Factura E (Exportación)',
    [AFIP_CBTE_TIPO.NOTA_DEBITO_E]: 'Nota de Débito E',
    [AFIP_CBTE_TIPO.NOTA_CREDITO_E]: 'Nota de Crédito E',
};

// ============================================================================
// CONCEPTO (Concepto)
// ============================================================================
export const AFIP_CONCEPTO = {
    PRODUCTOS: 1,
    SERVICIOS: 2,
    PRODUCTOS_Y_SERVICIOS: 3,
} as const;

export type AfipConcepto = (typeof AFIP_CONCEPTO)[keyof typeof AFIP_CONCEPTO];

// Labels legibles para conceptos
export const AFIP_CONCEPTO_LABELS: Record<AfipConcepto, string> = {
    [AFIP_CONCEPTO.PRODUCTOS]: 'Productos',
    [AFIP_CONCEPTO.SERVICIOS]: 'Servicios',
    [AFIP_CONCEPTO.PRODUCTOS_Y_SERVICIOS]: 'Productos y Servicios',
};

// ============================================================================
// ALÍCUOTAS DE IVA
// ============================================================================
export const AFIP_ALICUOTA_IVA = {
    NO_GRAVADO: 1,
    EXENTO: 2,
    IVA_0: 3,
    IVA_10_5: 4,
    IVA_21: 5,
    IVA_27: 6,
    IVA_5: 8,
    IVA_2_5: 9,
} as const;

export type AfipAlicuotaIva = (typeof AFIP_ALICUOTA_IVA)[keyof typeof AFIP_ALICUOTA_IVA];

// Labels legibles para alícuotas de IVA
export const AFIP_ALICUOTA_IVA_LABELS: Record<AfipAlicuotaIva, string> = {
    [AFIP_ALICUOTA_IVA.NO_GRAVADO]: 'No Gravado',
    [AFIP_ALICUOTA_IVA.EXENTO]: 'Exento',
    [AFIP_ALICUOTA_IVA.IVA_0]: 'IVA 0%',
    [AFIP_ALICUOTA_IVA.IVA_10_5]: 'IVA 10.5%',
    [AFIP_ALICUOTA_IVA.IVA_21]: 'IVA 21%',
    [AFIP_ALICUOTA_IVA.IVA_27]: 'IVA 27%',
    [AFIP_ALICUOTA_IVA.IVA_5]: 'IVA 5%',
    [AFIP_ALICUOTA_IVA.IVA_2_5]: 'IVA 2.5%',
};

// Porcentajes de IVA
export const AFIP_ALICUOTA_IVA_PORCENTAJE: Record<AfipAlicuotaIva, number> = {
    [AFIP_ALICUOTA_IVA.NO_GRAVADO]: 0,
    [AFIP_ALICUOTA_IVA.EXENTO]: 0,
    [AFIP_ALICUOTA_IVA.IVA_0]: 0,
    [AFIP_ALICUOTA_IVA.IVA_10_5]: 10.5,
    [AFIP_ALICUOTA_IVA.IVA_21]: 21,
    [AFIP_ALICUOTA_IVA.IVA_27]: 27,
    [AFIP_ALICUOTA_IVA.IVA_5]: 5,
    [AFIP_ALICUOTA_IVA.IVA_2_5]: 2.5,
};

// ============================================================================
// MONEDAS
// ============================================================================
export const AFIP_MONEDA = {
    PESO_ARGENTINO: 'PES',
    DOLAR_ESTADOUNIDENSE: 'DOL',
    EURO: '060',
    REAL: '012',
} as const;

export type AfipMoneda = (typeof AFIP_MONEDA)[keyof typeof AFIP_MONEDA];

export const AFIP_MONEDA_LABELS: Record<AfipMoneda, string> = {
    [AFIP_MONEDA.PESO_ARGENTINO]: 'Pesos Argentinos',
    [AFIP_MONEDA.DOLAR_ESTADOUNIDENSE]: 'Dólar Estadounidense',
    [AFIP_MONEDA.EURO]: 'Euro',
    [AFIP_MONEDA.REAL]: 'Real Brasileño',
};

// ============================================================================
// CONDICIONES DE IVA DEL RECEPTOR
// ============================================================================
export const AFIP_IVA_CONDITION = {
    RESPONSABLE_INSCRIPTO: 1,
    MONOTRIBUTO: 6,
    EXENTO: 4,
    CONSUMIDOR_FINAL: 5,
    NO_RESPONSABLE: 7,
} as const;

export type AfipIvaCondition =
    (typeof AFIP_IVA_CONDITION)[keyof typeof AFIP_IVA_CONDITION];

export const AFIP_IVA_CONDITION_LABELS: Record<AfipIvaCondition, string> = {
    [AFIP_IVA_CONDITION.RESPONSABLE_INSCRIPTO]: 'IVA Responsable Inscripto',
    [AFIP_IVA_CONDITION.MONOTRIBUTO]: 'Responsable Monotributo',
    [AFIP_IVA_CONDITION.EXENTO]: 'IVA Sujeto Exento',
    [AFIP_IVA_CONDITION.CONSUMIDOR_FINAL]: 'Consumidor Final',
    [AFIP_IVA_CONDITION.NO_RESPONSABLE]: 'IVA No Responsable',
};

// ============================================================================
// ESTRUCTURA DE IVA PARA EL COMPROBANTE
// ============================================================================
export interface AfipIvaItem {
    /** Código de alícuota de IVA (ver AFIP_ALICUOTA_IVA) */
    Id: AfipAlicuotaIva;
    /** Base imponible para esta alícuota */
    BaseImp: number;
    /** Importe del IVA calculado */
    Importe: number;
}

// ============================================================================
// TRIBUTOS ADICIONALES
// ============================================================================
export interface AfipTributo {
    /** Código del tributo */
    Id: number;
    /** Descripción del tributo */
    Desc: string;
    /** Base imponible */
    BaseImp: number;
    /** Alícuota del tributo */
    Alic: number;
    /** Importe del tributo */
    Importe: number;
}

// ============================================================================
// COMPROBANTES ASOCIADOS (para notas de crédito/débito)
// ============================================================================
export interface AfipCbteAsoc {
    /** Tipo de comprobante asociado */
    Tipo: AfipCbteTipo;
    /** Punto de venta del comprobante asociado */
    PtoVta: number;
    /** Número del comprobante asociado */
    Nro: number;
    /** CUIT del emisor del comprobante asociado */
    Cuit?: number;
    /** Fecha del comprobante asociado (YYYYMMDD) */
    CbteFch?: string;
}

// ============================================================================
// DATOS DEL COMPROBANTE PARA CREAR EN AFIP (createVoucher)
// ============================================================================
export interface AfipVoucherData {
    /** Concepto del comprobante (1=Productos, 2=Servicios, 3=Ambos) */
    Concepto: AfipConcepto;
    /** Tipo de documento del receptor */
    DocTipo: AfipDocTipo;
    /** Número de documento del receptor (sin guiones) */
    DocNro: number;
    /** Número de comprobante desde */
    CbteDesde: number;
    /** Número de comprobante hasta (mismo que CbteDesde para un solo comprobante) */
    CbteHasta: number;
    /** Fecha del comprobante (formato YYYYMMDD) */
    CbteFch: string;
    /** Importe total del comprobante */
    ImpTotal: number;
    /** Importe total de conceptos que no integran el precio neto gravado */
    ImpTotConc: number;
    /** Importe neto gravado */
    ImpNeto: number;
    /** Importe de operaciones exentas */
    ImpOpEx: number;
    /** Importe total de IVA */
    ImpIVA: number;
    /** Importe total de tributos */
    ImpTrib: number;
    /** Fecha de inicio del servicio (YYYYMMDD) - Requerido para Concepto 2 o 3 */
    FchServDesde?: string;
    /** Fecha de fin del servicio (YYYYMMDD) - Requerido para Concepto 2 o 3 */
    FchServHasta?: string;
    /** Fecha de vencimiento del pago (YYYYMMDD) - Requerido para Concepto 2 o 3 */
    FchVtoPago?: string;
    /** Código de moneda (default: PES) */
    MonId?: AfipMoneda;
    /** Cotización de la moneda (default: 1 para pesos) */
    MonCotiz?: number;
    /** Detalle de alícuotas de IVA */
    Iva?: AfipIvaItem[];
    /** Tributos adicionales */
    Tributos?: AfipTributo[];
    /** Comprobantes asociados (para notas de crédito/débito) */
    CbtesAsoc?: AfipCbteAsoc[];
}

// ============================================================================
// PARÁMETROS PARA CREAR COMPROBANTE
// ============================================================================
export interface CreateVoucherParams {
    /** Punto de venta (4 dígitos) */
    ptoVta: number;
    /** Tipo de comprobante (ver AFIP_CBTE_TIPO) */
    cbteTipo: AfipCbteTipo;
    /** Datos del comprobante */
    data: AfipVoucherData;
}

// ============================================================================
// RESPUESTA DE AFIP AL CREAR COMPROBANTE
// ============================================================================
export interface AfipVoucherResponse {
    /** Código de Autorización Electrónica */
    CAE: string;
    /** Fecha de vencimiento del CAE (formato YYYYMMDD) */
    CAEFchVto: string;
    /** Número de comprobante asignado */
    CbteDesde: number;
    /** Número de comprobante hasta */
    CbteHasta: number;
    /** Resultado del proceso: 'A' = Aprobado, 'R' = Rechazado, 'P' = Parcial */
    Resultado: 'A' | 'R' | 'P';
    /** Observaciones (errores leves) */
    Observaciones?: AfipObservacion[];
    /** Errores (si el comprobante fue rechazado) */
    Errors?: AfipError[];
}

export interface AfipObservacion {
    Code: number;
    Msg: string;
}

export interface AfipError {
    Code: number;
    Msg: string;
}

// ============================================================================
// PARÁMETROS PARA CONSULTAS
// ============================================================================
export interface GetLastVoucherParams {
    /** Punto de venta */
    ptoVta: number;
    /** Tipo de comprobante */
    cbteTipo: AfipCbteTipo;
}

export interface GetVoucherInfoParams {
    /** Punto de venta */
    ptoVta: number;
    /** Tipo de comprobante */
    cbteTipo: AfipCbteTipo;
    /** Número de comprobante */
    nroCbte: number;
}

// ============================================================================
// DATOS DEL QR DE AFIP
// ============================================================================
export interface AfipQRData {
    /** Versión del formato (siempre 1) */
    ver: 1;
    /** Fecha de emisión (YYYY-MM-DD) */
    fecha: string;
    /** CUIT del emisor (sin guiones) */
    cuit: number;
    /** Punto de venta */
    ptoVta: number;
    /** Tipo de comprobante */
    tipoCmp: AfipCbteTipo;
    /** Número de comprobante */
    nroCmp: number;
    /** Importe total */
    importe: number;
    /** Código de moneda */
    moneda: string;
    /** Cotización de la moneda */
    ctz: number;
    /** Tipo de documento del receptor */
    tipoDocRec: AfipDocTipo;
    /** Número de documento del receptor */
    nroDocRec: number;
    /** Tipo de código de autorización ('E' = CAE) */
    tipoCodAut: 'E' | 'A';
    /** Código de autorización (CAE) */
    codAut: number;
}
