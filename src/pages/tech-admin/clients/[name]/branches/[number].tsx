import { type GetServerSidePropsContext } from 'next';

import ClientBranchForm, {
    type IClientBranchForm,
} from '@/components/Forms/TechAdmin/ClientBranchForm';
import dbConnect from '@/lib/dbConnect';
import { formatIds } from '@/lib/utils';
import BranchModel, { Branch } from 'backend/models/Branch';
import Business from 'backend/models/Business';
import CityModel from 'backend/models/City';
import { type IBranch, type IBusiness, type ICity } from 'backend/models/interfaces';

interface props {
    branch: IBranch;
    cities: ICity[];
    businesses: IBusiness[];
}

export default function EditClientBranch({
    branch,
    cities,
    businesses,
}: props): JSX.Element {
    const branchForm: IClientBranchForm = {
        _id: branch._id.toString(),
        number: branch.number,
        client: branch.client,
        city: branch.city,
        businesses: branch.businesses,
    };

    return (
        <>
            <ClientBranchForm
                newBranch={false}
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
    if (params == null) {
        return { props: {} as props };
    }
    await dbConnect();
    const docCities = await CityModel.findUndeleted({});
    const docBranch = await BranchModel.findOne({ number: params.number }).populate(
        Branch.getPopulateParameters(),
    );
    const docBusinesses = await Business.findUndeleted({});
    // console.log(docBranch)

    return {
        props: {
            cities: formatIds(docCities),
            branch: formatIds(docBranch),
            businesses: formatIds(docBusinesses),
        },
    };
}
