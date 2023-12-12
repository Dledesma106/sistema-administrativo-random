import Client from 'backend/models/Client';
import { type IClient } from 'backend/models/interfaces';
import ClientTable from 'frontend/components/Tables/ClientTable';
import TitleButton from 'frontend/components/TitleButton';
import dbConnect from 'lib/dbConnect';
import { formatIds } from 'lib/utils';

interface props {
    clients: IClient[];
}

export default function Clients({ clients }: props): JSX.Element {
    return (
        <>
            <TitleButton
                title="Clientes"
                path="/tech-admin/clients/new"
                nameButton="Agregar cliente"
            />
            <ClientTable clients={clients} />
        </>
    );
}

export async function getServerSideProps(): Promise<{ props: props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    await dbConnect();
    const docClients = await Client.findUndeleted({});
    const clients = formatIds(docClients);
    return { props: { clients } };
}
