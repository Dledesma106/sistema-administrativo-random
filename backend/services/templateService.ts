import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

// Carpeta donde se guardan las plantillas (puedes cambiarla si lo prefieres)
const TEMPLATES_DIR = path.join(__dirname, '../templates');

// Cache de plantillas compiladas para performance
const templateCache: Record<string, Handlebars.TemplateDelegate> = {};

// Tipo para los datos de la plantilla de factura
export interface InvoiceTemplateData {
    company: {
        name: string;
        cuit: string;
        address: string;
        grossIncome?: string;
        ivaCondition: string;
    };
    client: {
        name: string;
        cuit: string;
        address: string;
        ivaCondition: string;
    };
    billType: string;
    billLetter: string;
    billNumber: string;
    billDate: string;
    items: Array<{
        description: string;
        quantity: number;
        unitPrice: string | number;
        subtotal: string | number;
    }>;
    total: string | number;
    cae: string;
    caeDueDate: string;
    qrDataUrl?: string;
    footerText?: string;
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
