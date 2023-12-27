import CityForm, { type ICityForm } from '@/components/Forms/TechAdmin/CityForm';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import { type IProvince } from 'backend/models/interfaces';
import Province from 'backend/models/Province';

interface props {
    provinces: IProvince[];
}

export default function NewCity({ provinces }: props): JSX.Element {
    const cityForm: ICityForm = {
        _id: '',
        name: '',
        province: {} as IProvince,
    };

    return (
        <>
            <CityForm cityForm={cityForm} provinces={provinces} />
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
