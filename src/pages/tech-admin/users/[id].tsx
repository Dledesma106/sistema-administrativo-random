import { type GetServerSidePropsContext } from 'next';

import UserForm, { UserFormValues } from '@/components/Forms/TechAdmin/UserForm';
import dbConnect from '@/lib/dbConnect';
import { formatIds } from '@/lib/utils';
import CityModel from 'backend/models/City';
import { type ICity, type IUser } from 'backend/models/interfaces';
import UserModel from 'backend/models/User';

interface props {
    cities: ICity[];
    user: IUser;
}

export default function EditUser({ cities, user }: props): JSX.Element {
    const userForm: UserFormValues = {
        _id: user._id as string,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles:
            user.roles?.map((role) => {
                return { label: role, value: role };
            }) || [],
        city: user.city?._id as string,
        password: '',
    };

    return <UserForm userForm={userForm} newUser={false} cities={cities} />;
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{ props: props }> {
    const { params } = ctx;
    if (params?.id === undefined) {
        return { props: {} as props };
    }
    await dbConnect();
    const docUser = await UserModel.findById(params.id).populate(
        UserModel.getPopulateParameters(),
    );
    const docCities = await CityModel.findUndeleted({});
    return { props: { cities: formatIds(docCities), user: formatIds(docUser) } };
}
