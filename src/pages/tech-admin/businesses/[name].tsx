import { type GetServerSidePropsContext } from 'next';

import { DashboardLayout } from '@/components/DashboardLayout';
import BusinessForm, {
    type IBusinessForm,
} from '@/components/Forms/TechAdmin/BusinessForm';
import dbConnect from '@/lib/dbConnect';
import { deSlugify, mongooseDocumentToJSON } from '@/lib/utils';
import BusinessModel from 'backend/models/Business';
import { type IBusiness } from 'backend/models/interfaces';

interface Props {
    business: IBusiness;
}

export default function EditBusiness({ business }: Props): JSX.Element {
    const businessForm: IBusinessForm = {
        _id: business._id as string,
        name: business.name,
    };
    return (
        <DashboardLayout>
            <BusinessForm newBusiness={false} businessForm={businessForm} />
        </DashboardLayout>
    );
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{ props: Props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    const { params } = ctx;
    if (!params) {
        return {
            props: {} as Props,
        };
    }

    await dbConnect();
    const docBusiness = await BusinessModel.findOneUndeleted({
        name: deSlugify(params.name as string),
    });
    if (!docBusiness) {
        return {
            props: {} as Props,
        };
    }

    const props = {
        business: mongooseDocumentToJSON(docBusiness),
    };

    return {
        props: props as any,
    };
}