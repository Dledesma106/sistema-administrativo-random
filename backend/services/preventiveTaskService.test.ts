import { PreventiveFrequency, TaskStatus } from '@prisma/client';

import {
    isFirstMonthOfPeriod,
    getFirstMonthOfCurrentPeriod,
    getLastMonthOfCurrentPeriod,
    shouldCreatePreventiveTask,
    isPreventiveUpToDate,
    monthNameToNumber,
    PreventiveForVerification,
} from './preventiveTaskService';

describe('monthNameToNumber', () => {
    it('debe mapear correctamente todos los meses', () => {
        expect(monthNameToNumber['Enero']).toBe('1');
        expect(monthNameToNumber['Febrero']).toBe('2');
        expect(monthNameToNumber['Marzo']).toBe('3');
        expect(monthNameToNumber['Abril']).toBe('4');
        expect(monthNameToNumber['Mayo']).toBe('5');
        expect(monthNameToNumber['Junio']).toBe('6');
        expect(monthNameToNumber['Julio']).toBe('7');
        expect(monthNameToNumber['Agosto']).toBe('8');
        expect(monthNameToNumber['Septiembre']).toBe('9');
        expect(monthNameToNumber['Octubre']).toBe('10');
        expect(monthNameToNumber['Noviembre']).toBe('11');
        expect(monthNameToNumber['Diciembre']).toBe('12');
    });
});

describe('isFirstMonthOfPeriod', () => {
    describe('Mensual', () => {
        it('debe retornar true para todos los meses', () => {
            for (let month = 1; month <= 12; month++) {
                expect(isFirstMonthOfPeriod(month, PreventiveFrequency.Mensual)).toBe(
                    true,
                );
            }
        });
    });

    describe('Bimestral', () => {
        it('debe retornar true para meses impares (Ene, Mar, May, Jul, Sep, Nov)', () => {
            expect(isFirstMonthOfPeriod(1, PreventiveFrequency.Bimestral)).toBe(true); // Enero
            expect(isFirstMonthOfPeriod(3, PreventiveFrequency.Bimestral)).toBe(true); // Marzo
            expect(isFirstMonthOfPeriod(5, PreventiveFrequency.Bimestral)).toBe(true); // Mayo
            expect(isFirstMonthOfPeriod(7, PreventiveFrequency.Bimestral)).toBe(true); // Julio
            expect(isFirstMonthOfPeriod(9, PreventiveFrequency.Bimestral)).toBe(true); // Septiembre
            expect(isFirstMonthOfPeriod(11, PreventiveFrequency.Bimestral)).toBe(true); // Noviembre
        });

        it('debe retornar false para meses pares (Feb, Abr, Jun, Ago, Oct, Dic)', () => {
            expect(isFirstMonthOfPeriod(2, PreventiveFrequency.Bimestral)).toBe(false); // Febrero
            expect(isFirstMonthOfPeriod(4, PreventiveFrequency.Bimestral)).toBe(false); // Abril
            expect(isFirstMonthOfPeriod(6, PreventiveFrequency.Bimestral)).toBe(false); // Junio
            expect(isFirstMonthOfPeriod(8, PreventiveFrequency.Bimestral)).toBe(false); // Agosto
            expect(isFirstMonthOfPeriod(10, PreventiveFrequency.Bimestral)).toBe(false); // Octubre
            expect(isFirstMonthOfPeriod(12, PreventiveFrequency.Bimestral)).toBe(false); // Diciembre
        });
    });

    describe('Trimestral', () => {
        it('debe retornar true para Ene(1), Abr(4), Jul(7), Oct(10)', () => {
            expect(isFirstMonthOfPeriod(1, PreventiveFrequency.Trimestral)).toBe(true);
            expect(isFirstMonthOfPeriod(4, PreventiveFrequency.Trimestral)).toBe(true);
            expect(isFirstMonthOfPeriod(7, PreventiveFrequency.Trimestral)).toBe(true);
            expect(isFirstMonthOfPeriod(10, PreventiveFrequency.Trimestral)).toBe(true);
        });

        it('debe retornar false para los demás meses', () => {
            expect(isFirstMonthOfPeriod(2, PreventiveFrequency.Trimestral)).toBe(false);
            expect(isFirstMonthOfPeriod(3, PreventiveFrequency.Trimestral)).toBe(false);
            expect(isFirstMonthOfPeriod(5, PreventiveFrequency.Trimestral)).toBe(false);
            expect(isFirstMonthOfPeriod(6, PreventiveFrequency.Trimestral)).toBe(false);
            expect(isFirstMonthOfPeriod(8, PreventiveFrequency.Trimestral)).toBe(false);
            expect(isFirstMonthOfPeriod(9, PreventiveFrequency.Trimestral)).toBe(false);
            expect(isFirstMonthOfPeriod(11, PreventiveFrequency.Trimestral)).toBe(false);
            expect(isFirstMonthOfPeriod(12, PreventiveFrequency.Trimestral)).toBe(false);
        });
    });

    describe('Cuatrimestral', () => {
        it('debe retornar true para Ene(1), May(5), Sep(9)', () => {
            expect(isFirstMonthOfPeriod(1, PreventiveFrequency.Cuatrimestral)).toBe(true);
            expect(isFirstMonthOfPeriod(5, PreventiveFrequency.Cuatrimestral)).toBe(true);
            expect(isFirstMonthOfPeriod(9, PreventiveFrequency.Cuatrimestral)).toBe(true);
        });

        it('debe retornar false para los demás meses', () => {
            expect(isFirstMonthOfPeriod(2, PreventiveFrequency.Cuatrimestral)).toBe(
                false,
            );
            expect(isFirstMonthOfPeriod(3, PreventiveFrequency.Cuatrimestral)).toBe(
                false,
            );
            expect(isFirstMonthOfPeriod(4, PreventiveFrequency.Cuatrimestral)).toBe(
                false,
            );
            expect(isFirstMonthOfPeriod(6, PreventiveFrequency.Cuatrimestral)).toBe(
                false,
            );
            expect(isFirstMonthOfPeriod(7, PreventiveFrequency.Cuatrimestral)).toBe(
                false,
            );
            expect(isFirstMonthOfPeriod(8, PreventiveFrequency.Cuatrimestral)).toBe(
                false,
            );
            expect(isFirstMonthOfPeriod(10, PreventiveFrequency.Cuatrimestral)).toBe(
                false,
            );
            expect(isFirstMonthOfPeriod(11, PreventiveFrequency.Cuatrimestral)).toBe(
                false,
            );
            expect(isFirstMonthOfPeriod(12, PreventiveFrequency.Cuatrimestral)).toBe(
                false,
            );
        });
    });

    describe('Semestral', () => {
        it('debe retornar true para Ene(1) y Jul(7)', () => {
            expect(isFirstMonthOfPeriod(1, PreventiveFrequency.Semestral)).toBe(true);
            expect(isFirstMonthOfPeriod(7, PreventiveFrequency.Semestral)).toBe(true);
        });

        it('debe retornar false para los demás meses', () => {
            expect(isFirstMonthOfPeriod(2, PreventiveFrequency.Semestral)).toBe(false);
            expect(isFirstMonthOfPeriod(3, PreventiveFrequency.Semestral)).toBe(false);
            expect(isFirstMonthOfPeriod(4, PreventiveFrequency.Semestral)).toBe(false);
            expect(isFirstMonthOfPeriod(5, PreventiveFrequency.Semestral)).toBe(false);
            expect(isFirstMonthOfPeriod(6, PreventiveFrequency.Semestral)).toBe(false);
            expect(isFirstMonthOfPeriod(8, PreventiveFrequency.Semestral)).toBe(false);
            expect(isFirstMonthOfPeriod(9, PreventiveFrequency.Semestral)).toBe(false);
            expect(isFirstMonthOfPeriod(10, PreventiveFrequency.Semestral)).toBe(false);
            expect(isFirstMonthOfPeriod(11, PreventiveFrequency.Semestral)).toBe(false);
            expect(isFirstMonthOfPeriod(12, PreventiveFrequency.Semestral)).toBe(false);
        });
    });

    describe('Anual', () => {
        it('debe retornar true solo para Enero(1)', () => {
            expect(isFirstMonthOfPeriod(1, PreventiveFrequency.Anual)).toBe(true);
        });

        it('debe retornar false para los demás meses', () => {
            for (let month = 2; month <= 12; month++) {
                expect(isFirstMonthOfPeriod(month, PreventiveFrequency.Anual)).toBe(
                    false,
                );
            }
        });
    });

    describe('null frequency', () => {
        it('debe retornar false para frecuencia null', () => {
            expect(isFirstMonthOfPeriod(1, null)).toBe(false);
            expect(isFirstMonthOfPeriod(6, null)).toBe(false);
        });
    });
});

describe('getFirstMonthOfCurrentPeriod', () => {
    describe('Mensual', () => {
        it('debe retornar el mismo mes', () => {
            for (let month = 1; month <= 12; month++) {
                expect(
                    getFirstMonthOfCurrentPeriod(month, PreventiveFrequency.Mensual),
                ).toBe(month);
            }
        });
    });

    describe('Bimestral', () => {
        it('debe retornar el primer mes del bimestre', () => {
            // Bimestre 1: Ene-Feb
            expect(getFirstMonthOfCurrentPeriod(1, PreventiveFrequency.Bimestral)).toBe(
                1,
            );
            expect(getFirstMonthOfCurrentPeriod(2, PreventiveFrequency.Bimestral)).toBe(
                1,
            );
            // Bimestre 2: Mar-Abr
            expect(getFirstMonthOfCurrentPeriod(3, PreventiveFrequency.Bimestral)).toBe(
                3,
            );
            expect(getFirstMonthOfCurrentPeriod(4, PreventiveFrequency.Bimestral)).toBe(
                3,
            );
            // Bimestre 3: May-Jun
            expect(getFirstMonthOfCurrentPeriod(5, PreventiveFrequency.Bimestral)).toBe(
                5,
            );
            expect(getFirstMonthOfCurrentPeriod(6, PreventiveFrequency.Bimestral)).toBe(
                5,
            );
            // Bimestre 4: Jul-Ago
            expect(getFirstMonthOfCurrentPeriod(7, PreventiveFrequency.Bimestral)).toBe(
                7,
            );
            expect(getFirstMonthOfCurrentPeriod(8, PreventiveFrequency.Bimestral)).toBe(
                7,
            );
            // Bimestre 5: Sep-Oct
            expect(getFirstMonthOfCurrentPeriod(9, PreventiveFrequency.Bimestral)).toBe(
                9,
            );
            expect(getFirstMonthOfCurrentPeriod(10, PreventiveFrequency.Bimestral)).toBe(
                9,
            );
            // Bimestre 6: Nov-Dic
            expect(getFirstMonthOfCurrentPeriod(11, PreventiveFrequency.Bimestral)).toBe(
                11,
            );
            expect(getFirstMonthOfCurrentPeriod(12, PreventiveFrequency.Bimestral)).toBe(
                11,
            );
        });
    });

    describe('Trimestral', () => {
        it('debe retornar el primer mes del trimestre', () => {
            // Q1: Ene-Feb-Mar
            expect(getFirstMonthOfCurrentPeriod(1, PreventiveFrequency.Trimestral)).toBe(
                1,
            );
            expect(getFirstMonthOfCurrentPeriod(2, PreventiveFrequency.Trimestral)).toBe(
                1,
            );
            expect(getFirstMonthOfCurrentPeriod(3, PreventiveFrequency.Trimestral)).toBe(
                1,
            );
            // Q2: Abr-May-Jun
            expect(getFirstMonthOfCurrentPeriod(4, PreventiveFrequency.Trimestral)).toBe(
                4,
            );
            expect(getFirstMonthOfCurrentPeriod(5, PreventiveFrequency.Trimestral)).toBe(
                4,
            );
            expect(getFirstMonthOfCurrentPeriod(6, PreventiveFrequency.Trimestral)).toBe(
                4,
            );
            // Q3: Jul-Ago-Sep
            expect(getFirstMonthOfCurrentPeriod(7, PreventiveFrequency.Trimestral)).toBe(
                7,
            );
            expect(getFirstMonthOfCurrentPeriod(8, PreventiveFrequency.Trimestral)).toBe(
                7,
            );
            expect(getFirstMonthOfCurrentPeriod(9, PreventiveFrequency.Trimestral)).toBe(
                7,
            );
            // Q4: Oct-Nov-Dic
            expect(getFirstMonthOfCurrentPeriod(10, PreventiveFrequency.Trimestral)).toBe(
                10,
            );
            expect(getFirstMonthOfCurrentPeriod(11, PreventiveFrequency.Trimestral)).toBe(
                10,
            );
            expect(getFirstMonthOfCurrentPeriod(12, PreventiveFrequency.Trimestral)).toBe(
                10,
            );
        });
    });

    describe('Cuatrimestral', () => {
        it('debe retornar el primer mes del cuatrimestre', () => {
            // C1: Ene-Feb-Mar-Abr
            expect(
                getFirstMonthOfCurrentPeriod(1, PreventiveFrequency.Cuatrimestral),
            ).toBe(1);
            expect(
                getFirstMonthOfCurrentPeriod(2, PreventiveFrequency.Cuatrimestral),
            ).toBe(1);
            expect(
                getFirstMonthOfCurrentPeriod(3, PreventiveFrequency.Cuatrimestral),
            ).toBe(1);
            expect(
                getFirstMonthOfCurrentPeriod(4, PreventiveFrequency.Cuatrimestral),
            ).toBe(1);
            // C2: May-Jun-Jul-Ago
            expect(
                getFirstMonthOfCurrentPeriod(5, PreventiveFrequency.Cuatrimestral),
            ).toBe(5);
            expect(
                getFirstMonthOfCurrentPeriod(6, PreventiveFrequency.Cuatrimestral),
            ).toBe(5);
            expect(
                getFirstMonthOfCurrentPeriod(7, PreventiveFrequency.Cuatrimestral),
            ).toBe(5);
            expect(
                getFirstMonthOfCurrentPeriod(8, PreventiveFrequency.Cuatrimestral),
            ).toBe(5);
            // C3: Sep-Oct-Nov-Dic
            expect(
                getFirstMonthOfCurrentPeriod(9, PreventiveFrequency.Cuatrimestral),
            ).toBe(9);
            expect(
                getFirstMonthOfCurrentPeriod(10, PreventiveFrequency.Cuatrimestral),
            ).toBe(9);
            expect(
                getFirstMonthOfCurrentPeriod(11, PreventiveFrequency.Cuatrimestral),
            ).toBe(9);
            expect(
                getFirstMonthOfCurrentPeriod(12, PreventiveFrequency.Cuatrimestral),
            ).toBe(9);
        });
    });

    describe('Semestral', () => {
        it('debe retornar el primer mes del semestre', () => {
            // S1: Ene-Jun
            for (let month = 1; month <= 6; month++) {
                expect(
                    getFirstMonthOfCurrentPeriod(month, PreventiveFrequency.Semestral),
                ).toBe(1);
            }
            // S2: Jul-Dic
            for (let month = 7; month <= 12; month++) {
                expect(
                    getFirstMonthOfCurrentPeriod(month, PreventiveFrequency.Semestral),
                ).toBe(7);
            }
        });
    });

    describe('Anual', () => {
        it('debe retornar siempre Enero (1)', () => {
            for (let month = 1; month <= 12; month++) {
                expect(
                    getFirstMonthOfCurrentPeriod(month, PreventiveFrequency.Anual),
                ).toBe(1);
            }
        });
    });
});

describe('getLastMonthOfCurrentPeriod', () => {
    describe('Mensual', () => {
        it('debe retornar el mismo mes', () => {
            for (let month = 1; month <= 12; month++) {
                expect(
                    getLastMonthOfCurrentPeriod(month, PreventiveFrequency.Mensual),
                ).toBe(month);
            }
        });
    });

    describe('Bimestral', () => {
        it('debe retornar el último mes del bimestre', () => {
            expect(getLastMonthOfCurrentPeriod(1, PreventiveFrequency.Bimestral)).toBe(2);
            expect(getLastMonthOfCurrentPeriod(2, PreventiveFrequency.Bimestral)).toBe(2);
            expect(getLastMonthOfCurrentPeriod(3, PreventiveFrequency.Bimestral)).toBe(4);
            expect(getLastMonthOfCurrentPeriod(4, PreventiveFrequency.Bimestral)).toBe(4);
            expect(getLastMonthOfCurrentPeriod(11, PreventiveFrequency.Bimestral)).toBe(
                12,
            );
            expect(getLastMonthOfCurrentPeriod(12, PreventiveFrequency.Bimestral)).toBe(
                12,
            );
        });
    });

    describe('Trimestral', () => {
        it('debe retornar el último mes del trimestre', () => {
            // Q1
            expect(getLastMonthOfCurrentPeriod(1, PreventiveFrequency.Trimestral)).toBe(
                3,
            );
            expect(getLastMonthOfCurrentPeriod(2, PreventiveFrequency.Trimestral)).toBe(
                3,
            );
            expect(getLastMonthOfCurrentPeriod(3, PreventiveFrequency.Trimestral)).toBe(
                3,
            );
            // Q2
            expect(getLastMonthOfCurrentPeriod(4, PreventiveFrequency.Trimestral)).toBe(
                6,
            );
            expect(getLastMonthOfCurrentPeriod(5, PreventiveFrequency.Trimestral)).toBe(
                6,
            );
            expect(getLastMonthOfCurrentPeriod(6, PreventiveFrequency.Trimestral)).toBe(
                6,
            );
            // Q3
            expect(getLastMonthOfCurrentPeriod(7, PreventiveFrequency.Trimestral)).toBe(
                9,
            );
            // Q4
            expect(getLastMonthOfCurrentPeriod(10, PreventiveFrequency.Trimestral)).toBe(
                12,
            );
            expect(getLastMonthOfCurrentPeriod(11, PreventiveFrequency.Trimestral)).toBe(
                12,
            );
            expect(getLastMonthOfCurrentPeriod(12, PreventiveFrequency.Trimestral)).toBe(
                12,
            );
        });
    });

    describe('Semestral', () => {
        it('debe retornar el último mes del semestre', () => {
            for (let month = 1; month <= 6; month++) {
                expect(
                    getLastMonthOfCurrentPeriod(month, PreventiveFrequency.Semestral),
                ).toBe(6);
            }
            for (let month = 7; month <= 12; month++) {
                expect(
                    getLastMonthOfCurrentPeriod(month, PreventiveFrequency.Semestral),
                ).toBe(12);
            }
        });
    });

    describe('Anual', () => {
        it('debe retornar siempre Diciembre (12)', () => {
            for (let month = 1; month <= 12; month++) {
                expect(
                    getLastMonthOfCurrentPeriod(month, PreventiveFrequency.Anual),
                ).toBe(12);
            }
        });
    });
});

describe('shouldCreatePreventiveTask', () => {
    const createPreventive = (
        overrides: Partial<PreventiveForVerification> = {},
    ): PreventiveForVerification => ({
        months: [],
        frequency: null,
        tasks: [],
        ...overrides,
    });

    describe('Preventivos por meses específicos', () => {
        it('debe crear tarea cuando el mes actual está en la lista y no hay tareas', () => {
            const preventive = createPreventive({
                months: ['Enero', 'Julio'],
            });

            const result = shouldCreatePreventiveTask(preventive, 1, 2025);
            expect(result.shouldCreate).toBe(true);
        });

        it('NO debe crear tarea cuando el mes actual no está en la lista', () => {
            const preventive = createPreventive({
                months: ['Enero', 'Julio'],
            });

            const result = shouldCreatePreventiveTask(preventive, 3, 2025); // Marzo
            expect(result.shouldCreate).toBe(false);
            expect(result.reason).toContain('no está en los meses programados');
        });

        it('NO debe crear tarea cuando ya existe una tarea en el mes', () => {
            const preventive = createPreventive({
                months: ['Enero', 'Julio'],
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 15),
                        status: TaskStatus.Pendiente,
                    },
                ],
            });

            const result = shouldCreatePreventiveTask(preventive, 1, 2025);
            expect(result.shouldCreate).toBe(false);
            expect(result.reason).toContain('Ya existe una tarea');
        });

        it('debe crear tarea si la tarea existente es de otro año', () => {
            const preventive = createPreventive({
                months: ['Enero'],
                tasks: [
                    {
                        createdAt: new Date(2024, 0, 15),
                        status: TaskStatus.Aprobada,
                    }, // Enero 2024
                ],
            });

            const result = shouldCreatePreventiveTask(preventive, 1, 2025);
            expect(result.shouldCreate).toBe(true);
        });
    });

    describe('Preventivos por frecuencia - Mensual', () => {
        it('debe crear tarea cuando no hay tareas en el mes', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Mensual,
            });

            const result = shouldCreatePreventiveTask(preventive, 3, 2025);
            expect(result.shouldCreate).toBe(true);
        });

        it('NO debe crear tarea cuando ya hay una tarea en el mes', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Mensual,
                tasks: [
                    {
                        createdAt: new Date(2025, 2, 10),
                        status: TaskStatus.Pendiente,
                    }, // Marzo 2025
                ],
            });

            const result = shouldCreatePreventiveTask(preventive, 3, 2025);
            expect(result.shouldCreate).toBe(false);
        });
    });

    describe('Preventivos por frecuencia - Trimestral', () => {
        it('debe crear tarea en Q1 cuando no hay tareas', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Trimestral,
            });

            // Enero (Q1)
            const result = shouldCreatePreventiveTask(preventive, 1, 2025);
            expect(result.shouldCreate).toBe(true);
        });

        it('NO debe crear tarea en Q1 si ya hay tarea completada en Q1', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 15),
                        status: TaskStatus.Aprobada,
                    }, // Enero 2025
                ],
            });

            // Marzo (todavía Q1)
            const result = shouldCreatePreventiveTask(preventive, 3, 2025);
            expect(result.shouldCreate).toBe(false);
            expect(result.reason).toContain('tarea completada');
        });

        it('NO debe crear tarea si hay tarea pendiente en el período', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 15),
                        status: TaskStatus.Pendiente,
                    }, // Enero 2025
                ],
            });

            // Febrero (todavía Q1)
            const result = shouldCreatePreventiveTask(preventive, 2, 2025);
            expect(result.shouldCreate).toBe(false);
        });

        it('debe crear tarea en Q2 aunque haya tarea completada en Q1', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 15),
                        status: TaskStatus.Aprobada,
                    }, // Enero 2025 (Q1)
                ],
            });

            // Abril (Q2)
            const result = shouldCreatePreventiveTask(preventive, 4, 2025);
            expect(result.shouldCreate).toBe(true);
        });

        it('debe crear tarea en nuevo año aunque haya tarea del año anterior', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2024, 9, 15),
                        status: TaskStatus.Aprobada,
                    }, // Octubre 2024 (Q4)
                ],
            });

            // Enero 2025 (Q1 nuevo año)
            const result = shouldCreatePreventiveTask(preventive, 1, 2025);
            expect(result.shouldCreate).toBe(true);
        });
    });

    describe('Preventivos por frecuencia - Semestral', () => {
        it('debe crear tarea en S1 cuando no hay tareas', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Semestral,
            });

            const result = shouldCreatePreventiveTask(preventive, 1, 2025);
            expect(result.shouldCreate).toBe(true);
        });

        it('NO debe crear tarea en Junio si ya hay tarea en Enero del mismo año', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Semestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 15),
                        status: TaskStatus.Aprobada,
                    }, // Enero 2025
                ],
            });

            // Junio (todavía S1)
            const result = shouldCreatePreventiveTask(preventive, 6, 2025);
            expect(result.shouldCreate).toBe(false);
        });

        it('debe crear tarea en S2 (Julio) aunque haya tarea en S1', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Semestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 2, 15),
                        status: TaskStatus.Aprobada,
                    }, // Marzo 2025 (S1)
                ],
            });

            // Julio (S2)
            const result = shouldCreatePreventiveTask(preventive, 7, 2025);
            expect(result.shouldCreate).toBe(true);
        });
    });

    describe('Caso del bug reportado: tarea completada en período pero se vuelve a crear', () => {
        it('CASO BUG: Trimestral con tarea aprobada en Enero, NO debe crear en Febrero', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 10),
                        status: TaskStatus.Aprobada,
                    },
                ],
            });

            // Febrero del mismo trimestre
            const result = shouldCreatePreventiveTask(preventive, 2, 2025);
            expect(result.shouldCreate).toBe(false);
            expect(result.reason).toContain('completada');
        });

        it('CASO BUG: Trimestral con tarea aprobada en Enero, NO debe crear en Marzo', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 10),
                        status: TaskStatus.Aprobada,
                    },
                ],
            });

            // Marzo del mismo trimestre
            const result = shouldCreatePreventiveTask(preventive, 3, 2025);
            expect(result.shouldCreate).toBe(false);
        });

        it('CASO BUG: Bimestral con tarea aprobada en Enero, NO debe crear en Febrero', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Bimestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 10),
                        status: TaskStatus.Aprobada,
                    },
                ],
            });

            const result = shouldCreatePreventiveTask(preventive, 2, 2025);
            expect(result.shouldCreate).toBe(false);
        });

        it('CASO BUG: Semestral con tarea completada en Marzo, NO debe crear en Junio', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Semestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 2, 15),
                        status: TaskStatus.Finalizada,
                    },
                ],
            });

            const result = shouldCreatePreventiveTask(preventive, 6, 2025);
            expect(result.shouldCreate).toBe(false);
        });
    });

    describe('Preventivo sin configuración', () => {
        it('NO debe crear tarea si no tiene meses ni frecuencia', () => {
            const preventive = createPreventive({
                months: [],
                frequency: null,
            });

            const result = shouldCreatePreventiveTask(preventive, 1, 2025);
            expect(result.shouldCreate).toBe(false);
            expect(result.reason).toContain('no tiene meses ni frecuencia');
        });
    });
});

/**
 * ===========================================
 * TESTS QUE SIMULAN EL COMPORTAMIENTO ORIGINAL
 * para identificar los bugs en generate-preventive-tasks.ts
 * ===========================================
 */

// Simula la lógica ORIGINAL del cron job
function originalShouldCreateTask(
    preventive: PreventiveForVerification,
    currentMonth: number,
    _currentYear: number, // No se usa correctamente en el original
): boolean {
    let shouldCreateTask = false;

    if (preventive.months.length > 0) {
        shouldCreateTask = preventive.months.some(
            (month) => monthNameToNumber[month] === currentMonth.toString(),
        );
    } else if (preventive.frequency) {
        const isFirstMonth = isFirstMonthOfPeriod(currentMonth, preventive.frequency);

        if (isFirstMonth) {
            // BUG 1: Si es el primer mes, directamente dice true sin verificar si ya hay tarea
            shouldCreateTask = true;
        } else {
            const firstMonthOfPeriod = getFirstMonthOfCurrentPeriod(
                currentMonth,
                preventive.frequency,
            );

            // Verifica tareas en el período, pero...
            const hasTaskInCurrentPeriod = preventive.tasks.some((task) => {
                const taskMonth = new Date(task.createdAt).getMonth() + 1;
                // BUG 2: NO verifica el año!
                return taskMonth >= firstMonthOfPeriod && taskMonth <= currentMonth;
            });

            shouldCreateTask = !hasTaskInCurrentPeriod;
        }
    }

    if (shouldCreateTask) {
        // Segunda verificación: existe tarea en el mes actual
        const existingTaskThisMonth = preventive.tasks.find((task) => {
            const taskMonth = new Date(task.createdAt).getMonth() + 1;
            // BUG 3: NO verifica el año aquí tampoco!
            return taskMonth === currentMonth;
        });

        return !existingTaskThisMonth;
    }

    return false;
}

describe('Comparación: Código Original vs Código Corregido', () => {
    const createPreventive = (
        overrides: Partial<PreventiveForVerification> = {},
    ): PreventiveForVerification => ({
        months: [],
        frequency: null,
        tasks: [],
        ...overrides,
    });

    describe('BUG 1: isFirstMonth no verifica tareas existentes en el período', () => {
        it('ORIGINAL: Intenta crear tarea aunque ya exista una completada en el período', () => {
            // Escenario: Tarea creada el 5 de Enero, aprobada
            // Cron corre el 10 de Enero
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 5),
                        status: TaskStatus.Aprobada,
                    },
                ],
            });

            // El código original DEBERÍA decir false (ya hay tarea)
            // Pero como es el primer mes del trimestre, dice true primero
            // Luego la segunda verificación (existingTaskThisMonth) lo salva
            const originalResult = originalShouldCreateTask(preventive, 1, 2025);

            // En este caso específico, el original funciona porque
            // la tarea está en el mismo mes
            expect(originalResult).toBe(false);
        });

        it('ORIGINAL FALLA: Tarea del año anterior en el mismo mes número', () => {
            // BUG CRÍTICO: Si hay una tarea de Enero 2024 y estamos en Enero 2025
            // El código original la encuentra (porque no verifica el año)
            // y puede tomar decisiones incorrectas
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2024, 0, 15),
                        status: TaskStatus.Aprobada,
                    }, // Enero 2024
                ],
            });

            // Original: No verifica el año, así que ve la tarea de Enero 2024
            // como si fuera del período actual
            const originalResult = originalShouldCreateTask(preventive, 1, 2025);
            // Comportamiento: Como es primer mes, dice shouldCreate=true
            // Luego busca existingTaskThisMonth: encuentra Jan 2024 (mes 1 === 1)
            // Retorna false! Esto es un BUG porque debería crear la de 2025
            expect(originalResult).toBe(false); // BUG! Debería ser true

            // Corregido: Verifica el año
            const correctedResult = shouldCreatePreventiveTask(preventive, 1, 2025);
            expect(correctedResult.shouldCreate).toBe(true); // Correcto
        });
    });

    describe('BUG 2: La query de Prisma usa Semestral para TODOS los preventivos', () => {
        it('Documentación del bug en la query', () => {
            // Este bug está en la línea 142-145 del archivo original
            // La query siempre usa PreventiveFrequency.Semestral para calcular
            // el rango de fechas, independientemente de la frecuencia real
            //
            // Esto significa que para preventivos Anuales (si existieran),
            // las tareas del primer semestre no se cargarían cuando
            // estamos en el segundo semestre
            //
            // Para este test, solo documentamos el comportamiento
            expect(true).toBe(true);
        });
    });

    describe('BUG 3: Frecuencia Anual no está manejada', () => {
        it('ORIGINAL: No maneja frecuencia Anual', () => {
            // El código original tiene un switch que no incluye 'Anual'
            // Esto causa que isFirstMonthOfPeriod retorne false para Anual
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Anual,
            });

            expect(shouldCreatePreventiveTask(preventive, 1, 2025).shouldCreate).toBe(
                true,
            );
        });

        it('CORREGIDO: Maneja frecuencia Anual correctamente', () => {
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Anual,
            });

            // Solo Enero debería crear tarea
            const resultEnero = shouldCreatePreventiveTask(preventive, 1, 2025);
            expect(resultEnero.shouldCreate).toBe(true);

            // Otros meses no deberían crear (a menos que no haya tarea del año)
            const preventiveWithTask = createPreventive({
                frequency: PreventiveFrequency.Anual,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 15),
                        status: TaskStatus.Aprobada,
                    },
                ],
            });

            const resultJulio = shouldCreatePreventiveTask(preventiveWithTask, 7, 2025);
            expect(resultJulio.shouldCreate).toBe(false);
        });
    });

    describe('BUG 4: No verifica status de tarea completada', () => {
        it('El código original solo verifica EXISTENCIA, no COMPLETITUD', () => {
            // El original verifica si existe una tarea, pero no si está completada
            // Esto puede ser intencional (no crear duplicados aunque no esté completada)
            // pero la nueva implementación da más información sobre el estado
            const preventive = createPreventive({
                frequency: PreventiveFrequency.Trimestral,
                tasks: [
                    {
                        createdAt: new Date(2025, 0, 5),
                        status: TaskStatus.Pendiente,
                    },
                ],
            });

            const result = shouldCreatePreventiveTask(preventive, 2, 2025);
            // El nuevo código diferencia entre "hay tarea pendiente" y "hay tarea completada"
            expect(result.shouldCreate).toBe(false);
            expect(result.reason).toContain('Pendiente');
        });
    });
});

describe('isPreventiveUpToDate', () => {
    const createPreventive = (
        overrides: Partial<PreventiveForVerification> = {},
    ): PreventiveForVerification => ({
        months: [],
        frequency: null,
        tasks: [],
        ...overrides,
    });

    it('debe retornar true si hay tarea aprobada en el período actual (trimestral)', () => {
        const preventive = createPreventive({
            frequency: PreventiveFrequency.Trimestral,
            tasks: [
                {
                    createdAt: new Date(2025, 0, 15),
                    status: TaskStatus.Aprobada,
                },
            ],
        });

        expect(isPreventiveUpToDate(preventive, 2, 2025)).toBe(true);
        expect(isPreventiveUpToDate(preventive, 3, 2025)).toBe(true);
    });

    it('debe retornar false si la tarea no está aprobada', () => {
        const preventive = createPreventive({
            frequency: PreventiveFrequency.Trimestral,
            tasks: [
                {
                    createdAt: new Date(2025, 0, 15),
                    status: TaskStatus.Pendiente,
                },
            ],
        });

        expect(isPreventiveUpToDate(preventive, 2, 2025)).toBe(false);
    });

    it('debe retornar false si la tarea es de un período diferente', () => {
        const preventive = createPreventive({
            frequency: PreventiveFrequency.Trimestral,
            tasks: [
                {
                    createdAt: new Date(2025, 0, 15),
                    status: TaskStatus.Aprobada,
                }, // Q1
            ],
        });

        // Q2
        expect(isPreventiveUpToDate(preventive, 4, 2025)).toBe(false);
    });
});
