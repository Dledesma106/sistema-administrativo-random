import UserForm from '@/components/Forms/TechAdmin/UserForm';
import dbConnect from '@/lib/dbConnect';
import { formatIds } from '@/lib/utils';
import CityModel from 'backend/models/City';
import { type ICity } from 'backend/models/interfaces';

interface props {
    cities: ICity[];
}

export default function NewUser({ cities }: props): JSX.Element {
    return <UserForm cities={cities} />;
}

export async function getServerSideProps(): Promise<{ props: props }> {
    await dbConnect();
    const docCities = await CityModel.findUndeleted({});
    return { props: { cities: formatIds(docCities) } };
}
