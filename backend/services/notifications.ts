import { Expo, ExpoPushMessage } from 'expo-server-sdk';

import { prisma } from '../../lib/prisma'; // Ajusta la ruta si es necesario

// Crea una nueva instancia de Expo SDK
// ¡Asegúrate de no crear una nueva instancia para cada envío de notificación!
// Es mejor crearla una vez y reutilizarla.
const expo = new Expo();

export interface PushNotificationData {
    title: string;
    body: string;
    data?: Record<string, unknown>; // Datos adicionales para enviar con la notificación
}

/**
 * Envía notificaciones push a los usuarios especificados.
 * @param userIds Array de IDs de los usuarios a notificar.
 * @param notification Objeto con el título, cuerpo y datos de la notificación.
 */
export const sendPushNotification = async (
    userIds: string[],
    notification: PushNotificationData,
) => {
    if (!userIds || userIds.length === 0) {
        console.log('No user IDs provided for push notification.');
        return;
    }

    try {
        // 1. Obtener todos los tokens de los usuarios especificados
        const userTokens = await prisma.expoToken.findMany({
            where: {
                userId: { in: userIds },
            },
            select: {
                token: true,
            },
        });

        if (userTokens.length === 0) {
            console.log('No push tokens found for the specified users.');
            return;
        }

        // 2. Crear los mensajes para Expo
        const messages: ExpoPushMessage[] = [];
        for (const { token } of userTokens) {
            // Verifica si el token es válido antes de agregarlo
            if (!Expo.isExpoPushToken(token)) {
                console.warn(`Token ${token} is not a valid Expo push token`);
                continue;
            }

            messages.push({
                to: token,
                sound: 'default',
                title: notification.title,
                body: notification.body,
                data: notification.data || {},
                // Puedes agregar más opciones aquí, como badge, ttl, priority, etc.
            });
        }

        if (messages.length === 0) {
            console.log('No valid push tokens to send notifications to.');
            return;
        }

        // 3. Enviar notificaciones en chunks (Expo tiene un límite por request)
        // El SDK maneja automáticamente la creación de chunks.
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];

        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
                // Puedes guardar los tickets para verificar el estado del envío más tarde si es necesario
            } catch (error) {
                console.error('Error sending push notification chunk:', error);
                // Aquí podrías manejar errores específicos, como la invalidación de tokens
            }
        }

        console.log(
            'Push notifications sent, tickets:',
            tickets.filter((ticket) => ticket.status === 'ok').length,
            'successful,',
            tickets.filter((ticket) => ticket.status === 'error').length,
            'failed.',
        );

        // Opcional: Manejar recibos para verificar si las notificaciones fueron recibidas
        // Esto es más avanzado y requiere guardar los IDs de los tickets
        // y luego consultarlos usando expo.getPushNotificationReceiptsAsync(receiptIds);
    } catch (error) {
        console.error('Error in sendPushNotification service:', error);
        // Considera un sistema de reintentos o alertas aquí si es crítico
    }
};
