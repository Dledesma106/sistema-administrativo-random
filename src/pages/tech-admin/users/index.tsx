import UserTable from '@/components/Tables/UserTable';
import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import { type IUser } from 'backend/models/interfaces';
import User from 'backend/models/User';

interface props {
    users: IUser[];
}

export default function Users({ users }: props): JSX.Element {
    return (
        <>
            <TitleButton
                title="Usuarios"
                path="/tech-admin/users/new"
                nameButton="Agregar usuario"
            />

            <UserTable users={users} />
        </>
    );
}

export async function getServerSideProps(): Promise<{ props: props }> {
    await dbConnect();
    const docUsers = await User.findUndeleted({});
    return {
        props: {
            users: mongooseDocumentToJSON(docUsers),
        },
    };
}
