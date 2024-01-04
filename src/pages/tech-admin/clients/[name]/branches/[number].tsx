/* eslint-disable @typescript-eslint/no-explicit-any */
import { type GetServerSidePropsContext } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import ClientBranchForm, {
    type IClientBranchForm,
} from '@/components/Forms/TechAdmin/ClientBranchForm';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import { CityWithProvince } from '@/types';
import BranchModel, { Branch } from 'backend/models/Branch';
import BusinessModel from 'backend/models/Business';
import CityModel from 'backend/models/City';
import { type IBranch, type IBusiness } from 'backend/models/interfaces';

interface Props {
    branch: IBranch;
    cities: CityWithProvince[];
    businesses: IBusiness[];
}

export default function EditClientBranch({
    branch,
    cities,
    businesses,
}: Props): JSX.Element {
    const branchForm: IClientBranchForm = {
        _id: branch._id.toString(),
        number: branch.number,
        client: branch.client,
        city: branch.city as any,
        businesses: branch.businessesIDs as any,
    };

    return (
        <DashboardLayout>
            <ClientBranchForm
                newBranch={false}
                branchForm={branchForm}
                cities={cities}
                businesses={businesses}
            />
        </DashboardLayout>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext<{
        number: string;
    }>,
): Promise<{ props: Props }> {
    const { params } = ctx;
    if (!params) {
        return {
            props: {} as Props,
        };
    }

    await dbConnect();

    const cities = (await CityModel.findUndeleted().lean().exec()) as CityWithProvince[];
    const docBranch = await BranchModel.findOne({
        number: params.number,
    }).populate(Branch.getPopulateParameters());

    const docBusinesses = await BusinessModel.findUndeleted({});
    if (!docBranch) {
        return {
            props: {} as Props,
        };
    }

    return {
        props: {
            cities: cities,
            branch: mongooseDocumentToJSON(docBranch) as any,
            businesses: mongooseDocumentToJSON(docBusinesses),
        },
    };
}
