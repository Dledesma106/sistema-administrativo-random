import { google } from 'googleapis';

// Configuración de OAuth2 para cuenta centralizada
const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
];

// Cliente OAuth2 centralizado
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
);

// Cliente de Gmail centralizado
let gmailService: any = null;

export class GmailService {
    /**
     * Inicializa el cliente de Gmail con refresh token
     * El access token se obtiene automáticamente cuando es necesario
     */
    static async initializeGmailService() {
        if (gmailService) {
            return gmailService;
        }

        try {
            // Solo necesitamos el refresh token
            const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

            if (!refreshToken) {
                throw new Error(
                    'Refresh token de Gmail no configurado en variables de entorno',
                );
            }

            // Configurar solo el refresh token
            // El access token se obtendrá automáticamente cuando sea necesario
            oauth2Client.setCredentials({
                refresh_token: refreshToken,
            });

            gmailService = google.gmail({
                version: 'v1',
                auth: oauth2Client,
            });

            return gmailService;
        } catch (error) {
            console.error('Error inicializando Gmail Service:', error);
            throw new Error('No se pudo inicializar el servicio de Gmail');
        }
    }

    /**
     * Verifica si el servicio de Gmail está configurado
     */
    static async isGmailConfigured(): Promise<boolean> {
        try {
            await this.initializeGmailService();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Genera URL de autorización para conectar la cuenta de administración
     */
    static generateAuthUrl(): string {
        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            prompt: 'consent', // Siempre pedir consentimiento para obtener refresh_token
        });
    }

    /**
     * Maneja el callback de autorización
     * Solo necesitamos guardar el refresh token
     */
    static async handleAuthCallback(code: string): Promise<boolean> {
        try {
            const { tokens } = await oauth2Client.getToken(code);

            if (!tokens.refresh_token) {
                throw new Error('Refresh token no recibido de Google');
            }

            console.log('✅ Autorización exitosa!');
            console.log('📝 Refresh Token:', tokens.refresh_token);
            console.log('⏰ Expiry Date:', tokens.expiry_date);
            console.log('');
            console.log('🔧 Configuración necesaria:');
            console.log('Agrega esta variable a tu archivo .env:');
            console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
            console.log('');
            console.log(
                '💡 No necesitas guardar el access token - se renueva automáticamente',
            );

            return true;
        } catch (error) {
            console.error('Error en handleAuthCallback:', error);
            return false;
        }
    }

    /**
     * Refresca los tokens de acceso manualmente
     * Útil para verificar que el refresh token funciona
     */
    static async refreshTokens(): Promise<boolean> {
        try {
            const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
            if (!refreshToken) {
                throw new Error('No hay refresh token disponible');
            }

            oauth2Client.setCredentials({
                refresh_token: refreshToken,
            });

            const { credentials } = await oauth2Client.refreshAccessToken();

            console.log('✅ Tokens refrescados exitosamente');
            console.log('🆕 Nuevo Access Token obtenido (válido por 1 hora)');
            console.log('⏰ Expiry Date:', credentials.expiry_date);

            return true;
        } catch (error) {
            console.error('Error refreshing tokens:', error);
            return false;
        }
    }

    /**
     * Obtiene un thread de Gmail específico
     */
    static async getThread(threadId: string) {
        const gmail = await this.initializeGmailService();

        const response = await gmail.users.threads.get({
            userId: 'me', // Usará la cuenta de administración configurada
            id: threadId,
        });

        return response.data;
    }

    /**
     * Busca threads de Gmail
     */
    static async searchThreads(query: string, maxResults: number = 20) {
        const gmail = await this.initializeGmailService();

        const response = await gmail.users.threads.list({
            userId: 'me', // Usará la cuenta de administración configurada
            q: query,
            maxResults,
        });

        if (!response.data.threads) {
            return [];
        }

        // Obtener detalles de cada thread
        const threadsWithDetails = await Promise.all(
            response.data.threads.map(async (thread: any) => {
                const threadDetails = await gmail.users.threads.get({
                    userId: 'me',
                    id: thread.id!,
                });
                return threadDetails.data;
            }),
        );

        return threadsWithDetails;
    }

    /**
     * Busca threads relacionados con presupuestos
     */
    static async searchBudgetThreads(query?: string) {
        const defaultQuery =
            'subject:(presupuesto OR cotización OR presupuestar) OR subject:(budget OR quote)';
        const searchQuery = query || defaultQuery;

        return await this.searchThreads(searchQuery, 50);
    }

    /**
     * Busca threads por cliente específico
     */
    static async searchThreadsByClient(clientEmail: string) {
        const query = `from:${clientEmail} OR to:${clientEmail}`;
        return await this.searchThreads(query, 30);
    }

    /**
     * Obtiene threads recientes (últimos 7 días)
     */
    static async getRecentThreads() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dateQuery = sevenDaysAgo.toISOString().split('T')[0]; // Formato YYYY-MM-DD

        const query = `after:${dateQuery}`;
        return await this.searchThreads(query, 100);
    }

    /**
     * Verifica si un thread existe
     */
    static async threadExists(threadId: string): Promise<boolean> {
        try {
            await this.getThread(threadId);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtiene información básica de un thread (sin cargar todos los mensajes)
     */
    static async getThreadInfo(threadId: string) {
        const gmail = await this.initializeGmailService();

        const response = await gmail.users.threads.get({
            userId: 'me',
            id: threadId,
            format: 'metadata', // Solo metadatos, no contenido completo
            metadataHeaders: ['Subject', 'From', 'To', 'Date'],
        });

        return response.data;
    }
}
