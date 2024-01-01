import { GetServerSideProps } from 'next';

import { Role } from '@prisma/client';

import { DashboardLayout } from '@/components/DashboardLayout';
import TitleButton from '@/components/TitleButton';
import TasksDataTable from '@/modules/TasksDataTable';
import { prisma } from 'lib/prisma';

export type TasksPageProps = Awaited<ReturnType<typeof getProps>>;

const getProps = async () => {
    const cities = await prisma.city.findMany({
        where: {
            deleted: false,
        },
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
    });
    const provinces = await prisma.province.findMany({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            name: true,
        },
    });
    const clients = await prisma.client.findMany({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            name: true,
        },
    });
    const businesses = await prisma.business.findMany({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            name: true,
        },
    });
    const techs = await prisma.user.findMany({
        where: {
            roles: {
                has: Role.Tecnico,
            },
            deleted: false,
        },
        select: {
            id: true,
            fullName: true,
        },
    });

    return {
        cities: cities,
        provinces: provinces,
        clients: clients,
        businesses: businesses,
        techs: techs,
    };
};

export default function TechAdminTasks(props: TasksPageProps): JSX.Element {
    return (
        <DashboardLayout>
            <TitleButton
                title="Tareas pendientes"
                path="/tech-admin/tasks/new"
                nameButton="Delegar tarea"
            />

            <TasksDataTable {...props} />
        </DashboardLayout>
    );
}

export const getServerSideProps: GetServerSideProps<TasksPageProps> = async () => {
    return {
        props: await getProps(),
    };
};
