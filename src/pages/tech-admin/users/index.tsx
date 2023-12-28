import { DashboardLayout } from '@/components/DashboardLayout';
import UserTable from '@/components/Tables/UserTable';
import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import { type IUser } from 'backend/models/interfaces';
import UserModel from 'backend/models/User';

interface props {
    users: IUser[];
}

export default function Users({ users }: props): JSX.Element {
    return (
        <DashboardLayout>
            <TitleButton
                title="Usuarios"
                path="/tech-admin/users/new"
                nameButton="Agregar usuario"
            />

            <UserTable users={users} />
        </DashboardLayout>
    );
}

export async function getServerSideProps(): Promise<{ props: props }> {
    await dbConnect();
    const docUsers = await UserModel.findUndeleted({});
    return {
        props: {
            users: mongooseDocumentToJSON(docUsers),
        },
    };
}
