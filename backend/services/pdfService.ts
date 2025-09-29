import puppeteer from 'puppeteer';

/**
 * Genera un PDF a partir de HTML usando Puppeteer
 * @param html - HTML a renderizar
 * @returns Buffer con el PDF generado
 */
export async function generatePdfFromHtml(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                bottom: '20mm',
                left: '15mm',
                right: '15mm',
            },
        });
        await page.close();
        // Asegurarse de que el resultado sea un Buffer
        return Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    } finally {
        await browser.close();
    }
}
