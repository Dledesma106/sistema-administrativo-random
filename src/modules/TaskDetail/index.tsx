import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { DownloadIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { BsPlus } from 'react-icons/bs';

import { expenseColumns } from './columns';

import { GetTaskQuery, TaskStatus, TaskType } from '@/api/graphql';
import { Badge } from '@/components/ui/Badges/badge';
import { TaskStatusBadge } from '@/components/ui/Badges/TaskStatusBadge';
import { TaskTypeBadge } from '@/components/ui/Badges/TaskTypeBadge';
import { Button } from '@/components/ui/button';
import { DataList } from '@/components/ui/data-list';
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

const Content: React.FC<Props> = ({ task }) => {
    const { user } = useUserContext();
    const { mutateAsync: updateTaskStatus } = useUpdateTaskStatus();
    const router = useRouter();

    const link =
        task.taskType === TaskType.Preventivo
            ? routesBuilder.preventives.details(task.preventive?.id ?? '')
            : undefined;

    return (
        <main className="rounded-lg border border-accent bg-background-primary p-4">
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
                    <TaskTypeBadge
                        type={task.taskType}
                        link={link}
                        frequency={task.preventive?.frequency ?? undefined}
                    />
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
                    <h2 className="mb-4 text-sm font-bold">Participantes</h2>
                    {task.participants && task.participants.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {task.participants.map((participant, index) => (
                                <Badge
                                    key={`${participant}-${index}`}
                                    variant="default"
                                    className="whitespace-nowrap"
                                >
                                    {participant}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No hay participantes</p>
                    )}
                </section>

                <div>
                    <Title>Numero de OT</Title>
                    <p className="mb-1">{task.actNumber}</p>
                </div>

                {task.status === TaskStatus.Finalizada && (
                    <div>
                        <Title>Se usaron materiales?</Title>
                        <p className="mb-1">{task.useMaterials ? 'Si' : 'No'}</p>
                    </div>
                )}

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
                                        className="group relative inline-block overflow-hidden rounded-md border border-accent"
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

                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/30 transition-colors duration-200 group-hover:bg-background/90">
                                            <DownloadIcon />
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                <section className="flex flex-col gap-2">
                    <div className="flex flex-col items-start justify-between">
                        <Title>
                            {task.expenses.length === 0
                                ? 'Gastos'
                                : `Gastos: $${task.expenses
                                      .reduce((acc, curr) => acc + curr.amount, 0)
                                      .toLocaleString('es-AR')}`}
                        </Title>
                        {(user.roles.includes('AdministrativoContable') ||
                            user.roles.includes('AdministrativoTecnico')) && (
                            <Button
                                className="flex items-center gap-1"
                                onClick={() =>
                                    router.push(`/tasks/${task.id}/expenses/create`)
                                }
                            >
                                <BsPlus size="20" />
                                <span>Crear nuevo gasto</span>
                            </Button>
                        )}
                    </div>

                    {task.expenses.length === 0 ? (
                        <p className="text-muted-foreground">No hay gastos</p>
                    ) : (
                        <DataList
                            data={task.expenses}
                            columns={expenseColumns}
                            onRowClick={(expense) =>
                                router.push(
                                    routesBuilder.accounting.expenses.details(expense.id),
                                )
                            }
                            emptyMessage="No hay gastos"
                        />
                    )}
                </section>
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
