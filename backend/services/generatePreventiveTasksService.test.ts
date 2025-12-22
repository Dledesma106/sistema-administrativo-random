import {
    PreventiveFrequency,
    PreventiveStatus,
    TaskStatus,
    TaskType,
} from '@prisma/client';

import {
    processPreventiveTasks,
    PreventiveWithRelations,
    PrismaOperations,
    GeneratePreventiveTasksDependencies,
} from './generatePreventiveTasksService';

/**
 * Helper para crear un mock de las operaciones de Prisma
 */
function createMockPrismaOps(
    preventives: PreventiveWithRelations[] = [],
): PrismaOperations & {
    updatedPreventives: { id: string; status: PreventiveStatus }[];
    createdTasks: Parameters<PrismaOperations['createTask']>[0][];
} {
    const updatedPreventives: { id: string; status: PreventiveStatus }[] = [];
    const createdTasks: Parameters<PrismaOperations['createTask']>[0][] = [];
    let taskCounter = 0;

    return {
        updatedPreventives,
        createdTasks,

        findPreventives: jest.fn().mockResolvedValue(preventives),

        updatePreventiveStatus: jest.fn().mockImplementation(async (id, status) => {
            updatedPreventives.push({
                id,
                status,
            });
        }),

        findAssignedUsers: jest.fn().mockResolvedValue([{ fullName: 'Juan Pérez' }]),

        createTask: jest.fn().mockImplementation(async (data) => {
            createdTasks.push(data);
            taskCounter++;
            return { id: `task-${taskCounter}` };
        }),
    };
}

/**
 * Helper para crear un preventivo de prueba
 */
function createTestPreventive(
    overrides: Partial<PreventiveWithRelations> = {},
): PreventiveWithRelations {
    return {
        id: 'prev-1',
        months: [],
        frequency: PreventiveFrequency.Mensual,
        businessId: 'business-1',
        branchId: 'branch-1',
        assignedIDs: ['user-1'],
        business: { name: 'Empresa Test' },
        branch: {
            number: 1,
            client: { name: 'Cliente Test' },
        },
        assigned: [{ id: 'user-1' }],
        tasks: [],
        ...overrides,
    };
}

/**
 * Helper para crear las dependencias del servicio
 */
function createDependencies(
    prismaOps: PrismaOperations,
    currentDate: Date = new Date(2025, 0, 15), // 15 de Enero 2025
): GeneratePreventiveTasksDependencies {
    let taskCounter = 0;
    return {
        prismaOps,
        generateTaskNumber: jest.fn().mockImplementation(async () => {
            taskCounter++;
            return `TASK-${taskCounter.toString().padStart(4, '0')}`;
        }),
        getCurrentDate: () => currentDate,
    };
}

describe('processPreventiveTasks - Tests de Integración', () => {
    describe('Escenarios básicos', () => {
        it('debe retornar stats vacías cuando no hay preventivos', async () => {
            const mockPrisma = createMockPrismaOps([]);
            const deps = createDependencies(mockPrisma);

            const result = await processPreventiveTasks(deps);

            expect(result.success).toBe(true);
            expect(result.stats.total).toBe(0);
            expect(result.preventivesProcessed).toBe(0);
            expect(result.tasksCreated).toHaveLength(0);
        });

        it('debe crear tarea para preventivo mensual sin tareas previas', async () => {
            const preventive = createTestPreventive({
                frequency: PreventiveFrequency.Mensual,
                tasks: [],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 0, 15)); // Enero

            const result = await processPreventiveTasks(deps);

            expect(result.success).toBe(true);
            expect(result.stats.total).toBe(1);
            expect(result.stats.mensual).toBe(1);
            expect(mockPrisma.createdTasks).toHaveLength(1);
            expect(mockPrisma.createdTasks[0]).toMatchObject({
                taskType: TaskType.Preventivo,
                status: TaskStatus.Pendiente,
                preventiveId: 'prev-1',
            });
        });

        it('NO debe crear tarea si ya existe una en el período', async () => {
            const preventive = createTestPreventive({
                frequency: PreventiveFrequency.Mensual,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 5), // 5 de Enero
                        status: TaskStatus.Pendiente,
                    },
                ],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 0, 15)); // 15 de Enero

            const result = await processPreventiveTasks(deps);

            expect(result.stats.total).toBe(0);
            expect(mockPrisma.createdTasks).toHaveLength(0);
        });
    });

    describe('Preventivos Trimestrales - Casos del bug reportado', () => {
        it('NO debe crear tarea en Febrero si ya hay tarea aprobada en Enero (mismo trimestre)', async () => {
            const preventive = createTestPreventive({
                id: 'prev-trimestral',
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 10), // 10 de Enero
                        status: TaskStatus.Aprobada,
                    },
                ],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 1, 15)); // 15 de Febrero

            const result = await processPreventiveTasks(deps);

            expect(result.stats.total).toBe(0);
            expect(mockPrisma.createdTasks).toHaveLength(0);
            // El preventivo debe marcarse como "Al día"
            expect(mockPrisma.updatedPreventives).toContainEqual({
                id: 'prev-trimestral',
                status: PreventiveStatus.AlDia,
            });
        });

        it('NO debe crear tarea en Marzo si ya hay tarea aprobada en Enero (mismo trimestre)', async () => {
            const preventive = createTestPreventive({
                id: 'prev-trimestral',
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 10),
                        status: TaskStatus.Aprobada,
                    },
                ],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 2, 15)); // 15 de Marzo

            const result = await processPreventiveTasks(deps);

            expect(result.stats.total).toBe(0);
            expect(mockPrisma.createdTasks).toHaveLength(0);
        });

        it('DEBE crear tarea en Abril (nuevo trimestre Q2)', async () => {
            const preventive = createTestPreventive({
                id: 'prev-trimestral',
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 10), // Enero (Q1)
                        status: TaskStatus.Aprobada,
                    },
                ],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 3, 1)); // 1 de Abril (Q2)

            const result = await processPreventiveTasks(deps);

            expect(result.stats.total).toBe(1);
            expect(result.stats.trimestral).toBe(1);
            expect(mockPrisma.createdTasks).toHaveLength(1);
        });
    });

    describe('Preventivos Semestrales', () => {
        it('NO debe crear tarea en Junio si ya hay tarea completada en Enero (mismo semestre)', async () => {
            const preventive = createTestPreventive({
                frequency: PreventiveFrequency.Semestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 15), // Enero (S1)
                        status: TaskStatus.Finalizada,
                    },
                ],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 5, 15)); // Junio (S1)

            const result = await processPreventiveTasks(deps);

            expect(result.stats.total).toBe(0);
        });

        it('DEBE crear tarea en Julio (nuevo semestre S2)', async () => {
            const preventive = createTestPreventive({
                frequency: PreventiveFrequency.Semestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 2, 15), // Marzo (S1)
                        status: TaskStatus.Aprobada,
                    },
                ],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 6, 1)); // Julio (S2)

            const result = await processPreventiveTasks(deps);

            expect(result.stats.total).toBe(1);
            expect(result.stats.semestral).toBe(1);
        });
    });

    describe('Preventivos por meses específicos', () => {
        it('debe crear tarea cuando el mes actual está en la lista', async () => {
            const preventive = createTestPreventive({
                months: ['Enero', 'Julio'],
                frequency: null,
                tasks: [],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 0, 15)); // Enero

            const result = await processPreventiveTasks(deps);

            expect(result.stats.total).toBe(1);
            expect(result.stats.porMeses).toBe(1);
        });

        it('NO debe crear tarea cuando el mes actual NO está en la lista', async () => {
            const preventive = createTestPreventive({
                months: ['Enero', 'Julio'],
                frequency: null,
                tasks: [],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 2, 15)); // Marzo

            const result = await processPreventiveTasks(deps);

            expect(result.stats.total).toBe(0);
        });
    });

    describe('Cambio de año', () => {
        it('DEBE crear tarea en Enero 2025 aunque haya tarea de Enero 2024', async () => {
            const preventive = createTestPreventive({
                frequency: PreventiveFrequency.Mensual,
                tasks: [
                    {
                        createdAt: new Date(2024, 0, 15), // Enero 2024
                        status: TaskStatus.Aprobada,
                    },
                ],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 0, 15)); // Enero 2025

            const result = await processPreventiveTasks(deps);

            expect(result.stats.total).toBe(1);
            expect(mockPrisma.createdTasks).toHaveLength(1);
        });

        it('DEBE crear tarea trimestral en Q1 2025 aunque haya tarea en Q4 2024', async () => {
            const preventive = createTestPreventive({
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2024, 9, 15), // Octubre 2024 (Q4)
                        status: TaskStatus.Aprobada,
                    },
                ],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 0, 15)); // Enero 2025 (Q1)

            const result = await processPreventiveTasks(deps);

            expect(result.stats.total).toBe(1);
        });
    });

    describe('Múltiples preventivos', () => {
        it('debe procesar correctamente múltiples preventivos con diferentes frecuencias', async () => {
            const preventives = [
                createTestPreventive({
                    id: 'prev-mensual',
                    frequency: PreventiveFrequency.Mensual,
                    tasks: [],
                }),
                createTestPreventive({
                    id: 'prev-trimestral',
                    frequency: PreventiveFrequency.Trimestral,
                    tasks: [],
                }),
                createTestPreventive({
                    id: 'prev-semestral',
                    frequency: PreventiveFrequency.Semestral,
                    tasks: [],
                }),
                createTestPreventive({
                    id: 'prev-con-tarea',
                    frequency: PreventiveFrequency.Mensual,
                    tasks: [
                        {
                            createdAt: new Date(2025, 0, 5),
                            status: TaskStatus.Pendiente,
                        },
                    ],
                }),
            ];
            const mockPrisma = createMockPrismaOps(preventives);
            const deps = createDependencies(mockPrisma, new Date(2025, 0, 15)); // Enero

            const result = await processPreventiveTasks(deps);

            expect(result.preventivesProcessed).toBe(4);
            expect(result.stats.total).toBe(3); // 3 tareas creadas (el 4to ya tenía)
            expect(result.stats.mensual).toBe(1);
            expect(result.stats.trimestral).toBe(1);
            expect(result.stats.semestral).toBe(1);
            expect(mockPrisma.createdTasks).toHaveLength(3);
        });
    });

    describe('Actualización de estado del preventivo', () => {
        it('debe marcar preventivo como Pendiente cuando crea una tarea', async () => {
            const preventive = createTestPreventive({
                id: 'prev-1',
                frequency: PreventiveFrequency.Mensual,
                tasks: [],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma);

            await processPreventiveTasks(deps);

            expect(mockPrisma.updatedPreventives).toContainEqual({
                id: 'prev-1',
                status: PreventiveStatus.Pendiente,
            });
        });

        it('debe marcar preventivo como AlDia cuando hay tarea completada en el período', async () => {
            const preventive = createTestPreventive({
                id: 'prev-1',
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 10),
                        status: TaskStatus.Aprobada,
                    },
                ],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 1, 15)); // Febrero

            await processPreventiveTasks(deps);

            expect(mockPrisma.updatedPreventives).toContainEqual({
                id: 'prev-1',
                status: PreventiveStatus.AlDia,
            });
        });
    });

    describe('Descripción de la tarea generada', () => {
        it('debe incluir fecha de vencimiento correcta para trimestral', async () => {
            const preventive = createTestPreventive({
                frequency: PreventiveFrequency.Trimestral,
                tasks: [],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 0, 15)); // Enero

            await processPreventiveTasks(deps);

            // Q1 (Ene-Feb-Mar) vence el 28/3
            expect(mockPrisma.createdTasks[0].description).toContain('28/3/2025');
        });

        it('debe incluir fecha de vencimiento correcta para semestral', async () => {
            const preventive = createTestPreventive({
                frequency: PreventiveFrequency.Semestral,
                tasks: [],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 0, 15)); // Enero

            await processPreventiveTasks(deps);

            // S1 (Ene-Jun) vence el 28/6
            expect(mockPrisma.createdTasks[0].description).toContain('28/6/2025');
        });

        it('debe incluir mes actual para preventivos por meses específicos', async () => {
            const preventive = createTestPreventive({
                months: ['Marzo'],
                frequency: null,
                tasks: [],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            const deps = createDependencies(mockPrisma, new Date(2025, 2, 15)); // Marzo

            await processPreventiveTasks(deps);

            expect(mockPrisma.createdTasks[0].description).toContain('28/3/2025');
        });
    });

    describe('Asignación de participantes', () => {
        it('debe obtener nombres de usuarios asignados', async () => {
            const preventive = createTestPreventive({
                assigned: [{ id: 'user-1' }, { id: 'user-2' }],
                tasks: [],
            });
            const mockPrisma = createMockPrismaOps([preventive]);
            mockPrisma.findAssignedUsers = jest
                .fn()
                .mockResolvedValue([
                    { fullName: 'Juan Pérez' },
                    { fullName: 'María García' },
                ]);
            const deps = createDependencies(mockPrisma);

            await processPreventiveTasks(deps);

            expect(mockPrisma.findAssignedUsers).toHaveBeenCalledWith([
                'user-1',
                'user-2',
            ]);
            expect(mockPrisma.createdTasks[0].participants).toEqual([
                'Juan Pérez',
                'María García',
            ]);
        });
    });
});
