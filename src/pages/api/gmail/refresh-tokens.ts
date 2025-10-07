import type { NextApiRequest, NextApiResponse } from 'next';

import { GmailService } from 'backend/services/gmailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Solo permitir método POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Método no permitido',
        });
    }

    try {
        const success = await GmailService.refreshTokens();

        if (success) {
            return res.json({
                success: true,
                message:
                    'Tokens refrescados exitosamente. Revisa la consola del servidor para el nuevo access token.',
            });
        } else {
            return res.status(400).json({
                success: false,
                message:
                    'Error al refrescar tokens. Es posible que necesites reconectar la cuenta.',
            });
        }
    } catch (error) {
        console.error('Error al refrescar tokens:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
}
