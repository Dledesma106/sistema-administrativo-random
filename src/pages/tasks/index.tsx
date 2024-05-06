import { GetServerSideProps } from 'next';

import { Role } from '@prisma/client';

import { DashboardLayout } from '@/components/DashboardLayout';
import TitleButton from '@/components/TitleButton';
import { routesBuilder } from '@/lib/routes';
import TasksDataTable from '@/modules/tables/TasksDataTable';
import { prisma } from 'lib/prisma';

export type TasksPageProps = Awaited<ReturnType<typeof getProps>>;

const getProps = async () => {
    const cities = await prisma.city.findManyUndeleted({
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

    const provinces = await prisma.province.findManyUndeleted({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            name: true,
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
    const businesses = await prisma.business.findManyUndeleted({
        where: {
            deleted: false,
        },
        select: {
            id: true,
            name: true,
        },
    });
    const techs = await prisma.user.findManyUndeleted({
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
            <main>
                <TitleButton
                    title="Tareas pendientes"
                    path={routesBuilder.tasks.create()}
                    nameButton="Delegar tarea"
                />

                <TasksDataTable {...props} />
            </main>
        </DashboardLayout>
    );
}

export const getServerSideProps: GetServerSideProps<TasksPageProps> = async () => {
    return {
        props: await getProps(),
    };
};
