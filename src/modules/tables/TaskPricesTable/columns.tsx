import { TaskType } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';

export type TaskPrice = {
    id: string;
    businessName: string;
    taskType: TaskType;
    price: number;
};

const columnHelper = createColumnHelper<TaskPrice>();

const taskTypeLabels: Record<TaskType, string> = {
    Preventivo: 'Preventivo',
    Correctivo: 'Correctivo',
    Instalacion: 'Instalación',
    Desmonte: 'Desmonte',
    Actualizacion: 'Actualización',
    InspeccionPolicial: 'Inspección Policial',
};

export const useTaskPricesTableColumns = () => [
    columnHelper.accessor('businessName', {
        header: 'Empresa',
    }),
    columnHelper.accessor('taskType', {
        header: 'Tipo de tarea',
        cell: (info) => taskTypeLabels[info.getValue()],
    }),
    columnHelper.accessor('price', {
        header: 'Precio',
        cell: (info) => {
            const price = info.getValue();
            return price.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
            });
        },
    }),
];
