import { Role, TaskStatus, TaskType } from '@prisma/client';

export type Frequency = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Month =
    | 'Enero'
    | 'Febrero'
    | 'Marzo'
    | 'Abril'
    | 'Mayo'
    | 'Junio'
    | 'Julio'
    | 'Agosto'
    | 'Septiembre'
    | 'Octubre'
    | 'Noviembre'
    | 'Diciembre';

export enum ExpenseStatus {
    Enviado = 'Enviado',
    Aprobado = 'Aprobado',
}

export type ExpenseType =
    | 'Comida'
    | 'Combustible'
    | 'Hospedaje'
    | 'Insumos'
    | 'Herramienta';

export type PaySource = 'Reintegro' | 'Tarjeta';

export type PreventiveStatus = 'Pendiente' | 'Al dia';

export const months: Month[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

export const frequencies: Frequency[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const expenseTypes: ExpenseType[] = [
    'Combustible',
    'Comida',
    'Herramienta',
    'Hospedaje',
    'Insumos',
];

export const paySources: PaySource[] = ['Reintegro', 'Tarjeta'];

export const taskStatusesOptions: { value: TaskStatus; label: string }[] = [
    {
        value: TaskStatus.SinAsignar,
        label: 'Sin asignar',
    },
    {
        value: TaskStatus.Pendiente,
        label: 'Pendiente',
    },
    {
        value: TaskStatus.Finalizada,
        label: 'Finalizada',
    },
    {
        value: TaskStatus.Aprobada,
        label: 'Aprobada',
    },
];

export const taskTypesOptions: { value: TaskType; label: string }[] = [
    {
        value: TaskType.Preventivo,
        label: 'Preventivo',
    },
    {
        value: TaskType.Correctivo,
        label: 'Correctivo',
    },
    {
        value: TaskType.Instalacion,
        label: 'Instalacion',
    },
    {
        value: TaskType.Desmonte,
        label: 'Desmonte',
    },
    {
        value: TaskType.Actualizacion,
        label: 'Actualizacion',
    },
];

export const rolesOptions: { value: Role; label: string }[] = [
    {
        value: Role.AdministrativoTecnico,
        label: 'Administrador Tecnico',
    },
    {
        value: Role.AdministrativoContable,
        label: 'Administrador Contable',
    },
    {
        value: Role.Auditor,
        label: 'Auditor',
    },
    {
        value: Role.Tecnico,
        label: 'Tecnico',
    },
];

export const preventiveStatuses: PreventiveStatus[] = ['Pendiente', 'Al dia'];
