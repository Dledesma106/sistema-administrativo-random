import { DashboardLayout } from '@/components/DashboardLayout';
import PreventiveForm, {
    type IPreventiveForm,
} from '@/components/Forms/TechAdmin/PreventiveForm';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import Branch from 'backend/models/Branch';
import Business from 'backend/models/Business';
import Client from 'backend/models/Client';
import {
    type IBranch,
    type IBusiness,
    type IClient,
    type IUser,
} from 'backend/models/interfaces';
import { type Month } from 'backend/models/types';
import User from 'backend/models/User';

interface props {
    branches: IBranch[];
    clients: IClient[];
    businesses: IBusiness[];
    technicians: IUser[];
}

export default function NewTask(props: props): JSX.Element {
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

export async function getServerSideProps(): Promise<{ props: props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    await dbConnect();
    const docBranches = await Branch.findUndeleted({});
    const docClients = await Client.findUndeleted({});
    const docBusinesses = await Business.findUndeleted({});
    const docTechnicians = await User.findUndeleted({
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
        },
    };
}
