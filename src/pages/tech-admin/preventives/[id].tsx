import { type GetServerSidePropsContext } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import PreventiveForm, {
    type IPreventiveForm,
} from '@/components/Forms/TechAdmin/PreventiveForm';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import BranchModel from 'backend/models/Branch';
import BusinessModel from 'backend/models/Business';
import ClientModel from 'backend/models/Client';
import {
    type IBranch,
    type IBusiness,
    type IClient,
    type IUser,
    type IPreventive,
} from 'backend/models/interfaces';
import Preventive from 'backend/models/Preventive';
import { type Frequency, type Month } from 'backend/models/types';
import UserModel from 'backend/models/User';

interface Props {
    preventive: IPreventive;
    branches: IBranch[];
    clients: IClient[];
    businesses: IBusiness[];
    technicians: IUser[];
}

export default function NewTask({
    branches,
    clients,
    businesses,
    technicians,
    preventive,
}: Props): JSX.Element {
    const preventiveFormProps = {
        branches,
        clients,
        businesses,
        technicians,
    };

    const preventiveForm: IPreventiveForm = {
        _id: preventive._id as string,
        branch: preventive.branch,
        business: preventive.business,
        assigned: preventive.assignedIDs,
        months: preventive.months as Month[],
        frequency: preventive.frequency as Frequency,
        status: preventive.status,
        lastDoneAt: preventive.lastDoneAt,
        batteryChangedAt: preventive.batteryChangedAt,
        observations: preventive.observations,
    };

    return (
        <DashboardLayout>
            <PreventiveForm
                newPreventive={false}
                preventiveForm={preventiveForm}
                {...preventiveFormProps}
            />
        </DashboardLayout>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{ props: Props }> {
    const { params } = ctx;
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    if (!params) {
        return {
            props: {} as Props,
        };
    }
    await dbConnect();
    const preventive = await Preventive.findById(params.id).populate(
        Preventive.getPopulateParameters(),
    );
    if (preventive === null) {
        return {
            props: {} as Props,
        };
    }

    const branches = await BranchModel.findUndeleted({});
    const clients = await ClientModel.findUndeleted({});
    const businesses = await BusinessModel.findUndeleted({});
    const technicians = await UserModel.findUndeleted({
        roles: 'Tecnico',
    });

    return {
        props: mongooseDocumentToJSON({
            branches,
            clients,
            businesses,
            technicians,
            preventive,
        }) as any,
    };
}
