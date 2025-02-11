import { useRouter } from 'next/router';

import { format } from 'date-fns';

import { GetPreventiveQuery } from '@/api/graphql';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PreventiveStatusBadge } from '@/components/ui/Badges/PreventiveStatusBadge';
import { TaskStatusBadge } from '@/components/ui/Badges/TaskStatusBadge';
import { FormSkeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
} from '@/components/ui/table';
import { TypographyH1 } from '@/components/ui/typography';
import { useGetPreventive } from '@/hooks/api/preventive/useGetPreventive';
import { routesBuilder } from '@/lib/routes';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold">{children}</h2>
);

type Props = {
    preventive: NonNullable<GetPreventiveQuery['preventive']>;
};

const Content: React.FC<Props> = ({ preventive }) => {
    const router = useRouter();

    return (
        <main className="py-3.5">
            <TypographyH1 className="mb-2">Preventivo #{preventive.id}</TypographyH1>

            <div className="space-y-4 pt-4">
                <div>
                    <Title>Cliente</Title>
                    <p>{preventive.branch.client.name}</p>
                </div>

                <div>
                    <Title>Sucursal</Title>
                    <p>
                        #{preventive.branch.number} - {preventive.branch.city.name}
                    </p>
                </div>

                <div>
                    <Title>Empresa</Title>
                    <p>{preventive.business.name}</p>
                </div>

                <section>
                    <Title>Técnicos asignados</Title>
                    <ul className="space-y-4">
                        {preventive.assigned.map((technician) => (
                            <div
                                className="flex items-center space-x-4"
                                key={technician.id}
                            >
                                <Avatar>
                                    <AvatarFallback>
                                        {technician.fullName[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">
                                        {technician.fullName}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </ul>
                </section>

                {preventive.frequency && (
                    <div>
                        <Title>Frecuencia</Title>
                        <p>
                            {preventive.frequency > 1
                                ? `Cada ${preventive.frequency} meses`
                                : 'Todos los meses'}
                        </p>
                    </div>
                )}

                {preventive.months.length > 0 && (
                    <div>
                        <Title>Meses</Title>
                        <p>
                            {preventive.months.length > 1
                                ? preventive.months.map((month) => `${month}, `)
                                : preventive.months[0]}
                        </p>
                    </div>
                )}

                <div>
                    <Title>Estado</Title>
                    <PreventiveStatusBadge status={preventive.status} />
                </div>

                <div>
                    <Title>Fecha último completado</Title>
                    <p>
                        {preventive.lastDoneAt
                            ? format(new Date(preventive.lastDoneAt), 'dd/MM/yyyy')
                            : 'N/A'}
                    </p>
                </div>

                <div>
                    <Title>Fecha último cambio de baterías</Title>
                    <p>
                        {preventive.batteryChangedAt
                            ? format(new Date(preventive.batteryChangedAt), 'dd/MM/yyyy')
                            : 'N/A'}
                    </p>
                </div>

                <section>
                    <Title>Últimas tareas</Title>
                    <div className="overflow-hidden rounded-md border border-gray-200">
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow className="hover:bg-muted/50">
                                    <TableHead className="font-medium">Número</TableHead>
                                    <TableHead className="font-medium">
                                        Creación
                                    </TableHead>
                                    <TableHead className="font-medium">Cierre</TableHead>
                                    <TableHead className="font-medium">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {preventive.tasks.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No hay tareas
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    preventive.tasks.map((task) => (
                                        <TableRow
                                            key={task.id}
                                            className="cursor-pointer border-b hover:bg-muted/50"
                                            onClick={() =>
                                                router.push(
                                                    routesBuilder.tasks.details(task.id),
                                                )
                                            }
                                        >
                                            <TableCell className="font-medium">
                                                {task.taskNumber}
                                            </TableCell>
                                            <TableCell>
                                                {format(
                                                    new Date(task.createdAt),
                                                    'dd/MM/yyyy',
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {task.closedAt
                                                    ? format(
                                                          new Date(task.closedAt),
                                                          'dd/MM/yyyy',
                                                      )
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <TaskStatusBadge status={task.status} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>
        </main>
    );
};

export const PreventiveDetail = ({ id }: { id: string }) => {
    const result = useGetPreventive({ id });

    if (result.isPending) {
        return <FormSkeleton />;
    }

    if (result.isError) {
        return <p>Error</p>;
    }

    if (!result.data.preventive) {
        return <p>Not found</p>;
    }

    return <Content preventive={result.data.preventive} />;
};
