import Image from 'next/image';
import Link from 'next/link';

import { ExpenseStatus } from '@prisma/client';
import { DownloadIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';

import { useUpdateTaskExpenseStatusMutation } from './mutation';
import { useTaskByIdQuery } from './query';

import { TaskByIdQuery } from '@/api/graphql';
import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { routesBuilder } from '@/lib/routes';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold">{children}</h2>
);

type Props = {
    task: NonNullable<TaskByIdQuery['taskById']>;
};

const Content: React.FC<Props> = ({ task }) => {
    const updateExpenseStatusMutation = useUpdateTaskExpenseStatusMutation();

    return (
        <main className="py-3.5">
            <div className="flex justify-between">
                <TypographyH1 className="mb-2">Task #{task.id}</TypographyH1>
                <Button asChild>
                    <Link href={routesBuilder.tasks.edit(task.id)}>Editar</Link>
                </Button>
            </div>
            <p className="text-muted-foreground">{task.description}</p>

            <div className="space-y-4 pt-4">
                <div>
                    <Title>Fecha de creación</Title>
                    {dayjs(task.createdAt).format('DD/MM/YYYY')}
                </div>

                <div>
                    <Title>Fecha de cierre</Title>
                    {task.closedAt ? dayjs(task.closedAt).format('DD/MM/YYYY') : 'N/A'}
                </div>

                <div>
                    <Title>Estado</Title>
                    {task.status}
                </div>

                <div>
                    <Title>Tipo de tarea</Title>
                    {task.taskType}
                </div>

                <div>
                    <Title>Sucursal</Title>

                    <p className="mb-1">
                        #{task.branch.number} - {task.branch.client.name} -{' '}
                        {task.business.name}
                    </p>
                </div>

                {task.business.name === 'GIASA' && (
                    <div>
                        <Title>Número de Ticket GIASA</Title>
                        <p className="mb-1">{task.metadata.giasaTicketNumber}</p>
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

                {task.expenses.length === 0 ? (
                    <section>
                        <Title>Gastos</Title>
                        <p className="text-muted-foreground">No hay gastos</p>
                    </section>
                ) : (
                    <section>
                        <Title>
                            Gastos: $
                            {task.expenses.reduce((acc, curr) => acc + curr.amount, 0)}
                        </Title>

                        <div className="overflow-hidden rounded-md border border-gray-200">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Monto</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Realizado por</TableHead>
                                        <TableHead>Comprobante</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {task.expenses.map((expense) => (
                                        <TableRow key={expense.id}>
                                            <TableCell>
                                                {dayjs(expense.createdAt).format(
                                                    'DD/MM/YYYY',
                                                )}
                                            </TableCell>
                                            <TableCell>${expense.amount}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="space-x-2"
                                                >
                                                    {expense.status ===
                                                        ExpenseStatus.Rechazado && (
                                                        <>
                                                            <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                                            <span>{expense.status}</span>
                                                        </>
                                                    )}

                                                    {expense.status ===
                                                        ExpenseStatus.Aprobado && (
                                                        <>
                                                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                                            <span>{expense.status}</span>
                                                        </>
                                                    )}

                                                    {expense.status ===
                                                        ExpenseStatus.Enviado && (
                                                        <>
                                                            <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                                                            <span>{expense.status}</span>
                                                        </>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {expense.doneBy?.fullName || '-'}
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
                                            <TableCell className="w-32 space-y-4">
                                                {(expense.status ===
                                                    ExpenseStatus.Enviado ||
                                                    expense.status ===
                                                        ExpenseStatus.Aprobado) && (
                                                    <ButtonWithSpinner
                                                        className="w-full"
                                                        disabled={
                                                            updateExpenseStatusMutation.isPending
                                                        }
                                                        showSpinner={
                                                            updateExpenseStatusMutation.isPending &&
                                                            updateExpenseStatusMutation
                                                                .variables.expenseId ===
                                                                expense.id &&
                                                            updateExpenseStatusMutation
                                                                .variables.status ===
                                                                ExpenseStatus.Rechazado
                                                        }
                                                        variant="destructive"
                                                        onClick={() => {
                                                            updateExpenseStatusMutation.mutate(
                                                                {
                                                                    expenseId: expense.id,
                                                                    status: ExpenseStatus.Rechazado,
                                                                },
                                                                {
                                                                    onSuccess: () => {
                                                                        updateExpenseStatusMutation.reset();
                                                                    },
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        Rechazar
                                                    </ButtonWithSpinner>
                                                )}

                                                {(expense.status ===
                                                    ExpenseStatus.Rechazado ||
                                                    expense.status ===
                                                        ExpenseStatus.Enviado) && (
                                                    <ButtonWithSpinner
                                                        className="w-full"
                                                        disabled={
                                                            updateExpenseStatusMutation.isPending
                                                        }
                                                        showSpinner={
                                                            updateExpenseStatusMutation.isPending &&
                                                            updateExpenseStatusMutation
                                                                .variables.expenseId ===
                                                                expense.id &&
                                                            updateExpenseStatusMutation
                                                                .variables.status ===
                                                                ExpenseStatus.Aprobado
                                                        }
                                                        onClick={() => {
                                                            updateExpenseStatusMutation.mutate(
                                                                {
                                                                    expenseId: expense.id,
                                                                    status: ExpenseStatus.Aprobado,
                                                                },
                                                                {
                                                                    onSuccess: () => {
                                                                        updateExpenseStatusMutation.reset();
                                                                    },
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        Aprobar
                                                    </ButtonWithSpinner>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
};

export const TaskDetail = ({ id }: { id: string }) => {
    const result = useTaskByIdQuery(id);

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
