import puppeteer from 'puppeteer';

/**
 * Genera un PDF a partir de HTML usando Puppeteer
 * Optimizado para entornos serverless como Vercel
 * @param html - HTML a renderizar
 * @returns Buffer con el PDF generado
 */
export async function generatePdfFromHtml(html: string): Promise<Buffer> {
    // Configuración optimizada para Vercel/serverless
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // Evita problemas de memoria en serverless
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--single-process', // Útil para entornos con recursos limitados
        ],
    });

    try {
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
            timeout: 30000, // 30 segundos de timeout
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
            preferCSSPageSize: false, // Usar formato A4 estándar
        });

        await page.close();

        // Asegurarse de que el resultado sea un Buffer
        return Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    } catch (error) {
        console.error('Error generando PDF:', error);
        throw new Error(
            `Error al generar PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
    } finally {
        await browser.close();
    }
}
