import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

// Carpeta donde se guardan las plantillas (puedes cambiarla si lo prefieres)
const TEMPLATES_DIR = path.join(__dirname, '../templates');

// Cache de plantillas compiladas para performance
const templateCache: Record<string, Handlebars.TemplateDelegate> = {};

// Registrar helpers de Handlebars para formateo
Handlebars.registerHelper('formatNumber', (value: string | number | undefined) => {
    if (value === undefined || value === null) {
        return '0.00';
    }
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) {
        return '0.00';
    }
    return num.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
});

Handlebars.registerHelper('hasAlicuota', (items: Array<{ alicuotaIVA?: string }>) => {
    return items && items.some((item) => item.alicuotaIVA);
});

/**
 * Tipo completo para los datos de la plantilla de factura electrónica AFIP
 * Incluye todos los campos necesarios para generar el PDF de la factura
 */
export interface InvoiceTemplateData {
    // Información de la empresa emisora
    company: {
        name: string;
        cuit: string;
        address: string;
        grossIncome?: string;
        ivaCondition: string;
    };
    // Información del cliente/receptor
    client: {
        name: string;
        cuit: string;
        address: string;
        ivaCondition: string;
    };
    // Información del comprobante
    billType: string; // Etiqueta legible del tipo (ej: "Factura A")
    billLetter: string; // Letra del comprobante (ej: "A", "B", "C")
    billNumber: string; // Número de comprobante (formato: PPPP-NNNNNNNN)
    billDate: string; // Fecha de emisión (formato localizado)
    emissionDate?: string; // Fecha de emisión alternativa (si difiere de billDate)
    pointOfSale?: number; // Punto de venta (4 dígitos)
    // Detalles/items de la factura
    items: Array<{
        description: string;
        quantity: number;
        unitPrice: string | number;
        subtotal: string | number;
        /** Alícuota de IVA aplicada al item */
        alicuotaIVA?: string;
    }>;
    // Importes y totales
    /** Subtotal sin IVA (importe neto gravado) */
    subtotal?: string | number;
    /** Importe neto gravado (para Factura A) */
    taxableNetAmount?: string | number;
    /** Importe neto no gravado */
    nonTaxableNetAmount?: string | number;
    /** Importe exento */
    exemptAmount?: string | number;
    /** Monto de IVA */
    ivaAmount?: string | number;
    /** Importe de tributos */
    tributesAmount?: string | number;
    /** Total del comprobante */
    total: string | number;
    /** Retenciones aplicadas */
    withholdingAmount?: string | number;
    // Datos AFIP
    cae: string; // Código de Autorización Electrónico
    caeDueDate: string; // Fecha de vencimiento del CAE
    qrDataUrl?: string; // URL o data URL de la imagen QR de AFIP
    // Información adicional
    footerText?: string; // Texto adicional para el pie de página
    observations?: string; // Observaciones de la factura
    concepto?: string; // Concepto AFIP (Productos, Servicios, Productos y Servicios)
    // Fechas y períodos de servicio
    /** Fecha del servicio (para servicios puntuales) */
    serviceDate?: string;
    /** Período del servicio (ej: "01/01/2024 - 31/01/2024") */
    servicePeriod?: string;
    /** Fecha de vencimiento de pago */
    dueDate?: string;
    /** Condición de venta (ej: "Contado", "Cuenta Corriente", "15 días", "30 días") */
    saleCondition?: string;
}

/**
 * Renderiza una plantilla Handlebars con los datos dados
 * @param templateName - Nombre del archivo de plantilla (sin extensión)
 * @param data - Objeto de datos para la plantilla
 * @returns HTML renderizado
 */
export function renderTemplate<T = any>(templateName: string, data: T): string {
    // Buscar en cache primero
    if (!templateCache[templateName]) {
        const templatePath = path.join(TEMPLATES_DIR, `${templateName}.hbs`);
        if (!fs.existsSync(templatePath)) {
            throw new Error(`No se encontró la plantilla: ${templatePath}`);
        }
        const source = fs.readFileSync(templatePath, 'utf8');
        templateCache[templateName] = Handlebars.compile(source);
    }
    return templateCache[templateName](data);
}
