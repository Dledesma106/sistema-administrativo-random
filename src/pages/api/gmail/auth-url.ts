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
        // Verificar que las variables de entorno estén configuradas
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI;

        if (!clientId || !clientSecret || !redirectUri) {
            return res.status(400).json({
                success: false,
                message: 'Configuración de Google OAuth2 incompleta',
                missing: {
                    clientId: !clientId,
                    clientSecret: !clientSecret,
                    redirectUri: !redirectUri,
                },
                instructions: [
                    'Agrega las siguientes variables a tu archivo .env.local:',
                    'GOOGLE_CLIENT_ID=tu_client_id_de_google_cloud_console',
                    'GOOGLE_CLIENT_SECRET=tu_client_secret_de_google_cloud_console',
                    'GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback',
                ],
            });
        }

        // Generar URL de autorización
        const authUrl = GmailService.generateAuthUrl();

        return res.json({
            success: true,
            data: {
                authUrl,
                instructions: [
                    '1. Copia y pega esta URL en tu navegador:',
                    authUrl,
                    '',
                    '2. Inicia sesión con la cuenta de Gmail administrativa',
                    '3. Autoriza el acceso a Gmail',
                    '4. Google te redirigirá a /api/gmail/callback',
                    '5. Revisa la consola del servidor para obtener el refresh token',
                ],
            },
        });
    } catch (error) {
        console.error('Error generando URL de autorización:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
}
