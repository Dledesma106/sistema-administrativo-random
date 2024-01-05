import { GetServerSideProps } from 'next';

import { PrismaClient } from '@prisma/client';

import { DashboardLayout } from '@/components/DashboardLayout';
import ClientTable from '@/components/Tables/ClientTable';
import TitleButton from '@/components/TitleButton';

const prisma = new PrismaClient();

export type ClientsPageProps = Awaited<ReturnType<typeof getProps>>;

export default function Clients({ clients }: ClientsPageProps): JSX.Element {
    return (
        <DashboardLayout>
            <main>
                <TitleButton
                    title="Clientes"
                    path="/tech-admin/clients/new"
                    nameButton="Agregar cliente"
                />
                <ClientTable clients={clients} />
            </main>
        </DashboardLayout>
    );
}

export const getServerSideProps: GetServerSideProps<ClientsPageProps> = async () => {
    const props = await getProps();

    return {
        props,
    };
};

async function getProps() {
    const clients = await prisma.client.findMany();
    return {
        clients,
    };
}
