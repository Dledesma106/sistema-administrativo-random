import { GetServerSideProps } from 'next';

import Image from 'next/image';
import Link from 'next/link';

import { DownloadIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';

import { DashboardLayout } from '@/components/DashboardLayout';
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
import { createImageSignedUrl } from 'backend/s3Client';
import { prisma } from 'lib/prisma';

type Props = {
    task: NonNullable<Awaited<ReturnType<typeof getTask>>>;
};

type Params = {
    id: string;
};

const getTask = async (id: string) => {
    const task = await prisma.task.findUnique({
        where: {
            id,
        },
        include: {
            images: {
                select: {
                    id: true,
                    url: true,
                    urlExpire: true,
                    key: true,
                },
            },
            branch: {
                select: {
                    number: true,
                    client: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
            assigned: {
                select: {
                    id: true,
                    fullName: true,
                },
                where: {
                    deleted: false,
                },
            },
            expenses: {
                select: {
                    id: true,
                    amount: true,
                    paySource: true,
                    createdAt: true,
                    image: {
                        select: {
                            id: true,
                            url: true,
                            urlExpire: true,
                            key: true,
                        },
                    },
                    status: true,
                    doneBy: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                        },
                    },
                },
                where: {
                    deleted: false,
                },
            },
        },
    });

    if (!task) {
        return null;
    }

    const images = await Promise.all(
        task.images.map(async (image) => {
            if (image.url && image.urlExpire && dayjs(image.urlExpire).isAfter(dayjs())) {
                return {
                    id: image.id,
                    url: image.url,
                };
            }

            const { url, expiresAt } = await createImageSignedUrl(image);

            await prisma.image.update({
                where: {
                    id: image.id,
                },
                data: {
                    url,
                    urlExpire: expiresAt,
                },
            });

            return {
                id: image.id,
                url,
            };
        }),
    );

    const expenses = await Promise.all(
        task.expenses.map(async (expense) => {
            if (
                expense.image.url &&
                expense.image.urlExpire &&
                dayjs(expense.image.urlExpire).isAfter(dayjs())
            ) {
                return {
                    ...expense,
                    image: {
                        id: expense.image.id,
                        url: expense.image.url,
                    },
                };
            }

            const { url, expiresAt } = await createImageSignedUrl(expense.image);

            await prisma.image.update({
                where: {
                    id: expense.image.id,
                },
                data: {
                    url,
                    urlExpire: expiresAt,
                },
            });

            return {
                ...expense,
                image: {
                    id: expense.image.id,
                    url,
                },
            };
        }),
    );

    return {
        ...task,
        images: images,
        expenses: expenses,
    };
};

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold">{children}</h2>
);

export default function TaskView(props: Props): JSX.Element {
    if (!props.task) {
        return <DashboardLayout>Task not found</DashboardLayout>;
    }

    const { task } = props;

    return (
        <DashboardLayout>
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
                        {task.closedAt
                            ? dayjs(task.closedAt).format('DD/MM/YYYY')
                            : 'N/A'}
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

                        <p>
                            #{task.branch.number} - {task.branch.client.name}
                        </p>
                    </div>

                    <section>
                        <h2 className="mb-2 text-sm font-bold">Tecnicos asignados</h2>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {task.assigned.map((assigned) => (
                                <li
                                    className="rounded-md border border-gray-200 p-2"
                                    key={assigned.id}
                                >
                                    <p>{assigned.fullName}</p>
                                </li>
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
                                                objectFit="cover"
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
                                {task.expenses.reduce(
                                    (acc, curr) => acc + curr.amount,
                                    0,
                                )}
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
                                                <TableCell>{expense.status}</TableCell>
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
                                                            objectFit="cover"
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
                        </section>
                    )}
                </div>
            </main>
        </DashboardLayout>
    );
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (ctx) => {
    const { params } = ctx;
    const id = params?.id;
    if (!id || Array.isArray(id)) {
        return {
            props: {
                task: null,
            },
        };
    }

    const task = await getTask(id);
    if (!task) {
        return {
            props: {
                task: null,
            },
        };
    }

    return {
        props: {
            task: JSON.parse(JSON.stringify(task)),
        },
    };
};
