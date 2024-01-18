import { DashboardLayout } from '@/components/DashboardLayout';
import CityTable from '@/components/Tables/CityTable';
import TitleButton from '@/components/TitleButton';
import { prisma } from 'lib/prisma';
import { GetServerSideProps } from 'next';

export type CitiesProps = Awaited<ReturnType<typeof getProps>>;

export default function Cities({ cities, provinces }: CitiesProps): JSX.Element {
    return (
        <DashboardLayout>
            <main>
                <TitleButton
                    title="Localidades"
                    path="/tech-admin/cities/new"
                    nameButton="Agregar localidad"
                />
                <CityTable cities={cities} provinces={provinces} />
            </main>
        </DashboardLayout>
    );
}

export const getServerSideProps: GetServerSideProps<CitiesProps> = async () => {

    const props = await getProps();

    return {
        props,
    };
    
}

async function getProps() {
    const cities = await prisma.city.findManyUndeleted({
        select:{
            id:true,
            name: true,
            province: {
                select: {
                    name: true,
                    id: true,
                }
            },
        }
    })
        
     const provinces = await prisma.province.findManyUndeleted({
        select: {
            id: true,
            name: true,
        },
    });
    const props = {
        cities,
        provinces,
    };
    return props
}