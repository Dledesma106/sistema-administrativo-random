import { DashboardLayout } from '@/components/DashboardLayout';
import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import ProvinceTable from '@/modules/tables/ProvinceTable';
import { type IProvince } from 'backend/models/interfaces';
import ProvinceModel from 'backend/models/Province';

interface Props {
    provinces: IProvince[];
}

export default function Provinces({ provinces }: Props): JSX.Element {
    return (
        <DashboardLayout>
            <TitleButton
                title="Provincias"
                path="/tech-admin/provinces/new"
                nameButton="Agregar provincia"
            />
            <ProvinceTable provinces={provinces} />
        </DashboardLayout>
    );
}

export async function getServerSideProps(): Promise<{ props: Props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    await dbConnect();
    const docProvinces = await ProvinceModel.findUndeleted({});
    const provinces = mongooseDocumentToJSON(docProvinces);
    return {
        props: {
            provinces,
        },
    };
}
