import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { DownloadIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import {
    ExpensePaySourceBank,
    ExpensePaySource,
    ExpenseType,
    GetTaskQuery,
    TaskStatus,
} from '@/api/graphql';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ExpensePaySourceBadge from '@/components/ui/Badges/ExpensePaySourceBadge';
import ExpenseTypeBadge from '@/components/ui/Badges/ExpenseTypeBadge';
import { TaskStatusBadge } from '@/components/ui/Badges/TaskStatusBadge';
import { TaskTypeBadge } from '@/components/ui/Badges/TaskTypeBadge';
import { Button } from '@/components/ui/button';
import { DataList, Column } from '@/components/ui/data-list';
import { PDFViewer } from '@/components/ui/PDFViewer';
import { FormSkeleton } from '@/components/ui/skeleton';
import { TypographyH1 } from '@/components/ui/typography';
import { useUserContext } from '@/context/userContext/UserProvider';
import { useGetTask } from '@/hooks/api/tasks/useGetTask';
import { useUpdateTaskStatus } from '@/hooks/api/tasks/useUpdateTaskStatus';
import { routesBuilder } from '@/lib/routes';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold">{children}</h2>
);

type Props = {
    task: NonNullable<GetTaskQuery['taskById']>;
};

type Expense = {
    id: string;
    amount: number;
    createdAt: string;
    expenseDate: string;
    expenseType: ExpenseType;
    paySource: ExpensePaySource;
    installments: number | null;
    paySourceBank: ExpensePaySourceBank | null;
    registeredBy: { fullName: string };
    doneBy?: string;
    observations: string | null;
    image: { id: string; url: string } | null;
    file: { url: string; filename: string; mimeType: string } | null;
};

const expenseColumns: Column<Expense>[] = [
    {
        header: 'Monto',
        cell: (expense) => `$${expense.amount.toLocaleString('es-AR')}`,
        accessorKey: 'amount',
    },
    {
        header: 'Fecha de Registro',
        cell: (expense) => format(expense.createdAt, 'dd/MM/yyyy'),
        accessorKey: 'createdAt',
    },
    {
        header: 'Fecha de Pago',
        cell: (expense) => format(expense.expenseDate, 'dd/MM/yyyy'),
        accessorKey: 'expenseDate',
    },
    {
        header: 'Razón',
        cell: (expense) => <ExpenseTypeBadge type={expense.expenseType} />,
        accessorKey: 'expenseType',
    },
    {
        header: 'Fuente de pago',
        cell: (expense) => (
            <ExpensePaySourceBadge
                paySource={expense.paySource}
                installments={expense.installments}
                paySourceBank={expense.paySourceBank}
            />
        ),
        accessorKey: 'paySource',
    },
    {
        header: 'Registrado por',
        cell: (expense) => expense.registeredBy.fullName || '-',
        accessorKey: 'registeredBy',
    },
    {
        header: 'Pagado por',
        cell: (expense) => expense.doneBy || '-',
        accessorKey: 'doneBy',
    },
    {
        header: 'Observaciones',
        cell: (expense) => expense.observations || '-',
        accessorKey: 'observations',
    },
    {
        header: 'Comprobante',
        cell: (expense) => (
            <div className="w-32">
                {expense.image && (
                    <a
                        className="group relative inline-block overflow-hidden rounded-md border border-border"
                        download={expense.image.id}
                        href={expense.image.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={expense.image.url}
                            width={640}
                            height={1252}
                            alt=""
                            className="z-0 w-20"
                        />
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 transition-colors duration-200 group-hover:bg-white/50 dark:group-hover:bg-black/30">
                            <DownloadIcon />
                        </div>
                    </a>
                )}
                {expense.file?.mimeType.startsWith('application/pdf') && (
                    <PDFViewer
                        url={expense.file.url}
                        filename={expense.file.filename}
                        showPreviewButton={true}
                    />
                )}
            </div>
        ),
        accessorKey: (expense: Expense) => expense.file?.url || expense.image?.url || '',
    },
];

const Content: React.FC<Props> = ({ task }) => {
    const { user } = useUserContext();
    const { mutateAsync: updateTaskStatus } = useUpdateTaskStatus();
    const router = useRouter();

    return (
        <main className="py-3.5">
            <div className="flex justify-between">
                <TypographyH1 className="mb-2">Tarea #{task.taskNumber}</TypographyH1>
                {user.roles.includes('AdministrativoTecnico') && (
                    <div className="flex gap-2">
                        {task.status !== TaskStatus.Aprobada && (
                            <Button asChild>
                                <Link href={routesBuilder.tasks.edit(task.id)}>
                                    Editar
                                </Link>
                            </Button>
                        )}
                        {task.status === TaskStatus.Finalizada && (
                            <Button
                                onClick={() =>
                                    updateTaskStatus({
                                        id: task.id,
                                        status: TaskStatus.Aprobada,
                                    })
                                }
                            >
                                Aprobar Tarea
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <p className="text-muted-foreground">{task.description}</p>

            <div className="space-y-4 pt-4">
                <div>
                    <Title>Fecha de creación</Title>
                    {format(task.createdAt, 'dd/MM/yyyy')}
                </div>

                <div>
                    <Title>Fecha de inicio</Title>
                    {task.startedAt ? format(task.startedAt, 'dd/MM/yyyy HH:mm') : 'N/A'}
                </div>

                <div>
                    <Title>Fecha de cierre</Title>
                    {task.closedAt ? format(task.closedAt, 'dd/MM/yyyy HH:mm') : 'N/A'}
                </div>

                <div>
                    <Title>Estado</Title>
                    <TaskStatusBadge status={task.status} />
                </div>

                <div>
                    <Title>Tipo de tarea</Title>
                    <TaskTypeBadge type={task.taskType} />
                </div>

                {task.branch ? (
                    <div>
                        <Title>Sucursal</Title>

                        <p className="mb-1">
                            #{task.branch.number} - {task.branch.client.name} -{' '}
                            {task.branch.city.name} - {task.business?.name || ''}
                        </p>
                    </div>
                ) : (
                    <div>
                        <Title>Cliente y Empresa</Title>
                        <p className="mb-1">
                            {task.clientName}
                            {task.businessName && ` - ${task.businessName}`}
                        </p>
                    </div>
                )}

                {task.business?.name === 'GIASA' && (
                    <div>
                        <Title>Número de Ticket Movitec</Title>
                        <p className="mb-1">{task.movitecTicket}</p>
                    </div>
                )}

                <section>
                    <h2 className="mb-4 text-sm font-bold">Técnicos asignados</h2>
                    <ul className="space-y-4">
                        {task.assigned.map((assigned) => (
                            <div
                                className="flex items-center space-x-4"
                                key={assigned.id}
                            >
                                <Avatar>
                                    <AvatarFallback>
                                        {assigned.firstName[0].toUpperCase() +
                                            assigned.lastName[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <p className="text-sm font-medium">
                                        {assigned.fullName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {assigned.email}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </ul>
                </section>

                <div>
                    <Title>Numero de OT</Title>
                    <p className="mb-1">{task.actNumber}</p>
                </div>

                <div>
                    <Title>Observaciones</Title>
                    <p className="mb-1">{task.observations}</p>
                </div>

                <section>
                    <Title>Imágenes</Title>

                    {task.images.length === 0 ? (
                        <p className="text-muted-foreground">No hay imágenes</p>
                    ) : (
                        <div className="grid grid-cols-6 gap-4">
                            {task.images.map((image) => (
                                <div key={image.id}>
                                    <a
                                        className="group relative inline-block overflow-hidden rounded-md border border-border"
                                        download={image.id}
                                        href={image.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Image
                                            src={image.url}
                                            width={640}
                                            height={1252}
                                            alt=""
                                            className="z-0"
                                        />

                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 transition-colors duration-200 group-hover:bg-white/90">
                                            <DownloadIcon />
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                {user.roles.includes('AdministrativoContable') && (
                    <section>
                        {task.expenses.length === 0 ? (
                            <>
                                <Title>Gastos</Title>
                                <p className="text-muted-foreground">No hay gastos</p>
                            </>
                        ) : (
                            <>
                                <Title>
                                    Gastos: $
                                    {task.expenses
                                        .reduce((acc, curr) => acc + curr.amount, 0)
                                        .toLocaleString('es-AR')}
                                </Title>
                                <DataList
                                    data={task.expenses}
                                    columns={expenseColumns}
                                    onRowClick={(expense) =>
                                        router.push(
                                            routesBuilder.accounting.expenses.details(
                                                expense.id,
                                            ),
                                        )
                                    }
                                    emptyMessage="No hay gastos"
                                />
                            </>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
};

export const TaskDetail = ({ id }: { id: string }) => {
    const result = useGetTask(id);

    if (result.isPending) {
        return <FormSkeleton />;
    }

    if (result.isError) {
        return <p>Error</p>;
    }

    if (!result.data.taskById) {
        return <p>Not found</p>;
    }

    return <Content task={result.data.taskById} />;
};
