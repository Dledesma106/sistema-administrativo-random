import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { DownloadIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { TaskByIdQuery, TaskStatus } from '@/api/graphql';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ExpensePaySourceBadge from '@/components/ui/Badges/ExpensePaySourceBadge';
import ExpenseTypeBadge from '@/components/ui/Badges/ExpenseTypeBadge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableHeader,
    TableCell,
} from '@/components/ui/table';
import { TypographyH1 } from '@/components/ui/typography';
import { useUserContext } from '@/context/userContext/UserProvider';
import { useGetTaskById } from '@/hooks/api/tasks/useGetTaskById';
import { useUpdateTaskStatus } from '@/hooks/api/tasks/useUpdateTaskStatus';
import { routesBuilder } from '@/lib/routes';
import { pascalCaseToSpaces } from '@/lib/utils';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold">{children}</h2>
);

type Props = {
    task: NonNullable<TaskByIdQuery['taskById']>;
};

const Content: React.FC<Props> = ({ task }) => {
    const { user } = useUserContext();
    const { mutateAsync: updateTaskStatus } = useUpdateTaskStatus();
    const router = useRouter();

    return (
        <main className="py-3.5">
            <div className="flex justify-between">
                <TypographyH1 className="mb-2">Tarea #{task.taskNumber}</TypographyH1>
                {user.roles.includes('AdministrativoTecnico') && (
                    <div>
                        {['Pendiente', 'SinAsignar'].includes(task.status) && (
                            <Button asChild>
                                <Link href={routesBuilder.tasks.edit(task.id)}>
                                    Editar
                                </Link>
                            </Button>
                        )}
                        {task.status === 'Finalizada' && (
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
                    {task.status}
                </div>

                <div>
                    <Title>Tipo de tarea</Title>
                    {pascalCaseToSpaces(task.taskType)}
                </div>

                {task.branch ? (
                    <div>
                        <Title>Sucursal</Title>

                        <p className="mb-1">
                            #{task.branch.number} - {task.branch.client.name} -{' '}
                            {task.business?.name || 'N/A'}
                        </p>
                    </div>
                ) : (
                    <div>
                        <Title>Cliente y Empresa</Title>
                        <p className="mb-1">
                            {task.clientName} - {task.businessName || 'N/A'}
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
                                        className="group relative inline-block overflow-hidden rounded-md border border-gray-200"
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

                                <div className="overflow-hidden rounded-md border border-gray-200">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Monto</TableHead>
                                                <TableHead>Fecha de Registro</TableHead>
                                                <TableHead>Fecha de Pago</TableHead>
                                                <TableHead>Razón</TableHead>
                                                <TableHead>Fuente de pago</TableHead>
                                                <TableHead>Registrado por</TableHead>
                                                <TableHead>Pagado por</TableHead>
                                                <TableHead>Observaciones</TableHead>
                                                <TableHead>Comprobante</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {task.expenses.map((expense) => (
                                                <TableRow
                                                    key={expense.id}
                                                    onClick={() =>
                                                        router.push(
                                                            routesBuilder.expenses.details(
                                                                expense.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    <TableCell>
                                                        $
                                                        {expense.amount.toLocaleString(
                                                            'es-AR',
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(
                                                            expense.createdAt,
                                                            'dd/MM/yyyy',
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(
                                                            expense.expenseDate,
                                                            'dd/MM/yyyy',
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <ExpenseTypeBadge
                                                            type={expense.expenseType}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <ExpensePaySourceBadge
                                                            paySource={expense.paySource}
                                                            installments={
                                                                expense.installments
                                                            }
                                                            paySourceBank={
                                                                expense.paySourceBank
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {expense.registeredBy.fullName ||
                                                            '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {expense.doneBy || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {expense.observations || '-'}
                                                    </TableCell>
                                                    <TableCell className="w-32">
                                                        <a
                                                            className="group relative inline-block overflow-hidden rounded-md border border-gray-200"
                                                            download={expense.image.id}
                                                            href={expense.image.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <Image
                                                                src={expense.image.url}
                                                                width={640}
                                                                height={1252}
                                                                alt=""
                                                                className="z-0 w-20"
                                                            />

                                                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 transition-colors duration-200 group-hover:bg-white/90">
                                                                <DownloadIcon />
                                                            </div>
                                                        </a>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
};

export const TaskDetail = ({ id }: { id: string }) => {
    const result = useGetTaskById(id);

    if (result.isPending) {
        return <p>Loading...</p>;
    }

    if (result.isError) {
        return <p>Error</p>;
    }

    if (!result.data.taskById) {
        return <p>Not found</p>;
    }

    return <Content task={result.data.taskById} />;
};
