import ProvinceTable from '@/components/Tables/ProvinceTable';
import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import { type IProvince } from 'backend/models/interfaces';
import Province from 'backend/models/Province';

interface props {
    provinces: IProvince[];
}

export default function Provinces({ provinces }: props): JSX.Element {
    return (
        <>
            <TitleButton
                title="Provincias"
                path="/tech-admin/provinces/new"
                nameButton="Agregar provincia"
            />
            <ProvinceTable provinces={provinces} />
        </>
    );
}

export async function getServerSideProps(): Promise<{ props: props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    await dbConnect();
    const docProvinces = await Province.findUndeleted({});
    const provinces = mongooseDocumentToJSON(docProvinces);
    return {
        props: {
            provinces,
        },
    };
}
