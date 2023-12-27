import { type GetServerSidePropsContext } from 'next';

import ClientBranchForm, {
    type IClientBranchForm,
} from '@/components/Forms/TechAdmin/ClientBranchForm';
import dbConnect from '@/lib/dbConnect';
import { deSlugify, mongooseDocumentToJSON } from '@/lib/utils';
import Business from 'backend/models/Business';
import CityModel from 'backend/models/City';
import Client from 'backend/models/Client';
import { type IBusiness, type ICity, type IClient } from 'backend/models/interfaces';

interface props {
    cities: ICity[];
    client: IClient;
    businesses: IBusiness[];
}

export default function NewClientBranch({
    cities,
    client,
    businesses,
}: props): JSX.Element {
    const branchForm: IClientBranchForm = {
        _id: '',
        number: '',
        client,
        city: {} as ICity,
        businesses: [],
    };

    return (
        <>
            <ClientBranchForm
                branchForm={branchForm}
                cities={cities}
                businesses={businesses}
            />
        </>
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
    const cities = await CityModel.findUndeleted().lean().exec();
    const client = await Client.findOne({
        name: deSlugify(params.name as string),
    });
    const businesses = await Business.findUndeleted({});
    // console.log(client)

    return {
        props: mongooseDocumentToJSON({
            cities,
            client,
            businesses,
        }),
    };
}
