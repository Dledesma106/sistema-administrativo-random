import { PreventiveStatus, TaskStatus, TaskType } from '@prisma/client';

import { prisma } from '../../../../lib/prisma';

export const config = {
    runtime: 'edge',
};

export default async function handler(request: Request) {
    try {
        // Verificar que la solicitud viene de Vercel Cron
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const preventives = await prisma.preventive.findMany({
            where: { deleted: false },
            include: {
                business: true,
                branch: true,
                assigned: true,
                tasks: {
                    where: {
                        createdAt: {
                            gte: new Date(currentYear, currentMonth - 1, 1),
                            lt: new Date(currentYear, currentMonth, 1),
                        },
                        deleted: false,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });

        for (const preventive of preventives) {
            const shouldCreateTask =
                (preventive.months.length > 0 &&
                    preventive.months.includes(currentMonth.toString())) ||
                (preventive.frequency > 0 && currentMonth % preventive.frequency === 0);

            if (shouldCreateTask) {
                const existingTask = preventive.tasks[0];

                if (!existingTask) {
                    await prisma.preventive.update({
                        where: { id: preventive.id },
                        data: { status: PreventiveStatus.Pendiente },
                    });

                    const maxTaskNumber = await prisma.task.findFirst({
                        orderBy: { taskNumber: 'desc' },
                        select: { taskNumber: true },
                    });

                    await prisma.task.create({
                        data: {
                            taskNumber: (maxTaskNumber?.taskNumber ?? 0) + 1,
                            taskType: TaskType.Preventivo,
                            status: TaskStatus.Pendiente,
                            description: `Tarea preventiva generada automáticamente - ${currentMonth}/${currentYear}`,
                            businessId: preventive.businessId,
                            branchId: preventive.branchId,
                            assignedIDs: preventive.assignedIDs,
                            preventiveId: preventive.id,
                        },
                    });
                } else if (existingTask.status === TaskStatus.Aprobada) {
                    await prisma.preventive.update({
                        where: { id: preventive.id },
                        data: { status: PreventiveStatus.AlDia },
                    });
                } else {
                    await prisma.preventive.update({
                        where: { id: preventive.id },
                        data: { status: PreventiveStatus.Pendiente },
                    });
                }
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: `Procesados ${preventives.length} preventivos`,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    } catch (error) {
        console.error('Error en cron job:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }
}
