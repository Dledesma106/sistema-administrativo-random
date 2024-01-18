import { DashboardLayout } from '@/components/DashboardLayout';
import CityForm, { type ICityForm } from '@/components/Forms/TechAdmin/CityForm';
import dbConnect from '@/lib/dbConnect';
import ProvinceModel from 'backend/models/Province';
import { prisma } from 'lib/prisma';
import { GetServerSideProps } from 'next';


export type NewCitiesPageProps = Awaited<ReturnType<typeof getProps>>;


export default function NewCity({ provinces }: NewCitiesPageProps): JSX.Element {
    const cityForm: ICityForm = {
        _id: '',
        name: '',
        province: "",

    };

    return (
        <DashboardLayout>
            <CityForm cityForm={cityForm} provinces={provinces} />
        </DashboardLayout>
    );
}

export const getServerSideProps: GetServerSideProps<NewCitiesPageProps> = async () => {
    const props = await getProps();
    return {
        props,
    };
}
async function getProps() {
    const provinces = await prisma.province.findManyUndeleted({
        select: {
            id: true,
            name: true,
        },
    });
    return {
        provinces,
    };
}