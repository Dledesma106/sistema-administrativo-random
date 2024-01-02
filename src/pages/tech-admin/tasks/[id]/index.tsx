import { GetServerSideProps } from 'next';

import Image from 'next/image';
import Link from 'next/link';

import dayjs from 'dayjs';

import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { TypographyH1 } from '@/components/ui/typography';
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
            images: true,
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

    return {
        ...task,
        images: images,
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
                        <Link href={`/tech-admin/tasks/${task.id}/edit`}>Editar</Link>
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
                                        <Image
                                            className="rounded-md border border-gray-200 bg-gray-200"
                                            src={image.url}
                                            width={640}
                                            height={1252}
                                            alt=""
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
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
