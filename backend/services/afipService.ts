import Afip from '@afipsdk/afip.js';
import QR from 'qrcode';

import { writeAfipCertAndKey } from './afipCertService';

// Escribir los archivos de certificado y key en /tmp y obtener las rutas
const { certPath, keyPath } = writeAfipCertAndKey();

// Configuración de AFIP (ajustar según tu entorno)
const CUIT = process.env.AFIP_CUIT;
const PRODUCTION = process.env.AFIP_PRODUCTION === 'true';

// Instancia global de AFIP
const afip = new Afip({
    CUIT: CUIT ? parseInt(CUIT) : undefined,
    cert: certPath,
    key: keyPath,
    production: PRODUCTION,
});

export class AfipService {
    /**
     * Crear una factura electrónica y obtener CAE y datos fiscales
     * @param billData - Datos de la factura (ver doc afip.js)
     * @returns { cae, caeVto, resultado, observaciones, ... }
     */
    static async createBillAFIP(billData: any) {
        try {
            // Adaptar billData al formato requerido por afip.js
            const data = { ...billData };
            const result = await afip.ElectronicBilling.createVoucher(data);
            return result;
        } catch (error) {
            console.error('Error creando factura AFIP:', error);
            throw error;
        }
    }

    /**
     * Consultar una factura electrónica por tipo, punto de venta y número
     */
    static async getBillAFIP({
        tipoCbte,
        ptoVta,
        nroCbte,
    }: {
        tipoCbte: number;
        ptoVta: number;
        nroCbte: number;
    }) {
        try {
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
     * Obtener el último número de comprobante emitido para un tipo y punto de venta
     */
    static async getLastBillNumberAFIP({
        tipoCbte,
        ptoVta,
    }: {
        tipoCbte: number;
        ptoVta: number;
    }) {
        try {
            const result = await afip.ElectronicBilling.getLastVoucher(ptoVta, tipoCbte);
            return result;
        } catch (error) {
            console.error('Error obteniendo último comprobante AFIP:', error);
            throw error;
        }
    }

    /**
     * Validar un CUIT contra padrón AFIP
     */
    static async validateCUIT(cuit: string) {
        try {
            const result = await afip.RegisterScopeFive.getTaxpayerDetails(cuit);
            return result;
        } catch (error) {
            console.error('Error validando CUIT AFIP:', error);
            throw error;
        }
    }

    /**
     * Generar el QR legal de la factura (obligatorio en comprobantes electrónicos)
     * @param qrData - Objeto con los datos requeridos por AFIP para el QR
     * @returns { qrPng: string (dataURL) }
     */
    static async generateBillQR(qrData: any) {
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
}
