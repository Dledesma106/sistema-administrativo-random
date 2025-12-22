import { NextApiRequest, NextApiResponse } from 'next';

import {
    processPreventiveTasks,
    PrismaOperations,
} from '../../../../backend/services/generatePreventiveTasksService';
import { generateTaskNumber } from '../../../../backend/services/taskService';
import { prisma } from '../../../../lib/prisma';

export const config = {
    runtime: 'nodejs',
};

/**
 * Implementación de las operaciones de Prisma para producción
 */
function createPrismaOperations(): PrismaOperations {
    return {
        findPreventives: async (currentYear: number) => {
            const preventives = await prisma.preventive.findMany({
                where: { deleted: false },
                include: {
                    business: true,
                    branch: {
                        include: {
                            client: true,
                        },
                    },
                    assigned: true,
                    tasks: {
                        where: {
                            deleted: false,
                            createdAt: {
                                gte: new Date(currentYear, 0, 1),
                                lt: new Date(currentYear + 1, 0, 1),
                            },
                        },
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });

            return preventives.map((p) => ({
                id: p.id,
                months: p.months,
                frequency: p.frequency,
                businessId: p.businessId,
                branchId: p.branchId,
                assignedIDs: p.assignedIDs,
                business: { name: p.business.name },
                branch: {
                    number: p.branch.number,
                    client: { name: p.branch.client.name },
                },
                assigned: p.assigned.map((a) => ({ id: a.id })),
                tasks: p.tasks.map((t) => ({
                    createdAt: t.createdAt,
                    status: t.status,
                })),
            }));
        },

        updatePreventiveStatus: async (id, status) => {
            await prisma.preventive.update({
                where: { id },
                data: { status },
            });
        },

        findAssignedUsers: async (userIds) => {
            return prisma.user.findMany({
                where: {
                    id: { in: userIds },
                    deleted: false,
                },
                select: { fullName: true },
            });
        },

        createTask: async (data) => {
            return prisma.task.create({ data });
        },
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Verificar que la solicitud viene de Vercel Cron
        const authHeader = req.headers.authorization;
        if (authHeader !== `${process.env.CRON_SECRET}`) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        console.log('Cron iniciado:', new Date());

        const result = await processPreventiveTasks({
            prismaOps: createPrismaOperations(),
            generateTaskNumber: () => generateTaskNumber(null),
            getCurrentDate: () => new Date(),
        });

        console.log('\n=== Resumen de tareas creadas ===');
        console.log('Por frecuencia Mensual:', result.stats.mensual);
        console.log('Por frecuencia Bimestral:', result.stats.bimestral);
        console.log('Por frecuencia Trimestral:', result.stats.trimestral);
        console.log('Por frecuencia Cuatrimestral:', result.stats.cuatrimestral);
        console.log('Por frecuencia Semestral:', result.stats.semestral);
        console.log('Por frecuencia Anual:', result.stats.anual);
        console.log('Por meses específicos:', result.stats.porMeses);
        console.log('Total:', result.stats.total);
        console.log('===============================');

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error en cron job:', error);
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
