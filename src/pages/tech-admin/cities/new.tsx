import { DashboardLayout } from '@/components/DashboardLayout';
import CityForm, { type ICityForm } from '@/components/Forms/TechAdmin/CityForm';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import { type IProvince } from 'backend/models/interfaces';
import ProvinceModel from 'backend/models/Province';

interface Props {
    provinces: IProvince[];
}

export default function NewCity({ provinces }: Props): JSX.Element {
    const cityForm: ICityForm = {
        _id: '',
        name: '',
        province: '',
    };

    return (
        <DashboardLayout>
            <CityForm cityForm={cityForm} provinces={provinces} />
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
