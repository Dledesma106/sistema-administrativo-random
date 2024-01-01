import { type GetServerSidePropsContext } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import ClientForm, { type IClientForm } from '@/components/Forms/TechAdmin/ClientForm';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import ClientModel from 'backend/models/Client';
import { type IClient } from 'backend/models/interfaces';

interface Props {
    client: IClient;
}

export default function ClientEdit({ client }: Props): JSX.Element {
    const clientForm: IClientForm = {
        _id: client._id as string,
        name: client.name,
    };

    return (
        <DashboardLayout>
            <ClientForm newClient={false} clientForm={clientForm} />
        </DashboardLayout>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{ props: Props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    const { params } = ctx;
    await dbConnect();
    if (!params) {
        return {
            props: {} as Props,
        };
    }
    const docClient = await ClientModel.findOne({
        name: params.name,
    });
    if (!docClient) {
        return {
            props: {} as Props,
        };
    }

    const client = mongooseDocumentToJSON(docClient);
    return {
        props: {
            client: client as IClient,
        },
    };
}
