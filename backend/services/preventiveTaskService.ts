import { PreventiveFrequency, TaskStatus } from '@prisma/client';

// Helper para convertir nombres de meses a números
export const monthNameToNumber: { [key: string]: string } = {
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

/**
 * Determina si el mes dado es el primer mes de un período según la frecuencia.
 * Ejemplo: Para Trimestral, los primeros meses son Enero(1), Abril(4), Julio(7), Octubre(10)
 */
export function isFirstMonthOfPeriod(
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
        case PreventiveFrequency.Anual:
            return currentMonth === 1; // Solo Enero
        default:
            return false;
    }
}

/**
 * Obtiene el primer mes del período actual según la frecuencia.
 * Ejemplo: Si estamos en Mayo(5) con frecuencia Trimestral, retorna Abril(4)
 */
export function getFirstMonthOfCurrentPeriod(
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
        case PreventiveFrequency.Anual:
            return 1; // Siempre Enero
        default:
            return currentMonth;
    }
}

/**
 * Obtiene el último mes del período actual según la frecuencia.
 * Ejemplo: Si estamos en Mayo(5) con frecuencia Trimestral, retorna Junio(6)
 */
export function getLastMonthOfCurrentPeriod(
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
        case PreventiveFrequency.Anual:
            return 12; // Diciembre
        default:
            return currentMonth;
    }
}

/**
 * Representa una tarea mínima para la verificación de preventivos
 */
export interface TaskForVerification {
    createdAt: Date;
    status: TaskStatus;
}

/**
 * Representa un preventivo mínimo para la verificación
 */
export interface PreventiveForVerification {
    months: string[];
    frequency: PreventiveFrequency | null;
    tasks: TaskForVerification[];
}

export interface ShouldCreateTaskResult {
    shouldCreate: boolean;
    reason: string;
    existingTaskInMonth?: TaskForVerification;
    existingCompletedTaskInPeriod?: TaskForVerification;
}

/**
 * Determina si se debe crear una nueva tarea preventiva.
 *
 * @param preventive - El preventivo a evaluar
 * @param currentMonth - El mes actual (1-12)
 * @param currentYear - El año actual
 * @returns Un objeto indicando si se debe crear la tarea y por qué
 */
export function shouldCreatePreventiveTask(
    preventive: PreventiveForVerification,
    currentMonth: number,
    currentYear: number,
): ShouldCreateTaskResult {
    // Caso 1: El preventivo tiene meses específicos configurados
    if (preventive.months.length > 0) {
        const isScheduledMonth = preventive.months.some(
            (month) => monthNameToNumber[month] === currentMonth.toString(),
        );

        if (!isScheduledMonth) {
            return {
                shouldCreate: false,
                reason: `Mes ${currentMonth} no está en los meses programados: ${preventive.months.join(', ')}`,
            };
        }

        // Verificar si ya existe una tarea en este mes
        const existingTaskThisMonth = preventive.tasks.find((task) => {
            const taskDate = new Date(task.createdAt);
            const taskMonth = taskDate.getMonth() + 1;
            const taskYear = taskDate.getFullYear();
            return taskMonth === currentMonth && taskYear === currentYear;
        });

        if (existingTaskThisMonth) {
            return {
                shouldCreate: false,
                reason: `Ya existe una tarea creada en el mes ${currentMonth}/${currentYear}`,
                existingTaskInMonth: existingTaskThisMonth,
            };
        }

        return {
            shouldCreate: true,
            reason: `Mes ${currentMonth} está programado y no hay tarea existente`,
        };
    }

    // Caso 2: El preventivo tiene frecuencia configurada
    if (preventive.frequency) {
        const firstMonthOfPeriod = getFirstMonthOfCurrentPeriod(
            currentMonth,
            preventive.frequency,
        );
        const lastMonthOfPeriod = getLastMonthOfCurrentPeriod(
            currentMonth,
            preventive.frequency,
        );

        // Buscar si hay una tarea COMPLETADA en el período actual
        const completedTaskInPeriod = preventive.tasks.find((task) => {
            const taskDate = new Date(task.createdAt);
            const taskMonth = taskDate.getMonth() + 1;
            const taskYear = taskDate.getFullYear();

            // Verificar que la tarea esté en el período actual y año actual
            const isInCurrentPeriod =
                taskYear === currentYear &&
                taskMonth >= firstMonthOfPeriod &&
                taskMonth <= lastMonthOfPeriod;

            // Verificar que la tarea esté completada (Finalizada o Aprobada)
            const isCompleted =
                task.status === TaskStatus.Finalizada ||
                task.status === TaskStatus.Aprobada;

            return isInCurrentPeriod && isCompleted;
        });

        if (completedTaskInPeriod) {
            return {
                shouldCreate: false,
                reason: `Ya existe una tarea completada en el período ${firstMonthOfPeriod}-${lastMonthOfPeriod}/${currentYear}`,
                existingCompletedTaskInPeriod: completedTaskInPeriod,
            };
        }

        // Buscar si hay cualquier tarea (incluso pendiente) en el período actual
        const anyTaskInPeriod = preventive.tasks.find((task) => {
            const taskDate = new Date(task.createdAt);
            const taskMonth = taskDate.getMonth() + 1;
            const taskYear = taskDate.getFullYear();

            return (
                taskYear === currentYear &&
                taskMonth >= firstMonthOfPeriod &&
                taskMonth <= lastMonthOfPeriod
            );
        });

        if (anyTaskInPeriod) {
            return {
                shouldCreate: false,
                reason: `Ya existe una tarea (${anyTaskInPeriod.status}) en el período ${firstMonthOfPeriod}-${lastMonthOfPeriod}/${currentYear}`,
                existingTaskInMonth: anyTaskInPeriod,
            };
        }

        return {
            shouldCreate: true,
            reason: `No hay tareas en el período ${firstMonthOfPeriod}-${lastMonthOfPeriod}/${currentYear}`,
        };
    }

    return {
        shouldCreate: false,
        reason: 'El preventivo no tiene meses ni frecuencia configurada',
    };
}

/**
 * Verifica si un preventivo está al día (tiene tarea completada en el período actual)
 */
export function isPreventiveUpToDate(
    preventive: PreventiveForVerification,
    currentMonth: number,
    currentYear: number,
): boolean {
    if (preventive.months.length > 0) {
        // Para preventivos por mes, verificar si hay tarea aprobada en el mes actual
        return preventive.tasks.some((task) => {
            const taskDate = new Date(task.createdAt);
            const taskMonth = taskDate.getMonth() + 1;
            const taskYear = taskDate.getFullYear();
            return (
                taskMonth === currentMonth &&
                taskYear === currentYear &&
                task.status === TaskStatus.Aprobada
            );
        });
    }

    if (preventive.frequency) {
        const firstMonthOfPeriod = getFirstMonthOfCurrentPeriod(
            currentMonth,
            preventive.frequency,
        );
        const lastMonthOfPeriod = getLastMonthOfCurrentPeriod(
            currentMonth,
            preventive.frequency,
        );

        // Verificar si hay tarea completada en el período
        return preventive.tasks.some((task) => {
            const taskDate = new Date(task.createdAt);
            const taskMonth = taskDate.getMonth() + 1;
            const taskYear = taskDate.getFullYear();
            return (
                taskYear === currentYear &&
                taskMonth >= firstMonthOfPeriod &&
                taskMonth <= lastMonthOfPeriod &&
                task.status === TaskStatus.Aprobada
            );
        });
    }

    return false;
}
