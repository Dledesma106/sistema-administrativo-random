import puppeteer, { Browser } from 'puppeteer';

/**
 * Genera un PDF a partir de HTML usando Puppeteer
 * Optimizado para entornos serverless como Vercel
 * @param html - HTML a renderizar
 * @returns Buffer con el PDF generado
 */
export async function generatePdfFromHtml(html: string): Promise<Buffer> {
    // Ajustar argumentos según plataforma: algunos flags (ej. --single-process)
    // pueden provocar cierres inesperados en Windows. Usamos un set de args
    // optimizado para Linux/serverless y uno más conservador para Windows.
    const isWindows = process.platform === 'win32';
    const launchArgs = isWindows
        ? ['--disable-dev-shm-usage']
        : [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage', // Evita problemas de memoria en serverless
              '--disable-accelerated-2d-canvas',
              '--disable-gpu',
              '--single-process', // Útil para entornos con recursos limitados
          ];

    // Intenta lanzar el navegador y generar PDF. Si falla por cierre del target,
    // reintenta una vez con opciones más conservadoras.
    let browser = null as unknown as Browser | null;
    const tryGenerate = async (args: string[]) => {
        browser = await puppeteer.launch({
            headless: true,
            args,
            timeout: 60000,
        });
        const page = await browser.newPage();

        // Configurar viewport para mejor renderizado
        await page.setViewport({
            width: 1200,
            height: 1600,
            deviceScaleFactor: 1,
        });

        // Establecer contenido HTML
        await page.setContent(html, {
            waitUntil: 'networkidle0',
            timeout: 45000,
        });

        // Generar PDF con configuración optimizada
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                bottom: '10mm',
                left: '10mm',
                right: '10mm',
            },
            preferCSSPageSize: false,
        });

        await page.close();
        return Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    };

    try {
        try {
            return await tryGenerate(launchArgs);
        } catch (err) {
            // Si ocurrió un TargetCloseError u otro fallo, intentar un lanzamiento
            // sin flags adicionales (más conservador). Esto ayuda en Windows.
            console.warn(
                'PDF generation failed with initial args, retrying with conservative args:',
                err instanceof Error ? err.message : err,
            );
            // Cerrar browser si está abierto antes de reintentar
            try {
                if (browser && browser.isConnected && browser.isConnected()) {
                    await browser.close();
                }
            } catch (closeErr) {
                console.warn(
                    'Error closing browser before retry:',
                    closeErr instanceof Error ? closeErr.message : closeErr,
                );
            }

            const fallbackArgs: string[] = [];
            return await tryGenerate(fallbackArgs);
        }
    } catch (error) {
        console.error('Error generando PDF:', error);
        throw new Error(
            `Error al generar PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
    } finally {
        if (browser) {
            try {
                if (browser.isConnected && browser.isConnected()) {
                    await browser.close();
                }
            } catch (closeErr) {
                console.warn(
                    'Error closing browser in finally:',
                    closeErr instanceof Error ? closeErr.message : closeErr,
                );
            }
        }
    }
}
