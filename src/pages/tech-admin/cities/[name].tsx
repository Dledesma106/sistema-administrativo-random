import { type GetServerSidePropsContext } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import CityForm, { type CityFormValues } from '@/components/Forms/TechAdmin/CityForm';
import dbConnect from '@/lib/dbConnect';
import { deSlugify, mongooseDocumentToJSON } from '@/lib/utils';
import CityModel from 'backend/models/City';
import { type ICity, type IProvince } from 'backend/models/interfaces';
import { prisma } from 'lib/prisma';

interface Props {
    city: ICity;
    provinces: {
        id: string;
        name: string;
    }[];
}

export default function CityView({ city, provinces }: Props): JSX.Element {
    const cityForm: CityFormValues = {
        name: city.name,
        provinceId: (city.provinceId as IProvince)._id as string,
    };

    return (
        <DashboardLayout>
            <CityForm
                idToUpdate={city._id.toString()}
                cityForm={cityForm}
                provinces={provinces}
            />
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

    const city = mongooseDocumentToJSON(docCity) as ICity;
    const provinces = await prisma.province.findManyUndeleted({
        select: {
            id: true,
            name: true,
        },
    });

    return {
        props: {
            city,
            provinces,
        },
    };
}
