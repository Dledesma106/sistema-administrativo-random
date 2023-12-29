import { type GetServerSidePropsContext } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import UserForm, { UserFormValues } from '@/components/Forms/TechAdmin/UserForm';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import { CityWithProvince } from '@/types';
import CityModel from 'backend/models/City';
import { type IUser } from 'backend/models/interfaces';
import UserModel from 'backend/models/User';

interface Props {
    cities: CityWithProvince[];
    user: IUser;
}

export default function EditUser({ cities, user }: Props): JSX.Element {
    const userForm: UserFormValues = {
        _id: user._id as string,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles:
            user.roles?.map((role) => {
                return {
                    label: role,
                    value: role,
                };
            }) || [],
        city: user.city?._id as string,
        password: '',
    };

    return (
        <DashboardLayout>
            <UserForm userForm={userForm} newUser={false} cities={cities} />
        </DashboardLayout>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{ props: Props }> {
    const { params } = ctx;
    if (params?.id === undefined) {
        return {
            props: {} as Props,
        };
    }
    await dbConnect();

    const docUser = (await UserModel.findById(params.id).populate(
        UserModel.getPopulateParameters(),
    )) as IUser;
    const docCities = (await CityModel.findUndeleted().lean()) as CityWithProvince[];

    return {
        props: {
            cities: mongooseDocumentToJSON(docCities),
            user: mongooseDocumentToJSON(docUser),
        },
    };
}
