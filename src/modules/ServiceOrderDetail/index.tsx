import { useRouter } from 'next/router';

import { Role, TaskStatus, TaskType } from '@prisma/client';
import { format } from 'date-fns';
import { BsPlus } from 'react-icons/bs';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    ServiceOrderStatus,
    ServiceOrderStatusBadge,
} from '@/components/ui/Badges/ServiceOrderStatusBadge';
import { TaskStatusBadge } from '@/components/ui/Badges/TaskStatusBadge';
import { TaskTypeBadge } from '@/components/ui/Badges/TaskTypeBadge';
import { Button } from '@/components/ui/button';
import { DataList, Column } from '@/components/ui/data-list';
import { FormSkeleton } from '@/components/ui/skeleton';
import { TypographyH1 } from '@/components/ui/typography';
import { useUserContext } from '@/context/userContext/UserProvider';
import { routesBuilder } from '@/lib/routes';

type Task = {
    id: string;
    taskNumber: number;
    description: string;
    assigned: Array<{
        id: string;
        fullName: string;
    }>;
    taskType: TaskType;
    status: TaskStatus;
    createdAt: string;
    closedAt: string | null;
    expenses: Array<{
        amount: number;
    }>;
};

// Mock data - Reemplazar con datos reales de la API
const mockServiceOrder = {
    id: '1',
    orderNumber: '1',
    business: {
        id: '1',
        name: 'Empresa A',
    },
    client: {
        id: '1',
        name: 'Cliente X',
    },
    branch: {
        id: '1',
        number: '001',
        city: {
            name: 'Buenos Aires',
            province: {
                name: 'Buenos Aires',
            },
        },
    },
    description: 'Instalación de equipos de aire acondicionado',
    status: 'EnProgreso',
    tasks: [
        {
            id: '1',
            taskNumber: 1,
            description: 'Instalación equipo piso 1',
            assigned: [
                {
                    id: '1',
                    fullName: 'Juan Pérez',
                },
                {
                    id: '2',
                    fullName: 'María López',
                },
            ],
            taskType: TaskType.Instalacion,
            status: TaskStatus.Pendiente,
            createdAt: '2024-03-15',
            closedAt: null,
            expenses: [{ amount: 15000 }, { amount: 25000 }],
        },
        {
            id: '2',
            taskNumber: 2,
            description: 'Mantenimiento preventivo equipo piso 2',
            assigned: [
                {
                    id: '3',
                    fullName: 'Carlos Rodríguez',
                },
            ],
            taskType: TaskType.Preventivo,
            status: TaskStatus.Finalizada,
            createdAt: '2024-03-16',
            closedAt: '2024-03-17',
            expenses: [{ amount: 8000 }],
        },
        {
            id: '3',
            taskNumber: 3,
            description: 'Reparación equipo sala de reuniones',
            assigned: [
                {
                    id: '1',
                    fullName: 'Juan Pérez',
                },
                {
                    id: '4',
                    fullName: 'Ana García',
                },
            ],
            taskType: TaskType.Correctivo,
            status: TaskStatus.Pendiente,
            createdAt: '2024-03-18',
            closedAt: null,
            expenses: [],
        },
    ],
};

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold text-primary-foreground">{children}</h2>
);

const Content = ({ serviceOrder = mockServiceOrder }) => {
    const router = useRouter();
    const { user } = useUserContext();
    const isAccountingAdmin = user.roles.includes(Role.AdministrativoContable);

    const taskColumns: Column<Task>[] = [
        {
            header: 'Número',
            accessorKey: 'taskNumber',
        },
        {
            header: 'Descripción',
            accessorKey: 'description',
            cell: (task) => <p className="max-w-[250px] truncate">{task.description}</p>,
        },
        {
            header: 'Técnicos',
            accessorKey: 'assigned',
            cell: (task) => (
                <div className="flex -space-x-2">
                    {task.assigned.map((tech) => (
                        <Avatar key={tech.id} className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                                {tech.fullName[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    ))}
                </div>
            ),
        },
        {
            header: 'Tipo',
            accessorKey: 'taskType',
            cell: (task) => <TaskTypeBadge type={task.taskType} />,
        },
        {
            header: 'Estado',
            accessorKey: 'status',
            cell: (task) => <TaskStatusBadge status={task.status} />,
        },
        {
            header: 'Fecha inicio',
            accessorKey: 'createdAt',
            cell: (task) => format(new Date(task.createdAt), 'dd/MM/yyyy'),
        },
        {
            header: 'Fecha cierre',
            accessorKey: 'closedAt',
            cell: (task) =>
                task.closedAt ? format(new Date(task.closedAt), 'dd/MM/yyyy') : 'N/A',
        },
        ...(isAccountingAdmin
            ? [
                  {
                      header: 'Gastos',
                      accessorKey: 'expenses' as keyof Task,
                      cell: (task: Task) => {
                          const total = task.expenses.reduce(
                              (acc: number, expense: { amount: number }) =>
                                  acc + expense.amount,
                              0,
                          );
                          return total.toLocaleString('es-AR', {
                              style: 'currency',
                              currency: 'ARS',
                          });
                      },
                  },
              ]
            : []),
    ];

    const totalExpenses = serviceOrder.tasks.reduce((acc, task) => {
        return (
            acc + task.expenses.reduce((taskAcc, expense) => taskAcc + expense.amount, 0)
        );
    }, 0);

    return (
        <main className="rounded-lg border border-accent bg-background-primary p-4">
            <div className="flex justify-between">
                <TypographyH1 className="mb-2">
                    Orden de Servicio #{serviceOrder.orderNumber}
                </TypographyH1>
                <Button
                    className="flex items-center gap-1"
                    onClick={() => router.push(routesBuilder.tasks.create())}
                >
                    <BsPlus size="20" />
                    <span>Crear tarea</span>
                </Button>
            </div>

            <div className="space-y-4 pt-4">
                <div>
                    <Title>Estado</Title>
                    <ServiceOrderStatusBadge
                        status={serviceOrder.status as ServiceOrderStatus}
                    />
                </div>

                <div>
                    <Title>Empresa</Title>
                    <p>{serviceOrder.business.name}</p>
                </div>

                <div>
                    <Title>Cliente</Title>
                    <p>{serviceOrder.client.name}</p>
                </div>

                {serviceOrder.branch && (
                    <div>
                        <Title>Sucursal</Title>
                        <p>
                            #{serviceOrder.branch.number} -{' '}
                            {serviceOrder.branch.city.name},{' '}
                            {serviceOrder.branch.city.province.name}
                        </p>
                    </div>
                )}

                <div>
                    <Title>Descripción</Title>
                    <p className="text-muted-foreground">{serviceOrder.description}</p>
                </div>

                {isAccountingAdmin && (
                    <div>
                        <Title>Gasto total</Title>
                        <p>
                            {totalExpenses.toLocaleString('es-AR', {
                                style: 'currency',
                                currency: 'ARS',
                            })}
                        </p>
                    </div>
                )}

                <section>
                    <Title>Tareas</Title>
                    <DataList
                        data={serviceOrder.tasks}
                        columns={taskColumns}
                        onRowClick={(task) =>
                            router.push(routesBuilder.tasks.details(task.id))
                        }
                        emptyMessage="No hay tareas"
                    />
                </section>
            </div>
        </main>
    );
};

export const ServiceOrderDetail = () => {
    // TODO: Implementar hook useGetServiceOrder
    const result = {
        isPending: false,
        isError: false,
        data: { serviceOrder: mockServiceOrder },
    };

    if (result.isPending) {
        return <FormSkeleton />;
    }

    if (result.isError) {
        return <p>Error</p>;
    }

    if (!result.data.serviceOrder) {
        return <p>Not found</p>;
    }

    return <Content serviceOrder={result.data.serviceOrder} />;
};
