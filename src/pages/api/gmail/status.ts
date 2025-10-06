import type { NextApiRequest, NextApiResponse } from 'next';

import { GmailService } from 'backend/services/gmailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Solo permitir método GET
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Método no permitido',
        });
    }

    try {
        const isConfigured = await GmailService.isGmailConfigured();

        return res.json({
            success: true,
            data: { isConfigured },
        });
    } catch (error) {
        console.error('Error al verificar estado de Gmail:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
}
