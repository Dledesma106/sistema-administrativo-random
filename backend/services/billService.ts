import { prisma } from 'lib/prisma';
import { AfipService } from './afipService';
import { renderTemplate, InvoiceTemplateData } from './templateService';
import { generatePdfFromHtml } from './pdfService';
import { s3Client } from '../s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getFileSignedUrl } from '../s3Client';

/**
 * Emite una factura electrónica: llama a AFIP, genera el PDF, sube a S3 y asocia el File a la Bill existente.
 * @param billId - ID de la factura ya creada en la base de datos
 * @returns Bill actualizada con el PDF asociado
 */
export async function emitirFacturaElectronica(billId: string) {
  // 1. Buscar la factura y sus relaciones necesarias
  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    include: {
      billingProfile: { include: { business: true } },
      // Agrega aquí otras relaciones necesarias (por ejemplo, cliente)
    },
  });
  if (!bill) throw new Error('Factura no encontrada');

  // 2. Emitir en AFIP
  const caeData = await AfipService.createBillAFIP({
    ...bill,
    ...{
      legalName: bill.legalName,
      CUIT: bill.CUIT,
      billingAddress: bill.billingAddress,
      IVACondition: bill.IVACondition,
    },
  });

  // 3. Actualizar la Bill con los datos de CAE
  await prisma.bill.update({
    where: { id: billId },
    data: { caeData },
  });

  // 4. Generar QR de AFIP (URL oficial)
  const totalAmmount = bill.details.reduce((acc: number, d: any) => acc + d.unitPrice * d.quantity, 0);
  
  // Mapear tipo de comprobante a valores numéricos de AFIP
  const tipoCmpMap: Record<string, number> = {
    'A': 1,  // Factura A
    'B': 6,  // Factura B  
    'C': 11, // Factura C
  };
  
  const qrData = {
    ver: 1,
    fecha: bill.createdAt.toISOString().split('T')[0], // YYYY-MM-DD de la factura
    cuit: parseInt(process.env.AFIP_CUIT?.replace(/-/g, '') || '0'),
    ptoVta: 2, // Punto de venta (ajustar según tu configuración)
    tipoCmp: tipoCmpMap[bill.comprobanteType] || 1,
    nroCmp: caeData.comprobanteNumber,
    importe: totalAmmount,
    monId: 'PES', // Moneda
    ctz: 1, // Cotización
    tipoDocRec: 80, // Tipo de documento del receptor (CUIT)
    nroDocRec: parseInt(bill.CUIT.replace(/-/g, '')), // CUIT del cliente
    tipoCodAut: 'E', // Tipo de código de autorización
    codAut: caeData.code, // CAE
  };
  const { url: qrUrl } = await AfipService.generateBillQR(qrData);

  // 5. Armar los datos para la plantilla
  const invoiceData: InvoiceTemplateData = {
    company: {
      name: process.env.AFIP_NAME || '',
      cuit: process.env.AFIP_CUIT || '',
      address: process.env.AFIP_ADDRESS || '',
      grossIncome: process.env.AFIP_GROSS_INCOME || '',
      ivaCondition: process.env.AFIP_IVA_CONDITION || '',
    },
    client: {
      name: bill.legalName || '',
      cuit: bill.CUIT || '',
      address: bill.billingAddress || '',
      ivaCondition: bill.IVACondition || '',
    },
    billType: bill.comprobanteType,
    billLetter: bill.comprobanteType?.slice(-1) || '',
    billNumber: caeData?.comprobanteNumber || '',
    billDate: new Date().toLocaleDateString('es-AR'),
    items: bill.details.map((d: any) => ({
      description: d.description,
      quantity: d.quantity,
      unitPrice: d.unitPrice,
      subtotal: d.unitPrice * d.quantity,
    })),
    total: bill.details.reduce((acc: number, d: any) => acc + d.unitPrice * d.quantity, 0),
    cae: caeData?.code || '',
    caeDueDate: caeData?.expirationDate ? new Date(caeData.expirationDate).toLocaleDateString('es-AR') : '',
    qrDataUrl: qrUrl,
    footerText: '',
  };

  // 6. Renderizar HTML y generar PDF
  const html = renderTemplate<InvoiceTemplateData>('invoice', invoiceData);
  const pdfBuffer = await generatePdfFromHtml(html);

  // 7. Subir PDF a S3
  const pdfKey = `bills/${bill.id}.pdf`;
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: pdfKey,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
    })
  );

  // 8. Obtener URL firmada y expiración
  const { url, urlExpire } = await getFileSignedUrl(pdfKey, 'application/pdf');

  // 9. Crear el objeto File
  const file = await prisma.file.create({
    data: {
      key: pdfKey,
      filename: `${bill.id}.pdf`,
      mimeType: 'application/pdf',
      size: pdfBuffer.length,
      url,
      urlExpire: new Date(urlExpire),
    },
  });

  // 10. Asociar el PDF a la Bill
  const billActualizada = await prisma.bill.update({
    where: { id: bill.id },
    data: { pdfId: file.id },
    include: { pdf: true },
  });

  return billActualizada;
} 