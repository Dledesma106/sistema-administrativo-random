import { prisma } from 'lib/prisma';

/**
 * Genera un nuevo número de tarea
 * Si está asociada a una orden de servicio: "serviceOrderNumber-taskSequence"
 * Si no: número secuencial simple
 * @param serviceOrderId ID de la orden de servicio (opcional)
 * @returns Número de tarea generado
 */
export async function generateTaskNumber(
    serviceOrderId?: string | null,
): Promise<string> {
    if (serviceOrderId) {
        // Obtener la orden de servicio para su número
        const serviceOrder = await prisma.serviceOrder.findUnique({
            where: { id: serviceOrderId },
            select: { serviceOrderNumber: true },
        });

        if (!serviceOrder) {
            throw new Error('Orden de servicio no encontrada');
        }

        // Contar cuántas tareas tiene esta orden de servicio
        const taskCount = await prisma.task.count({
            where: { serviceOrderId },
        });

        // Formato: "serviceOrderNumber-taskSequence"
        return `${serviceOrder.serviceOrderNumber}-${taskCount + 1}`;
    } else {
        // Para tareas sin orden de servicio, usar número secuencial simple
        // Estrategia: traer todas las tareas sin serviceOrder y filtrar en JavaScript
        // Esto es más seguro que usar regex con tipos mixtos
        const tasksWithoutServiceOrder = await prisma.task.findMany({
            where: {
                serviceOrderId: null,
                deleted: false,
            },
            select: { taskNumber: true },
            // No ordenamos aquí porque el orden alfabético de strings no funciona para números
        });

        // Si no hay tareas, empezar desde 1000
        if (tasksWithoutServiceOrder.length === 0) {
            return '1000';
        }

        // Encontrar el número máximo entre tareas con números puros (sin guiones)
        let maxNumber = 999;

        for (const task of tasksWithoutServiceOrder) {
            // Asegurar que es string
            const taskNumberStr = String(task.taskNumber);

            // Solo considerar números puros (sin guiones)
            if (!taskNumberStr.includes('-')) {
                const currentNumber = parseInt(taskNumberStr, 10);
                if (!isNaN(currentNumber) && currentNumber > maxNumber) {
                    maxNumber = currentNumber;
                }
            }
        }

        return String(maxNumber + 1);
    }
}

