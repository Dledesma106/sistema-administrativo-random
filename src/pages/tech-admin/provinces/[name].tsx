import { type GetServerSidePropsContext } from 'next';

import ProvinceForm, {
    type IProvinceForm,
} from '@/components/Forms/TechAdmin/ProvinceForm';
import dbConnect from '@/lib/dbConnect';
import { deSlugify, mongooseDocumentToJSON } from '@/lib/utils';
import { type IProvince } from 'backend/models/interfaces';
import ProvinceModel from 'backend/models/Province';

interface Props {
    province: IProvince;
}

export default function ProvinceView({ province }: Props): JSX.Element {
    const provinceForm: IProvinceForm = {
        _id: province._id as string,
        name: province.name,
    };

    return (
        <>
            <ProvinceForm newProvince={false} provinceForm={provinceForm} />
        </>
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
    const docProvince = (await ProvinceModel.findOne({
        name: deSlugify(params.name as string),
    })) as IProvince;
    const province = mongooseDocumentToJSON(docProvince);
    return {
        props: {
            province,
        },
    };
}
