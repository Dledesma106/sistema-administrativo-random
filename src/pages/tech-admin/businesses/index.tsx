import { GetServerSideProps } from 'next';

import TitleButton from '@/components/TitleButton';
import BusinessTable from '@/modules/tables/BusinessTable';
import { prisma } from 'lib/prisma';

export type BusinessesPageProps = Awaited<ReturnType<typeof getProps>>;

export default function Businesses({ businesses }: BusinessesPageProps): JSX.Element {
    return (
        <>
            <main>
                <TitleButton
                    title="Empresas"
                    path="/tech-admin/businesses/new"
                    nameButton="Agregar una empresa"
                />
                <BusinessTable businesses={businesses} />
            </main>
        </>
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
