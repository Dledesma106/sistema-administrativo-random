import { prisma } from 'lib/prisma';

/**
 * Tipo para Manpower (extraído del schema de Prisma)
 */
export type Manpower = {
    technician: string;
    payAmount: number;
};

/**
 * Extrae los nombres de los técnicos desde un array de Manpower
 *
 * @param manpower - Array de Manpower con técnicos y pagas
 * @returns Array de nombres de técnicos
 *
 * @example
 * ```typescript
 * const manpower = [
 *   { technician: 'Juan Pérez', payAmount: 5000 },
 *   { technician: 'María García', payAmount: 6000 }
 * ];
 * const participants = extractParticipantsFromManpower(manpower);
 * // Resultado: ['Juan Pérez', 'María García']
 * ```
 */
export function extractParticipantsFromManpower(
    manpower: Manpower[] | undefined | null,
): string[] {
    if (!manpower || manpower.length === 0) {
        return [];
    }
    return manpower.map((m) => m.technician);
}

/**
 * Convierte los IDs de técnicos a nombres en un array de Manpower
 * Mantiene los nombres que no son IDs válidos (técnicos externos)
 *
 * @param manpower - Array de Manpower que puede contener IDs o nombres
 * @returns Array de Manpower con todos los técnicos convertidos a nombres
 *
 * @example
 * ```typescript
 * const manpower = [
 *   { technician: 'userId1', payAmount: 5000 }, // ID
 *   { technician: 'Técnico Externo', payAmount: 6000 } // Nombre
 * ];
 * const processedManpower = await convertManpowerIdsToNames(manpower);
 * // Resultado: [
 * //   { technician: 'Juan Pérez', payAmount: 5000 },
 * //   { technician: 'Técnico Externo', payAmount: 6000 }
 * // ]
 * ```
 */
export async function convertManpowerIdsToNames(
    manpower: Manpower[] | undefined | null,
): Promise<Manpower[]> {
    if (!manpower || manpower.length === 0) {
        return [];
    }

    // Detectar IDs válidos
    const potentialIds = manpower
        .map((m) => m.technician)
        .filter((tech) => /^[0-9a-fA-F]{24}$/.test(tech));

    // Obtener nombres de usuarios del sistema
    const idToNameMap = new Map<string, string>();
    if (potentialIds.length > 0) {
        const users = await prisma.user.findMany({
            where: {
                id: { in: potentialIds },
                deleted: false,
            },
            select: {
                id: true,
                fullName: true,
            },
        });

        users.forEach((user) => {
            idToNameMap.set(user.id, user.fullName);
        });
    }

    // Convertir IDs a nombres, mantener nombres externos
    return manpower.map((m) => {
        const technician = m.technician;
        if (idToNameMap.has(technician)) {
            return {
                technician: idToNameMap.get(technician)!,
                payAmount: m.payAmount,
            };
        }
        // Si no es un ID válido o no se encontró, mantener el nombre original
        return m;
    });
}

/**
 * Procesa los participantes y asignados y los devuelve en dos arreglos, uno con los IDs de los usuarios asignados y otro con los nombres de los participantes
 *
 * Esta función maneja la lógica de:
 * - Detectar si un participante es un ID de usuario válido o un nombre
 * - Mapear IDs a nombres de usuarios del sistema
 * - Mantener nombres de participantes externos (que no tienen usuario en el sistema)
 * - Filtrar asignados para incluir solo aquellos que están en participantes
 *
 * @param participants - Array de participantes (puede contener IDs o nombres mezclados)
 * @param assignedIDs - Array de IDs de usuarios asignados iniciales
 * @param currentUserId - ID del usuario actual (opcional, se agregará automáticamente si se proporciona)
 * @returns Objeto con los arrays actualizados de asignados y nombres de participantes
 *
 * @example
 * ```typescript
 * const { updatedAssignedIDs, participantNames } = await processParticipantsAndAssigned(
 *   ['userId1', 'userId2', 'Técnico Externo'], // IDs y nombres mezclados
 *   ['userId1'], // IDs iniciales
 *   'currentUserId' // Usuario actual
 * );
 * // Resultado:
 * // updatedAssignedIDs: ['userId1', 'userId2', 'currentUserId']
 * // participantNames: ['Juan Pérez', 'María García', 'Técnico Externo']
 * ```
 */
export async function processParticipantsAndAssigned(
    participants: string[] | undefined,
    assignedIDs: string[],
    currentUserId?: string,
): Promise<{ updatedAssignedIDs: string[]; participantNames: string[] }> {
    let updatedAssignedIDs = [...assignedIDs];
    let participantNames: string[] = [];
    const validUserIds = new Set<string>();
    const idToNameMap = new Map<string, string>();

    // Obtener nombres de todos los asignados
    const assignedUsers = await prisma.user.findMany({
        where: {
            id: { in: updatedAssignedIDs },
            deleted: false,
        },
        select: {
            id: true,
            fullName: true,
        },
    });

    // Mapear IDs a nombres de todos los asignados
    assignedUsers.forEach((user) => {
        idToNameMap.set(user.id, user.fullName);
    });

    if (currentUserId) {
        if (!updatedAssignedIDs.includes(currentUserId)) {
            updatedAssignedIDs.push(currentUserId);
        }
        const currentUser = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { fullName: true },
        });
        if (currentUser) {
            idToNameMap.set(currentUserId, currentUser.fullName);
        }
    }

    if (participants && participants.length > 0) {
        const potentialUserIds = participants.filter((p) => /^[0-9a-fA-F]{24}$/.test(p));

        if (potentialUserIds.length > 0) {
            const existingUsers = await prisma.user.findMany({
                where: {
                    id: { in: potentialUserIds },
                    deleted: false,
                },
                select: {
                    id: true,
                    fullName: true,
                },
            });

            existingUsers.forEach((user) => {
                validUserIds.add(user.id);
                idToNameMap.set(user.id, user.fullName);
                if (!updatedAssignedIDs.includes(user.id)) {
                    updatedAssignedIDs.push(user.id);
                }
            });
        }

        participantNames = participants.map((participant) => {
            if (/^[0-9a-fA-F]{24}$/.test(participant) && idToNameMap.has(participant)) {
                return idToNameMap.get(participant)!;
            }
            return participant;
        });

        // Solo filtrar asignados si no están ni por ID ni por nombre en participantes
        updatedAssignedIDs = updatedAssignedIDs.filter((id) => {
            const userName = idToNameMap.get(id);
            return (
                validUserIds.has(id) ||
                participantNames.includes(userName!) ||
                (currentUserId && id === currentUserId)
            );
        });
    }

    if (currentUserId && idToNameMap.has(currentUserId)) {
        const currentUserName = idToNameMap.get(currentUserId)!;
        if (!participantNames.includes(currentUserName)) {
            participantNames.push(currentUserName);
        }
    }

    return {
        updatedAssignedIDs,
        participantNames,
    };
}
