import { GetServerSideProps } from 'next';

import {  } from '@/components/';
import TitleButton from '@/components/TitleButton';
import { CityTable } from '@/modules/tables/city-table';
import { prisma } from 'lib/prisma';

export type CitiesPageProps = Awaited<ReturnType<typeof getProps>>;

export default function Cities({ provinces }: CitiesPageProps): JSX.Element {
    return (
        <>
            <main>
                <TitleButton
                    title="Localidades"
                    path="/tech-admin/cities/new"
                    nameButton="Agregar localidad"
                />

                <CityTable provinces={provinces} />
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<CitiesPageProps> = async () => {
    const props = await getProps();

    return {
        props,
    };
};

const getProps = async () => {
    const provinces = await prisma.province.findManyUndeleted({
        select: {
            id: true,
            name: true,
        },
    });

    return {
        provinces,
    };
};
