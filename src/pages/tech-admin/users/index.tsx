import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import UserTable from '@/modules/tables/UserTable';
import { type IUser } from 'backend/models/interfaces';
import UserModel from 'backend/models/User';

interface Props {
    users: IUser[];
}

export default function Users({ users }: Props): JSX.Element {
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

export async function getServerSideProps(): Promise<{ props: Props }> {
    await dbConnect();

    const docUsers = (await UserModel.findUndeleted({})) as IUser[];
    return {
        props: {
            users: mongooseDocumentToJSON(docUsers),
        },
    };
}
