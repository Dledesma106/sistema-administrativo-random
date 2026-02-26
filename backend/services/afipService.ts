import Afip from '@afipsdk/afip.js';
import QR from 'qrcode';

import {
    AfipVoucherResponse,
    AfipQRData,
    AfipCbteTipo,
    CreateVoucherParams,
    GetLastVoucherParams,
    GetVoucherInfoParams,
    AFIP_CBTE_TIPO_LABELS,
    AFIP_CONCEPTO_LABELS,
    AFIP_DOC_TIPO_LABELS,
    AFIP_ALICUOTA_IVA_LABELS,
    AFIP_IVA_CONDITION_LABELS,
    AFIP_MONEDA_LABELS,
} from './afip';
import { getAfipCuit, isAfipProduction } from './afip/config';
import { normalizePem } from './afipCertService';

// Instancia lazy de AFIP (se crea solo cuando se necesita)
// Esto es importante para Vercel/serverless donde /tmp es efímero
let afipInstance: Afip | null = null;

/**
 * Obtiene o crea la instancia de AFIP, asegurándose de que los archivos
 * de certificado existan antes de crear la instancia.
 *
 * Optimizado para Vercel serverless:
 * - En Vercel, /tmp es efímero y se limpia entre invocaciones
 * - Los archivos se escriben cada vez que se necesita la instancia
 * - Esto asegura que funcionen incluso si la función serverless se reinicia
 */
function getAfipInstance(): Afip {
    // Si la instancia ya existe y los archivos existen, reutilizarla
    if (afipInstance) {
        return afipInstance;
    }

    // Asegurarse de que los archivos existan (los escribe si no existen)
    //const { certPath, keyPath } = writeAfipCertAndKey();

    // Obtener configuración de AFIP
    let afipCuit: number | undefined;
    try {
        afipCuit = getAfipCuit();
    } catch (error) {
        console.warn('AFIP no configurado correctamente:', error);
        throw new Error('AFIP no está configurado correctamente');
    }

    // Crear nueva instancia
    afipInstance = new Afip({
        CUIT: afipCuit,
        cert: normalizePem(process.env.AFIP_CERT_CONTENT),
        key: normalizePem(process.env.AFIP_KEY_CONTENT),
        production: isAfipProduction(),
        // Permitir pasar un access token proporcionado por app.afipsdk.com
        // El SDK puede esperar la propiedad `access_token` o `token` según la versión,
        // así que incluimos ambas por compatibilidad.
        access_token: process.env.AFIP_ACCESS_TOKEN,
        token: process.env.AFIP_ACCESS_TOKEN,
    });

    return afipInstance;
}

// ============================================================================
// TIPOS INTERNOS PARA RESPUESTAS DEL SDK
// ============================================================================
interface AfipSDKVoucherResult {
    CAE: string;
    CAEFchVto: string;
    CbteDesde?: number;
    CbteHasta?: number;
    Resultado?: string;
    Observaciones?: { Obs?: Array<{ Code: number; Msg: string }> };
    Errors?: Array<{ Code: number; Msg: string }>;
}

interface AfipSDKVoucherInfo {
    CbteTipo: number;
    PtoVta: number;
    CbteNro: number;
    CbteFch: string;
    DocTipo: number;
    DocNro: number;
    ImpTotal: number;
    ImpNeto: number;
    ImpIVA: number;
    ImpOpEx: number;
    ImpTotConc: number;
    ImpTrib: number;
    Concepto: number;
    Resultado: string;
    CodAutorizacion: string;
    FchVto: string;
    Iva?: Array<{ Id: number; BaseImp: number; Importe: number }>;
}

export class AfipService {
    /**
     * Crear una factura electrónica y obtener CAE y datos fiscales
     * @param params - Parámetros del comprobante (punto de venta, tipo y datos)
     * @returns Respuesta de AFIP con CAE y datos del comprobante
     */
    static async createVoucher(
        params: CreateVoucherParams,
    ): Promise<AfipVoucherResponse> {
        try {
            const { ptoVta, cbteTipo, data } = params;

            // El SDK de AFIP espera los datos en un formato específico
            const voucherData = {
                CantReg: 1,
                PtoVta: ptoVta,
                CbteTipo: cbteTipo,
                ...data,
            };

            const afip = getAfipInstance();
            const result: AfipSDKVoucherResult =
                await afip.ElectronicBilling.createVoucher(voucherData);

            // Mapear respuesta al tipo definido
            const response: AfipVoucherResponse = {
                CAE: result.CAE,
                CAEFchVto: result.CAEFchVto,
                CbteDesde: result.CbteDesde || data.CbteDesde,
                CbteHasta: result.CbteHasta || data.CbteHasta,
                Resultado: (result.Resultado as 'A' | 'R' | 'P') || 'A',
            };

            // Agregar observaciones si existen
            if (result.Observaciones?.Obs) {
                response.Observaciones = result.Observaciones.Obs;
            }

            // Agregar errores si existen
            if (result.Errors && result.Errors.length > 0) {
                response.Errors = result.Errors;
            }

            return response;
        } catch (error) {
            console.error('Error creando comprobante en AFIP:', error);
            throw error;
        }
    }

    /**
     * Obtener el último número de comprobante autorizado para un punto de venta y tipo
     * @param params - Punto de venta y tipo de comprobante
     * @returns Último número de comprobante autorizado
     */
    static async getLastVoucherNumber(params: GetLastVoucherParams): Promise<number> {
        try {
            const { ptoVta, cbteTipo } = params;
            const afip = getAfipInstance();
            const result = await afip.ElectronicBilling.getLastVoucher(ptoVta, cbteTipo);
            return result as number;
        } catch (error) {
            console.error('Error obteniendo último comprobante AFIP:', error);
            throw error;
        }
    }

    /**
     * Consultar información de un comprobante específico
     * @param params - Punto de venta, tipo y número de comprobante
     * @returns Información completa del comprobante
     */
    static async getVoucherInfo(
        params: GetVoucherInfoParams,
    ): Promise<AfipSDKVoucherInfo | null> {
        try {
            const { ptoVta, cbteTipo, nroCbte } = params;
            const afip = getAfipInstance();
            const result = await afip.ElectronicBilling.getVoucherInfo(
                nroCbte,
                cbteTipo,
                ptoVta,
            );
            return result as AfipSDKVoucherInfo;
        } catch (error) {
            console.error('Error consultando comprobante AFIP:', error);
            throw error;
        }
    }

    /**
     * Validar un CUIT contra padrón AFIP
     * @param cuit - CUIT a validar (con o sin guiones)
     * @returns Datos del contribuyente si existe
     */
    static async validateCUIT(cuit: string): Promise<unknown> {
        try {
            const cleanedCuit = cuit.replace(/[-\s]/g, '');
            const afip = getAfipInstance();
            const result = await afip.RegisterScopeFive.getTaxpayerDetails(cleanedCuit);
            return result;
        } catch (error) {
            console.error('Error validando CUIT AFIP:', error);
            throw error;
        }
    }

    /**
     * Obtener los puntos de venta habilitados
     * @returns Lista de puntos de venta
     */
    static async getSalesPoints(): Promise<
        Array<{
            Nro: number;
            EmisionTipo: string;
            Bloqueado: string;
            FchBaja: string | null;
        }>
    > {
        try {
            const afip = getAfipInstance();
            const result = await afip.ElectronicBilling.getSalesPoints();
            return result as Array<{
                Nro: number;
                EmisionTipo: string;
                Bloqueado: string;
                FchBaja: string | null;
            }>;
        } catch (error) {
            console.error('Error obteniendo puntos de venta AFIP:', error);
            throw error;
        }
    }

    /**
     * Generar el QR legal de la factura (obligatorio en comprobantes electrónicos)
     * @param qrData - Objeto con los datos requeridos por AFIP para el QR
     * @returns URL del QR de AFIP y la imagen en base64
     */
    static async generateBillQR(
        qrData: AfipQRData,
    ): Promise<{ qrPng: string; url: string }> {
        try {
            // AFIP requiere que el QR sea un JSON base64-url-safe
            const json = JSON.stringify(qrData);
            const base64 = Buffer.from(json).toString('base64');
            const url = `https://www.afip.gob.ar/fe/qr/?p=${base64}`;
            const qrPng = await QR.toDataURL(url);
            return {
                qrPng,
                url,
            };
        } catch (error) {
            console.error('Error generando QR de factura:', error);
            throw error;
        }
    }

    // ============================================================================
    // FUNCIONES DE UTILIDAD PARA OBTENER LABELS LEGIBLES
    // ============================================================================

    /**
     * Obtener label legible para tipo de comprobante
     */
    static getComprobanteLabel(cbteTipo: AfipCbteTipo): string {
        return AFIP_CBTE_TIPO_LABELS[cbteTipo] || `Tipo ${cbteTipo}`;
    }

    /**
     * Obtener todos los tipos de comprobante con sus labels
     */
    static getAllComprobanteTypes(): Array<{ code: number; label: string }> {
        return Object.entries(AFIP_CBTE_TIPO_LABELS).map(([code, label]) => ({
            code: parseInt(code, 10),
            label,
        }));
    }

    /**
     * Obtener todos los tipos de concepto con sus labels
     */
    static getAllConceptos(): Array<{ code: number; label: string }> {
        return Object.entries(AFIP_CONCEPTO_LABELS).map(([code, label]) => ({
            code: parseInt(code, 10),
            label,
        }));
    }

    /**
     * Obtener todos los tipos de documento con sus labels
     */
    static getAllDocumentoTypes(): Array<{ code: number; label: string }> {
        return Object.entries(AFIP_DOC_TIPO_LABELS).map(([code, label]) => ({
            code: parseInt(code, 10),
            label,
        }));
    }

    /**
     * Obtener todas las alícuotas de IVA con sus labels
     */
    static getAllAlicuotasIVA(): Array<{ code: number; label: string }> {
        return Object.entries(AFIP_ALICUOTA_IVA_LABELS).map(([code, label]) => ({
            code: parseInt(code, 10),
            label,
        }));
    }

    /**
     * Obtener todas las condiciones de IVA con sus labels
     */
    static getAllIVAConditions(): Array<{ code: number; label: string }> {
        return Object.entries(AFIP_IVA_CONDITION_LABELS).map(([code, label]) => ({
            code: parseInt(code, 10),
            label,
        }));
    }

    /**
     * Obtener todas las monedas con sus labels
     */
    static getAllMonedas(): Array<{ code: string; label: string }> {
        return Object.entries(AFIP_MONEDA_LABELS).map(([code, label]) => ({
            code,
            label,
        }));
    }

    // ============================================================================
    // MÉTODOS LEGACY (mantener compatibilidad hacia atrás)
    // ============================================================================

    /**
     * @deprecated Usar createVoucher con tipos correctos
     */
    static async createBillAFIP(billData: unknown): Promise<unknown> {
        try {
            const afip = getAfipInstance();
            const result = await afip.ElectronicBilling.createVoucher(billData);
            return result;
        } catch (error) {
            console.error('Error creando factura AFIP:', error);
            throw error;
        }
    }

    /**
     * @deprecated Usar getVoucherInfo con tipos correctos
     */
    static async getBillAFIP({
        tipoCbte,
        ptoVta,
        nroCbte,
    }: {
        tipoCbte: number;
        ptoVta: number;
        nroCbte: number;
    }): Promise<unknown> {
        try {
            const afip = getAfipInstance();
            const result = await afip.ElectronicBilling.getVoucherInfo(
                nroCbte,
                tipoCbte,
                ptoVta,
            );
            return result;
        } catch (error) {
            console.error('Error consultando factura AFIP:', error);
            throw error;
        }
    }

    /**
     * @deprecated Usar getLastVoucherNumber con tipos correctos
     */
    static async getLastBillNumberAFIP({
        tipoCbte,
        ptoVta,
    }: {
        tipoCbte: number;
        ptoVta: number;
    }): Promise<number> {
        try {
            const afip = getAfipInstance();
            const result = await afip.ElectronicBilling.getLastVoucher(ptoVta, tipoCbte);
            return result as number;
        } catch (error) {
            console.error('Error obteniendo último comprobante AFIP:', error);
            throw error;
        }
    }
}
