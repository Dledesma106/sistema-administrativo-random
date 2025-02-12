import { NextApiRequest, NextApiResponse } from 'next';

import { PreventiveStatus, TaskStatus, TaskType } from '@prisma/client';

import { prisma } from '../../../../lib/prisma';

export const config = {
    runtime: 'nodejs',
};

// Helper para convertir nombres de meses a números
const monthNameToNumber: { [key: string]: string } = {
    Enero: '1',
    Febrero: '2',
    Marzo: '3',
    Abril: '4',
    Mayo: '5',
    Junio: '6',
    Julio: '7',
    Agosto: '8',
    Septiembre: '9',
    Octubre: '10',
    Noviembre: '11',
    Diciembre: '12',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Verificar que la solicitud viene de Vercel Cron

        const authHeader = req.headers.authorization;
        if (authHeader !== `${process.env.CRON_SECRET}`) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        console.log('Cron iniciado:', new Date());
        console.log('Mes actual:', currentMonth.toString());

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
            // Agregamos logs para debug
            console.log(
                'Preventivo:',
                `${preventive.branch.client.name} - ${preventive.business.name} - ${preventive.branch.number}`,
            );
            console.log('Meses configurados:', preventive.months);
            console.log('Frecuencia:', preventive.frequency);
            console.log('Mes actual:', currentMonth);

            const shouldCreateTask =
                (preventive.months.length > 0 &&
                    preventive.months.some(
                        (month) => monthNameToNumber[month] === currentMonth.toString(),
                    )) ||
                (preventive.frequency > 0 && currentMonth % preventive.frequency === 0);

            console.log('¿Debe crear tarea?:', shouldCreateTask);

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

        return res.status(200).json({
            success: true,
            message: `Procesados ${preventives.length} preventivos`,
        });
    } catch (error) {
        console.error('Error en cron job:', error);
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
