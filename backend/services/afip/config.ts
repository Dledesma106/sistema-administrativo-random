/**
 * Configuración centralizada de AFIP
 * Obtiene todas las variables de entorno necesarias para facturación electrónica
 */

export interface AfipCompanyConfig {
    /** CUIT del emisor (sin guiones) */
    cuit: string;
    /** CUIT formateado (con guiones) */
    cuitFormatted: string;
    /** Modo producción (true) o homologación (false) */
    production: boolean;
    /** Razón social de la empresa */
    name: string;
    /** Domicilio fiscal */
    address: string;
    /** Ingresos Brutos */
    grossIncome: string;
    /** Condición IVA del emisor */
    ivaCondition: string;
    /** Punto de venta por defecto */
    defaultPointOfSale: number;
}

/**
 * Obtiene la configuración de la empresa emisora desde variables de entorno
 * @throws Error si faltan variables críticas
 */
export function getAfipCompanyConfig(): AfipCompanyConfig {
    const cuit = process.env.AFIP_CUIT;
    if (!cuit) {
        throw new Error(
            'AFIP_CUIT no está configurado. Es requerido para facturación electrónica.',
        );
    }

    // Limpiar CUIT (remover guiones y espacios)
    const cuitClean = cuit.replace(/[-\s]/g, '');

    // Formatear CUIT con guiones (XX-XXXXXXXX-X)
    const cuitFormatted =
        cuitClean.length === 11
            ? `${cuitClean.slice(0, 2)}-${cuitClean.slice(2, 10)}-${cuitClean.slice(10)}`
            : cuit;

    const production = process.env.AFIP_PRODUCTION === 'true';
    const name = process.env.AFIP_NAME || '';
    const address = process.env.AFIP_ADDRESS || '';
    const grossIncome = process.env.AFIP_GROSS_INCOME || '';
    const ivaCondition = process.env.AFIP_IVA_CONDITION || 'ResponsableInscripto';
    const defaultPointOfSale = parseInt(process.env.AFIP_DEFAULT_PTO_VTA || '1', 10);

    // Validar certificados en producción
    if (production) {
        if (!process.env.AFIP_CERT_CONTENT) {
            throw new Error(
                'AFIP_CERT_CONTENT no está configurado. Es requerido en modo producción.',
            );
        }
        if (!process.env.AFIP_KEY_CONTENT) {
            throw new Error(
                'AFIP_KEY_CONTENT no está configurado. Es requerido en modo producción.',
            );
        }
    }

    return {
        cuit: cuitClean,
        cuitFormatted,
        production,
        name,
        address,
        grossIncome,
        ivaCondition,
        defaultPointOfSale,
    };
}

/**
 * Obtiene el CUIT del emisor (número sin formato)
 */
export function getAfipCuit(): number {
    const config = getAfipCompanyConfig();
    return parseInt(config.cuit, 10);
}

/**
 * Verifica si está en modo producción
 */
export function isAfipProduction(): boolean {
    return process.env.AFIP_PRODUCTION === 'true';
}
