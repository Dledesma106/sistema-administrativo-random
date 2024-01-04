import { type GetServerSidePropsContext } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import ClientBranchForm, {
    type IClientBranchForm,
} from '@/components/Forms/TechAdmin/ClientBranchForm';
import dbConnect from '@/lib/dbConnect';
import { deSlugify, mongooseDocumentToJSON } from '@/lib/utils';
import BusinessModel from 'backend/models/Business';
import CityModel from 'backend/models/City';
import ClientModel from 'backend/models/Client';
import { type IBusiness, type ICity, type IClient } from 'backend/models/interfaces';

interface Props {
    cities: ICity[];
    client: IClient;
    businesses: IBusiness[];
}

export default function NewClientBranch({
    cities,
    client,
    businesses,
}: Props): JSX.Element {
    const branchForm: IClientBranchForm = {
        _id: '',
        number: '',
        client,
        city: '',
        businesses: [],
    };

    return (
        <DashboardLayout>
            <ClientBranchForm
                branchForm={branchForm}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cities={cities as any}
                businesses={businesses}
            />
        </DashboardLayout>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{ props: Props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    const { params } = ctx;
    if (!params) {
        return {
            props: {} as Props,
        };
    }
    await dbConnect();
    const cities = await CityModel.findUndeleted().lean().exec();
    const client = await ClientModel.findOne({
        name: deSlugify(params.name as string),
    });
    const businesses = await BusinessModel.findUndeleted({});
    // console.log(client)

    return {
        props: mongooseDocumentToJSON({
            cities,
            client,
            businesses,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any,
    };
}
