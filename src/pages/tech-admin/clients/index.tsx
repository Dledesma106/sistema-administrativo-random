import { DashboardLayout } from '@/components/DashboardLayout';
import ClientTable from '@/components/Tables/ClientTable';
import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import ClientModel from 'backend/models/Client';
import { type IClient } from 'backend/models/interfaces';

interface Props {
    clients: IClient[];
}

export default function Clients({ clients }: Props): JSX.Element {
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

export async function getServerSideProps(): Promise<{ props: Props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    await dbConnect();
    const docClients = await ClientModel.findUndeleted({});
    const clients = mongooseDocumentToJSON(docClients);
    return {
        props: {
            clients,
        },
    };
}
