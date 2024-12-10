import { GetServerSideProps } from 'next';

import { Role } from '@prisma/client';

import CreateOrUpdateTaskForm from '@/components/Forms/TechAdmin/CreateOrUpdateTaskForm';
import { prisma } from 'lib/prisma';

export type NewTaskPageProps = Awaited<ReturnType<typeof getNewTaskPageProps>>;

const getNewTaskPageProps = async () => {
    const branches = await prisma.branch.findManyUndeleted({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            number: true,
            clientId: true,
            businesses: {
                select: {
                    id: true,
                    name: true,
                },
            },
            city: {
                select: {
                    id: true,
                    name: true,
                    province: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });
    const clients = await prisma.client.findManyUndeleted({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            name: true,
        },
    });
    const technicians = await prisma.user.findManyUndeleted({
        where: {
            deleted: false,
            roles: {
                has: Role.Tecnico,
            },
        },
        select: {
            id: true,
            fullName: true,
        },
    });

    return {
        branches,
        clients,
        technicians,
    };
};

export default function NewTask(props: NewTaskPageProps): JSX.Element {
    return <CreateOrUpdateTaskForm {...props} />;
}

export const getServerSideProps: GetServerSideProps<NewTaskPageProps> = async () => {
    return {
        props: await getNewTaskPageProps(),
    };
};
