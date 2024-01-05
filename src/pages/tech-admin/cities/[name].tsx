import { type GetServerSidePropsContext } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import CityForm, { type ICityForm } from '@/components/Forms/TechAdmin/CityForm';
import dbConnect from '@/lib/dbConnect';
import { deSlugify, mongooseDocumentToJSON } from '@/lib/utils';
import CityModel from 'backend/models/City';
import { type ICity, type IProvince } from 'backend/models/interfaces';
import ProvinceModel from 'backend/models/Province';

interface Props {
    city: ICity;
    provinces: IProvince[];
}

export default function CityView({ city, provinces }: Props): JSX.Element {
    const cityForm: ICityForm = {
        _id: city._id as string,
        name: city.name,
        province: (city.provinceId as IProvince)._id as string,
    };

    return (
        <DashboardLayout>
            <CityForm newCity={false} cityForm={cityForm} provinces={provinces} />
        </DashboardLayout>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{ props: Props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    const { params } = ctx;
    await dbConnect();
    if (!params) {
        return {
            props: {} as Props,
        };
    }
    const docCity = await CityModel.findOneUndeleted({
        name: deSlugify(params.name as string),
    });
    if (!docCity) {
        return {
            props: {} as Props,
        };
    }

    const docProvinces = await ProvinceModel.findUndeleted({});
    const city = mongooseDocumentToJSON(docCity) as ICity;
    const provinces = mongooseDocumentToJSON(docProvinces);

    return {
        props: {
            city,
            provinces,
        },
    };
}
