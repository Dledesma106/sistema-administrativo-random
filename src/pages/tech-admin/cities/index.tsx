import CityTable from '@/components/Tables/CityTable';
import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import City from 'backend/models/City';
import { type ICity, type IProvince } from 'backend/models/interfaces';
import Province from 'backend/models/Province';

interface props {
    cities: ICity[];
    provinces: IProvince[];
}

export default function Cities({ cities, provinces }: props): JSX.Element {
    return (
        <>
            <TitleButton
                title="Localidades"
                path="/tech-admin/cities/new"
                nameButton="Agregar localidad"
            />
            <CityTable cities={cities} provinces={provinces} />
        </>
    );
}

export async function getServerSideProps(): Promise<{ props: props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    await dbConnect();
    const cities = await City.findUndeleted();
    const provinces = await Province.findUndeleted();
    const props = mongooseDocumentToJSON({
        cities,
        provinces,
    });
    return {
        props,
    };
}
