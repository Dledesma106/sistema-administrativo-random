import { type GetServerSidePropsContext } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import TechAdminTaskForm, {
    type ITaskForm,
} from '@/components/Forms/TechAdmin/TechAdminTaskForm';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import { getTaskById } from 'backend/controllers/TaskController';
import Branch from 'backend/models/Branch';
import Business from 'backend/models/Business';
import Client from 'backend/models/Client';
import {
    type IBranch,
    type IBusiness,
    type IClient,
    type ITask,
    type IUser,
} from 'backend/models/interfaces';
import Task from 'backend/models/Task';
import User from 'backend/models/User';

interface Props {
    task: ITask;
    branches: IBranch[];
    clients: IClient[];
    businesses: IBusiness[];
    technicians: IUser[];
}

export default function TaskView({
    task,
    branches,
    clients,
    businesses,
    technicians,
}: Props): JSX.Element {
    const form: ITaskForm = {
        _id: task._id as string,
        branch: task.branch,
        business: task.business,
        assigned: task.assigned,
        taskType: task.taskType,
        openedAt: task.openedAt,
        status: task.status,
        description: task.description,
        images: task.images,
    };

    return (
        <DashboardLayout>
            <TechAdminTaskForm
                taskForm={form}
                newTask={false}
                businesses={businesses}
                branches={branches}
                clients={clients}
                technicians={technicians}
            />
        </DashboardLayout>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{ props: Props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    const { params } = ctx;
    await dbConnect();

    const docTask = await getTaskById(params?.id as string);
    if (!docTask) {
        return {
            props: {} as Props,
        };
    }

    const task = mongooseDocumentToJSON(docTask);
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
    console.log('task', task);
    return {
        props: {
            task,
            branches,
            clients,
            businesses,
            technicians,
        },
    };
}
