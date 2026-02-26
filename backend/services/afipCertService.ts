import fs from 'fs';
import os from 'os';
import path from 'path';

// En Vercel, os.tmpdir() devuelve /tmp (directorio temporal de Linux)
const TMP_DIR = os.tmpdir();
const CERT_PATH = path.join(TMP_DIR, 'afip-cert.crt');
const KEY_PATH = path.join(TMP_DIR, 'afip-key.key');

// Normalizar contenido de PEM en caso de que las variables de entorno
// contengan secuencias escapadas (por ejemplo: "-----BEGIN...\nMIID...\n-----END...\n")
export const normalizePem = (raw?: string) => {
    if (!raw) {
        return '';
    }
    let s = raw.trim();
    // Quitar comillas envolventes si las hubiera
    if (
        (s.startsWith("'") && s.endsWith("'")) ||
        (s.startsWith('"') && s.endsWith('"'))
    ) {
        s = s.slice(1, -1);
    }
    // Reemplazar secuencias literales de nueva línea "\\n" por saltos reales
    s = s.replace(/\\r\\n/g, '\r\n').replace(/\\n/g, '\n');
    return s;
};

/**
 * Escribe los certificados y claves de AFIP en archivos temporales del sistema.
 *
 * IMPORTANTE: La librería @afipsdk/afip.js requiere rutas de archivos físicos,
 * no puede trabajar directamente con strings. Por eso necesitamos escribir
 * los contenidos de las variables de entorno a archivos temporales.
 *
 * La librería internamente usa fs.readFileSync() para leer estos archivos
 * cuando necesita firmar las peticiones SOAP a los servicios web de AFIP.
 *
 * NOTA SOBRE VERCEL:
 * - Vercel permite escribir en /tmp (que es lo que os.tmpdir() devuelve)
 * - Sin embargo, /tmp es efímero y se limpia entre invocaciones
 * - Por eso escribimos los archivos cada vez que se necesitan (no solo al inicio)
 * - Esto asegura que funcionen incluso si la función serverless se reinicia
 *
 * @param forceRewrite - Si es true, reescribe los archivos incluso si ya existen
 * @returns Rutas de los archivos creados
 */
export function writeAfipCertAndKey(forceRewrite = false) {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.AFIP_CERT_CONTENT) {
        throw new Error(
            'AFIP_CERT_CONTENT no está configurado. Es requerido para facturación electrónica.',
        );
    }
    if (!process.env.AFIP_KEY_CONTENT) {
        throw new Error(
            'AFIP_KEY_CONTENT no está configurado. Es requerido para facturación electrónica.',
        );
    }

    const certContent = normalizePem(process.env.AFIP_CERT_CONTENT);
    const keyContent = normalizePem(process.env.AFIP_KEY_CONTENT);

    // Escribir certificado (siempre en Vercel/serverless para asegurar que exista)
    const certExists = fs.existsSync(CERT_PATH);
    if (!certExists || forceRewrite) {
        fs.writeFileSync(CERT_PATH, certContent, { encoding: 'utf8' });
        // Establecer permisos restrictivos (solo lectura para el propietario)
        // En Vercel (Linux) esto funciona correctamente
        try {
            fs.chmodSync(CERT_PATH, 0o600);
        } catch (err) {
            // Windows no soporta chmod de la misma forma; ignorar si falla
        }
    }

    // Escribir clave privada (siempre en Vercel/serverless para asegurar que exista)
    const keyExists = fs.existsSync(KEY_PATH);
    if (!keyExists || forceRewrite) {
        fs.writeFileSync(KEY_PATH, keyContent, { encoding: 'utf8' });
        try {
            fs.chmodSync(KEY_PATH, 0o600);
        } catch (err) {
            // Ignorar errores de chmod en Windows
        }
    }

    return {
        certPath: CERT_PATH,
        keyPath: KEY_PATH,
    };
}

/**
 * Limpia los archivos temporales de certificados y claves.
 * Útil para limpieza después de pruebas o al cerrar la aplicación.
 */
export function cleanupAfipCertAndKey() {
    try {
        if (fs.existsSync(CERT_PATH)) {
            fs.unlinkSync(CERT_PATH);
        }
    } catch (error) {
        console.warn('Error eliminando certificado temporal:', error);
    }

    try {
        if (fs.existsSync(KEY_PATH)) {
            fs.unlinkSync(KEY_PATH);
        }
    } catch (error) {
        console.warn('Error eliminando clave temporal:', error);
    }
}

/**
 * Verifica si los archivos de certificado y clave existen
 */
export function afipCertFilesExist(): boolean {
    return fs.existsSync(CERT_PATH) && fs.existsSync(KEY_PATH);
}
