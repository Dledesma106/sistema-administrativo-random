import { GetServerSideProps } from 'next';

import {  } from '@/components/';
import TitleButton from '@/components/TitleButton';
import ClientTable from '@/modules/tables/ClientTable';
import { prisma } from 'lib/prisma';

export type ClientsPageProps = Awaited<ReturnType<typeof getProps>>;

export default function Clients({ clients }: ClientsPageProps): JSX.Element {
    return (
        <>
            <main>
                <TitleButton
                    title="Clientes"
                    path="/tech-admin/clients/new"
                    nameButton="Agregar cliente"
                />
                <ClientTable clients={clients} />
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<ClientsPageProps> = async () => {
    const props = await getProps();

    return {
        props,
    };
};

async function getProps() {
    const clients = await prisma.client.findManyUndeleted({
        select: {
            id: true,
            name: true,
        },
    });
    return {
        clients,
    };
}
