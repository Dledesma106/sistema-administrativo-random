import {
    PreventiveFrequency,
    PreventiveStatus,
    TaskStatus,
    TaskType,
} from '@prisma/client';

import {
    getLastMonthOfCurrentPeriod,
    shouldCreatePreventiveTask,
} from './preventiveTaskService';

/**
 * Tipos para las dependencias que se pueden mockear en tests
 */
export interface PreventiveWithRelations {
    id: string;
    months: string[];
    frequency: PreventiveFrequency | null;
    businessId: string;
    branchId: string;
    assignedIDs: string[];
    business: { name: string };
    branch: {
        number: number | null;
        client: { name: string };
    };
    assigned: { id: string }[];
    tasks: {
        createdAt: Date;
        status: TaskStatus;
    }[];
}

export interface ProcessPreventiveTasksResult {
    success: boolean;
    message: string;
    stats: {
        mensual: number;
        bimestral: number;
        trimestral: number;
        cuatrimestral: number;
        semestral: number;
        anual: number;
        porMeses: number;
        total: number;
    };
    preventivesProcessed: number;
    tasksCreated: string[]; // IDs de tareas creadas
    preventivesUpdated: string[]; // IDs de preventivos actualizados
}

export interface PrismaOperations {
    findPreventives: (currentYear: number) => Promise<PreventiveWithRelations[]>;
    updatePreventiveStatus: (id: string, status: PreventiveStatus) => Promise<void>;
    findAssignedUsers: (userIds: string[]) => Promise<{ fullName: string }[]>;
    createTask: (data: {
        taskNumber: string;
        participants: string[];
        taskType: TaskType;
        status: TaskStatus;
        description: string;
        businessId: string;
        branchId: string;
        assignedIDs: string[];
        preventiveId: string;
    }) => Promise<{ id: string }>;
}

export interface GeneratePreventiveTasksDependencies {
    prismaOps: PrismaOperations;
    generateTaskNumber: () => Promise<string>;
    getCurrentDate: () => Date;
}

/**
 * Procesa todos los preventivos y genera tareas según corresponda.
 * Esta función es pura y recibe todas sus dependencias como parámetros,
 * lo que facilita el testing con mocks.
 */
export async function processPreventiveTasks(
    deps: GeneratePreventiveTasksDependencies,
): Promise<ProcessPreventiveTasksResult> {
    const { prismaOps, generateTaskNumber, getCurrentDate } = deps;

    const stats = {
        mensual: 0,
        bimestral: 0,
        trimestral: 0,
        cuatrimestral: 0,
        semestral: 0,
        anual: 0,
        porMeses: 0,
        total: 0,
    };

    const tasksCreated: string[] = [];
    const preventivesUpdated: string[] = [];

    const currentDate = getCurrentDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const preventives = await prismaOps.findPreventives(currentYear);

    for (const preventive of preventives) {
        const result = shouldCreatePreventiveTask(
            {
                months: preventive.months,
                frequency: preventive.frequency,
                tasks: preventive.tasks,
            },
            currentMonth,
            currentYear,
        );

        if (result.shouldCreate) {
            await prismaOps.updatePreventiveStatus(
                preventive.id,
                PreventiveStatus.Pendiente,
            );
            preventivesUpdated.push(preventive.id);

            // Obtener nombres de técnicos asignados
            let participantNames: string[] = [];
            if (preventive.assigned && preventive.assigned.length > 0) {
                const assignedUsers = await prismaOps.findAssignedUsers(
                    preventive.assigned.map((a) => a.id),
                );
                participantNames = assignedUsers.map((user) => user.fullName);
            }

            const taskNumber = await generateTaskNumber();

            const description = preventive.frequency
                ? `Tarea preventiva generada automáticamente - Vence el 28/${getLastMonthOfCurrentPeriod(
                      currentMonth,
                      preventive.frequency,
                  )}/${currentYear}`
                : `Tarea preventiva generada automáticamente - Vence el 28/${currentMonth}/${currentYear}`;

            const createdTask = await prismaOps.createTask({
                taskNumber,
                participants: participantNames,
                taskType: TaskType.Preventivo,
                status: TaskStatus.Pendiente,
                description,
                businessId: preventive.businessId,
                branchId: preventive.branchId,
                assignedIDs: preventive.assignedIDs,
                preventiveId: preventive.id,
            });

            tasksCreated.push(createdTask.id);

            // Incrementar contadores
            stats.total++;
            if (preventive.months.length > 0) {
                stats.porMeses++;
            } else if (preventive.frequency) {
                switch (preventive.frequency) {
                    case PreventiveFrequency.Mensual:
                        stats.mensual++;
                        break;
                    case PreventiveFrequency.Bimestral:
                        stats.bimestral++;
                        break;
                    case PreventiveFrequency.Trimestral:
                        stats.trimestral++;
                        break;
                    case PreventiveFrequency.Cuatrimestral:
                        stats.cuatrimestral++;
                        break;
                    case PreventiveFrequency.Semestral:
                        stats.semestral++;
                        break;
                    case PreventiveFrequency.Anual:
                        stats.anual++;
                        break;
                }
            }
        } else if (result.existingCompletedTaskInPeriod) {
            await prismaOps.updatePreventiveStatus(preventive.id, PreventiveStatus.AlDia);
            preventivesUpdated.push(preventive.id);
        }
    }

    return {
        success: true,
        message: `Procesados ${preventives.length} preventivos. Creadas ${stats.total} tareas.`,
        stats,
        preventivesProcessed: preventives.length,
        tasksCreated,
        preventivesUpdated,
    };
}
