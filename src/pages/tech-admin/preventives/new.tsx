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
} from 'backend/models/interfaces';
import { type Month } from 'backend/models/types';
import UserModel from 'backend/models/User';

interface Props {
    branches: IBranch[];
    clients: IClient[];
    businesses: IBusiness[];
    technicians: IUser[];
}

export default function NewTask(props: Props): JSX.Element {
    const preventiveForm: IPreventiveForm = {
        _id: '',
        branch: {} as IBranch,
        business: {} as IBusiness,
        assigned: [] as IUser[],
        months: [] as Month[],
        status: 'Pendiente',
    };

    return (
        <DashboardLayout>
            <PreventiveForm preventiveForm={preventiveForm} {...props} />
        </DashboardLayout>
    );
}

export async function getServerSideProps(): Promise<{ props: Props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    await dbConnect();
    const docBranches = await BranchModel.findUndeleted({});
    const docClients = await ClientModel.findUndeleted({});
    const docBusinesses = await BusinessModel.findUndeleted({});
    const docTechnicians = await UserModel.findUndeleted({
        roles: 'Tecnico',
    });
    const branches = mongooseDocumentToJSON(docBranches);
    const clients = mongooseDocumentToJSON(docClients);
    const businesses = mongooseDocumentToJSON(docBusinesses);
    const technicians = mongooseDocumentToJSON(docTechnicians);
    return {
        props: {
            branches,
            clients,
            businesses,
            technicians,
        } as any,
    };
}
