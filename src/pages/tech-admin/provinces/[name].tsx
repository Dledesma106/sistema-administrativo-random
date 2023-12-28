import { type GetServerSidePropsContext } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import ProvinceForm, {
    type IProvinceForm,
} from '@/components/Forms/TechAdmin/ProvinceForm';
import dbConnect from '@/lib/dbConnect';
import { deSlugify, mongooseDocumentToJSON } from '@/lib/utils';
import { type IProvince } from 'backend/models/interfaces';
import Province from 'backend/models/Province';

interface props {
    province: IProvince;
}

export default function ProvinceView({ province }: props): JSX.Element {
    const provinceForm: IProvinceForm = {
        _id: province._id as string,
        name: province.name,
    };

    return (
        <DashboardLayout>
            <ProvinceForm newProvince={false} provinceForm={provinceForm} />
        </DashboardLayout>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{ props: props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    const { params } = ctx;
    await dbConnect();
    if (!params) {
        return {
            props: {} as props,
        };
    }
    const docProvince = await Province.findOne({
        name: deSlugify(params.name as string),
    });
    const province = mongooseDocumentToJSON(docProvince);
    return {
        props: {
            province,
        },
    };
}
