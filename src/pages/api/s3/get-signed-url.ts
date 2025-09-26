import { NextApiRequest, NextApiResponse } from 'next';

import { createImageSignedUrlAsync } from '../../../../backend/s3Client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Configurar headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { key } = req.body;

        if (!key) {
            return res.status(400).json({ error: 'Key is required' });
        }

        // Obtener URL firmada
        const { url } = await createImageSignedUrlAsync(key);

        // Descargar la imagen en el backend
        const imageResponse = await fetch(url);
        if (!imageResponse.ok) {
            throw new Error(`Error downloading image: ${imageResponse.statusText}`);
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(imageBuffer).toString('base64');

        res.status(200).json({ imageData: base64 });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
