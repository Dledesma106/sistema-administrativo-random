import { type GetServerSidePropsContext } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import ClientBranchesTable from '@/components/Tables/ClientBranchesTable';
import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { deSlugify, mongooseDocumentToJSON, slugify } from '@/lib/utils';
import Business from 'backend/models/Business';
import City from 'backend/models/City';
import Client from 'backend/models/Client';
import {
    type IBranch,
    type IBusiness,
    type ICity,
    type IClient,
    type IProvince,
} from 'backend/models/interfaces';
import Province from 'backend/models/Province';

interface props {
    client: IClient;
    branches: IBranch[];
    cities: ICity[];
    provinces: IProvince[];
    businesses: IBusiness[];
}
export default function ClientView({
    client,
    branches,
    cities,
    provinces,
    businesses,
}: props): JSX.Element {
    const name = `Cliente: ${client.name}`;
    return (
        <DashboardLayout>
            <TitleButton
                title={name}
                path={`/tech-admin/clients/${slugify(client.name)}/branches/new`}
                nameButton="Agregar sucursal"
            />
            <ClientBranchesTable
                branches={branches}
                cities={cities}
                provinces={provinces}
                businesses={businesses}
            />
        </DashboardLayout>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{ props: props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    const { params } = ctx;
    if (!params) {
        return {
            props: {} as props,
        };
    }
    await dbConnect();
    const client = await Client.findOne({
        name: deSlugify(params.name as string),
    });
    if (client === null) {
        return {
            props: {} as props,
        };
    }
    const branches = await client.getBranches();
    const cities = await City.findUndeleted();
    const provinces = await Province.findUndeleted();
    const businesses = await Business.findUndeleted();
    const props = mongooseDocumentToJSON({
        client,
        branches,
        cities,
        provinces,
        businesses,
    });
    return {
        props,
    };
}
