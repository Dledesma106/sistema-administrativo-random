import { GetServerSideProps } from 'next';

import {  } from '@/components/';
import TitleButton from '@/components/TitleButton';
import { PreventivesTable } from '@/modules/tables/preventives-table';
import { prisma } from 'lib/prisma';

export type PreventivesPageProps = Awaited<ReturnType<typeof getProps>>;

export default function Preventives(props: PreventivesPageProps): JSX.Element {
    return (
        <>
            <TitleButton
                title="Preventivos"
                path="/tech-admin/preventives/new"
                nameButton="Agregar preventivo"
            />

            <PreventivesTable
                businesses={props.businesses}
                clients={props.clients}
                provinces={props.provinces}
                technicians={props.technicians}
            />
        </>
    );
}

export const getServerSideProps: GetServerSideProps<PreventivesPageProps> = async () => {
    return {
        props: await getProps(),
    };
};

const getProps = async () => {
    const provinces = await prisma.province.findManyUndeleted({
        select: {
            id: true,
            name: true,
        },
    });

    const businesses = await prisma.business.findManyUndeleted({
        select: {
            id: true,
            name: true,
        },
    });

    const technicians = await prisma.user.findManyUndeleted({
        where: {
            roles: {
                has: 'Tecnico',
            },
        },
        select: {
            id: true,
            fullName: true,
        },
    });

    const clients = await prisma.client.findManyUndeleted({
        select: {
            id: true,
            name: true,
        },
    });

    return {
        clients,
        provinces,
        businesses,
        technicians,
    };
};
