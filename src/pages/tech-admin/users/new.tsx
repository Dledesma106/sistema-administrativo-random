import { DashboardLayout } from '@/components/DashboardLayout';
import UserForm, { UserFormProps } from '@/components/Forms/TechAdmin/UserForm';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import CityModel from 'backend/models/City';

interface NewUserPageProps {
    cities: UserFormProps['cities'];
}

export default function NewUser({ cities }: NewUserPageProps): JSX.Element {
    return (
        <DashboardLayout>
            <UserForm cities={cities} />
        </DashboardLayout>
    );
}

export async function getServerSideProps(): Promise<{ props: NewUserPageProps }> {
    await dbConnect();

    const populatedCities = (await CityModel.find({ deleted: false })
        .populate('province')
        .lean()) as UserFormProps['cities'];

    return {
        props: {
            cities: mongooseDocumentToJSON(populatedCities),
        },
    };
}
