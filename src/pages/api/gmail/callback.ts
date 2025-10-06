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
        const { code, error } = req.query;

        // Si hay un error en la autorización
        if (error) {
            return res.status(400).json({
                success: false,
                message: `Error en autorización de Google: ${error}`,
            });
        }

        // Verificar que tenemos el código de autorización
        if (!code || typeof code !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Código de autorización no proporcionado',
            });
        }

        // Procesar el código de autorización
        const success = await GmailService.handleAuthCallback(code);

        if (success) {
            // Redirigir a una página de éxito o mostrar mensaje
            return res.json({
                success: true,
                message:
                    'Gmail conectado exitosamente. Revisa la consola del servidor para obtener el refresh token.',
                instructions: [
                    '1. Copia el refresh token mostrado en la consola del servidor',
                    '2. Agrega esta variable a tu archivo .env:',
                    '   GOOGLE_REFRESH_TOKEN=el_refresh_token_de_la_consola',
                    '3. Reinicia el servidor para aplicar los cambios',
                    '',
                    '💡 No necesitas guardar el access token - se renueva automáticamente',
                ],
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Error al procesar la autorización de Gmail',
            });
        }
    } catch (error) {
        console.error('Error en callback de Gmail:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al procesar la autorización',
        });
    }
}
