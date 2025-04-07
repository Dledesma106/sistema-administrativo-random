import { NextApiRequest, NextApiResponse } from 'next';

import {
    PreventiveFrequency,
    PreventiveStatus,
    TaskStatus,
    TaskType,
} from '@prisma/client';

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

// Helper para determinar si es el primer mes del período según la frecuencia
function isFirstMonthOfPeriod(
    currentMonth: number,
    frequency: PreventiveFrequency | null,
): boolean {
    if (!frequency) {
        return false;
    }

    switch (frequency) {
        case PreventiveFrequency.Mensual:
            return true; // Todos los meses son válidos
        case PreventiveFrequency.Bimestral:
            return currentMonth % 2 === 1; // Enero(1), Marzo(3), Mayo(5), Julio(7), Septiembre(9), Noviembre(11)
        case PreventiveFrequency.Trimestral:
            return currentMonth % 3 === 1; // Enero(1), Abril(4), Julio(7), Octubre(10)
        case PreventiveFrequency.Cuatrimestral:
            return currentMonth % 4 === 1; // Enero(1), Mayo(5), Septiembre(9)
        case PreventiveFrequency.Semestral:
            return currentMonth % 6 === 1; // Enero(1), Julio(7)
        default:
            return false;
    }
}

// Helper para obtener el primer mes del período actual
function getFirstMonthOfCurrentPeriod(
    currentMonth: number,
    frequency: PreventiveFrequency,
): number {
    switch (frequency) {
        case PreventiveFrequency.Mensual:
            return currentMonth;
        case PreventiveFrequency.Bimestral:
            return currentMonth - ((currentMonth - 1) % 2);
        case PreventiveFrequency.Trimestral:
            return currentMonth - ((currentMonth - 1) % 3);
        case PreventiveFrequency.Cuatrimestral:
            return currentMonth - ((currentMonth - 1) % 4);
        case PreventiveFrequency.Semestral:
            return currentMonth - ((currentMonth - 1) % 6);
        default:
            return currentMonth;
    }
}

// Helper para obtener el último mes del período actual
function getLastMonthOfCurrentPeriod(
    currentMonth: number,
    frequency: PreventiveFrequency,
): number {
    const firstMonth = getFirstMonthOfCurrentPeriod(currentMonth, frequency);
    switch (frequency) {
        case PreventiveFrequency.Mensual:
            return firstMonth;
        case PreventiveFrequency.Bimestral:
            return firstMonth + 1;
        case PreventiveFrequency.Trimestral:
            return firstMonth + 2;
        case PreventiveFrequency.Cuatrimestral:
            return firstMonth + 3;
        case PreventiveFrequency.Semestral:
            return firstMonth + 5;
        default:
            return currentMonth;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Verificar que la solicitud viene de Vercel Cron

        const authHeader = req.headers.authorization;
        if (authHeader !== `${process.env.CRON_SECRET}`) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const stats = {
            mensual: 0,
            bimestral: 0,
            trimestral: 0,
            cuatrimestral: 0,
            semestral: 0,
            porMeses: 0,
            total: 0,
        };

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
                        deleted: false,
                        createdAt: {
                            gte: new Date(
                                currentYear,
                                getFirstMonthOfCurrentPeriod(
                                    currentMonth,
                                    PreventiveFrequency.Semestral,
                                ) - 1,
                                1,
                            ),
                            lt: new Date(currentYear, currentMonth + 1, 1),
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        console.log(`Total preventivos encontrados: ${preventives.length}`);

        for (const preventive of preventives) {
            console.log('\n-----------------------------------');
            console.log(
                'Procesando preventivo:',
                `${preventive.branch.client.name} - ${preventive.business.name} - ${preventive.branch.number}`,
            );
            console.log('Meses configurados:', preventive.months);
            console.log('Frecuencia (valor):', preventive.frequency);
            console.log('Frecuencia (tipo):', typeof preventive.frequency);
            console.log(
                '¿Es igual a PreventiveFrequency.Mensual?:',
                preventive.frequency === PreventiveFrequency.Mensual,
            );
            console.log('Mes actual:', currentMonth);
            console.log('Tareas existentes en el período:', preventive.tasks.length);

            let shouldCreateTask = false;

            if (preventive.months.length > 0) {
                shouldCreateTask = preventive.months.some(
                    (month) => monthNameToNumber[month] === currentMonth.toString(),
                );
                console.log('Evaluando por meses específicos:', shouldCreateTask);
            } else if (preventive.frequency) {
                console.log('Evaluando preventivo por frecuencia:', preventive.frequency);
                const isFirstMonth = isFirstMonthOfPeriod(
                    currentMonth,
                    preventive.frequency as PreventiveFrequency, // Asegurarnos que se trate como enum
                );
                console.log('¿Es primer mes del período?:', isFirstMonth);

                if (isFirstMonth) {
                    shouldCreateTask = true;
                } else {
                    const firstMonthOfPeriod = getFirstMonthOfCurrentPeriod(
                        currentMonth,
                        preventive.frequency,
                    );
                    console.log('Primer mes del período:', firstMonthOfPeriod);

                    const hasTaskInCurrentPeriod = preventive.tasks.some((task) => {
                        const taskMonth = task.createdAt.getMonth() + 1;
                        return (
                            taskMonth >= firstMonthOfPeriod && taskMonth <= currentMonth
                        );
                    });
                    console.log(
                        '¿Ya tiene tarea en el período?:',
                        hasTaskInCurrentPeriod,
                    );

                    shouldCreateTask = !hasTaskInCurrentPeriod;
                }
            }

            console.log('¿Debe crear tarea?:', shouldCreateTask);

            if (shouldCreateTask) {
                // Verificar si existe una tarea específicamente para este mes
                const existingTaskThisMonth = preventive.tasks.find((task) => {
                    const taskMonth = task.createdAt.getMonth() + 1;
                    return taskMonth === currentMonth;
                });

                if (!existingTaskThisMonth) {
                    await prisma.preventive.update({
                        where: { id: preventive.id },
                        data: { status: PreventiveStatus.Pendiente },
                    });

                    // Obtener nombres completos de los técnicos asignados para inicializar participantes
                    let participantNames: string[] = [];
                    if (preventive.assigned && preventive.assigned.length > 0) {
                        const assignedUsers = await prisma.user.findMany({
                            where: {
                                id: {
                                    in: preventive.assigned.map(
                                        (assigned) => assigned.id,
                                    ),
                                },
                                deleted: false,
                            },
                            select: {
                                fullName: true,
                            },
                        });

                        participantNames = assignedUsers.map((user) => user.fullName);
                    }

                    const maxTaskNumber = await prisma.task.findFirst({
                        orderBy: { taskNumber: 'desc' },
                        select: { taskNumber: true },
                    });

                    await prisma.task.create({
                        data: {
                            taskNumber: (maxTaskNumber?.taskNumber ?? 0) + 1,
                            participants: participantNames,
                            taskType: TaskType.Preventivo,
                            status: TaskStatus.Pendiente,
                            description: preventive.frequency
                                ? `Tarea preventiva generada automáticamente - Vence el 28/${getLastMonthOfCurrentPeriod(
                                      currentMonth,
                                      preventive.frequency,
                                  )}/${currentYear}`
                                : `Tarea preventiva generada automáticamente - Vence el 28/${currentMonth}/${currentYear}`,
                            businessId: preventive.businessId,
                            branchId: preventive.branchId,
                            assignedIDs: preventive.assignedIDs,
                            preventiveId: preventive.id,
                        },
                    });

                    // Incrementar contadores
                    stats.total++;
                    if (preventive.months.length > 0) {
                        stats.porMeses++;
                    } else if (preventive.frequency) {
                        switch (preventive.frequency) {
                            case 'Mensual':
                                stats.mensual++;
                                break;
                            case 'Bimestral':
                                stats.bimestral++;
                                break;
                            case 'Trimestral':
                                stats.trimestral++;
                                break;
                            case 'Cuatrimestral':
                                stats.cuatrimestral++;
                                break;
                            case 'Semestral':
                                stats.semestral++;
                                break;
                        }
                    }
                } else if (existingTaskThisMonth.status === TaskStatus.Aprobada) {
                    await prisma.preventive.update({
                        where: { id: preventive.id },
                        data: { status: PreventiveStatus.AlDia },
                    });
                }
            }
        }

        console.log('\n=== Resumen de tareas creadas ===');
        console.log('Por frecuencia Mensual:', stats.mensual);
        console.log('Por frecuencia Bimestral:', stats.bimestral);
        console.log('Por frecuencia Trimestral:', stats.trimestral);
        console.log('Por frecuencia Cuatrimestral:', stats.cuatrimestral);
        console.log('Por frecuencia Semestral:', stats.semestral);
        console.log('Por meses específicos:', stats.porMeses);
        console.log('Total:', stats.total);
        console.log('===============================');

        return res.status(200).json({
            success: true,
            message: `Procesados ${preventives.length} preventivos. Creadas ${stats.total} tareas.`,
            stats,
        });
    } catch (error) {
        console.error('Error en cron job:', error);
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
