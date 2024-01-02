import { DashboardLayout } from '@/components/DashboardLayout';
import CityTable from '@/components/Tables/CityTable';
import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import CityModel from 'backend/models/City';
import { type ICity, type IProvince } from 'backend/models/interfaces';
import ProvinceModel from 'backend/models/Province';

interface Props {
    cities: ICity[];
    provinces: IProvince[];
}

export default function Cities({ cities, provinces }: Props): JSX.Element {
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

export async function getServerSideProps(): Promise<{ props: Props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    await dbConnect();
    const cities = await CityModel.findUndeleted();
    const provinces = await ProvinceModel.findUndeleted();
    const props = mongooseDocumentToJSON({
        cities,
        provinces,
    });
    return {
        props: props as any,
    };
}
