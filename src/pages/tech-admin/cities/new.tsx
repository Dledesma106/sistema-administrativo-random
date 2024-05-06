import { GetServerSideProps } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import CityForm, { type CityFormValues } from '@/components/Forms/TechAdmin/CityForm';
import { prisma } from 'lib/prisma';

export type NewCitiesPageProps = Awaited<ReturnType<typeof getProps>>;

export default function NewCity({ provinces }: NewCitiesPageProps): JSX.Element {
    const cityForm: CityFormValues = {
        name: '',
        provinceId: '',
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
};
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
