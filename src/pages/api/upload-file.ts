import type { NextApiRequest, NextApiResponse } from 'next';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Inicializar el cliente S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Solo permitir solicitudes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        // Verificar y parsear los datos de la solicitud
        const { file, contentType, key, expenseId } = req.body;

        if (!file || !contentType || !key) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos' });
        }

        // Log para diagnóstico
        console.log(`Subiendo archivo para el gasto ID: ${expenseId || 'no disponible'}`);
        console.log(`Key de archivo: ${key}`);

        // Verificar que la key contenga el ID del gasto (si se proporciona)
        if (expenseId && !key.includes(expenseId)) {
            console.warn(
                `Advertencia: La key del archivo (${key}) no contiene el ID del gasto (${expenseId})`,
            );
        }

        // Decodificar el archivo base64
        const fileBuffer = Buffer.from(file.split(',')[1], 'base64');

        // Construir el comando para subir a S3
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME as string,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
        });

        // Enviar el archivo a S3
        await s3Client.send(command);

        // Log de éxito
        console.log(`Archivo subido correctamente a S3 con key: ${key}`);

        // Devolver respuesta exitosa
        return res.status(200).json({
            success: true,
            key,
            message: 'Archivo subido correctamente',
            expenseId: expenseId || null,
        });
    } catch (error) {
        console.error('Error al subir archivo a S3:', error);
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
}
