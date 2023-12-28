import { DashboardLayout } from '@/components/DashboardLayout';
import ClientTable from '@/components/Tables/ClientTable';
import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import Client from 'backend/models/Client';
import { type IClient } from 'backend/models/interfaces';

interface props {
    clients: IClient[];
}

export default function Clients({ clients }: props): JSX.Element {
    return (
        <DashboardLayout>
            <TitleButton
                title="Clientes"
                path="/tech-admin/clients/new"
                nameButton="Agregar cliente"
            />
            <ClientTable clients={clients} />
        </DashboardLayout>
    );
}

export async function getServerSideProps(): Promise<{ props: props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    await dbConnect();
    const docClients = await Client.findUndeleted({});
    const clients = mongooseDocumentToJSON(docClients);
    return {
        props: {
            clients,
        },
    };
}
