import { GetServerSideProps } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import BusinessTable from '@/components/Tables/BusinessTable';
import TitleButton from '@/components/TitleButton';
import { prisma } from 'lib/prisma';

export type BusinessesPageProps = Awaited<ReturnType<typeof getProps>>;

export default function Businesses({ businesses }: BusinessesPageProps): JSX.Element {
    return (
        <DashboardLayout>
            <main>
                <TitleButton
                    title="Empresas"
                    path="/tech-admin/businesses/new"
                    nameButton="Agregar una empresa"
                />
                <BusinessTable businesses={businesses} />
            </main>
        </DashboardLayout>
    );
}

export const getServerSideProps: GetServerSideProps<BusinessesPageProps> = async () => {
    const props = await getProps();
    return {
        props,
    };
};

async function getProps() {
    const businesses = await prisma.business.findManyUndeleted({
        select: {
            id: true,
            name: true,
        },
    });
    return {
        businesses,
    };
}
