import { DashboardLayout } from '@/components/DashboardLayout';
import BusinessTable from '@/components/Tables/BusinessTable';
import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import BusinessModel from 'backend/models/Business';
import { type IBusiness } from 'backend/models/interfaces';

interface Props {
    businesses: IBusiness[];
}

export default function Businesses({ businesses }: Props): JSX.Element {
    return (
        <DashboardLayout>
            <main>
                <TitleButton
                    title="Empresas"
                    path="/tech-admin/businesses/new"
                    nameButton="Agregar una empresa"
                />
                <BusinessTable businesses={businesses} />
            </main>
        </DashboardLayout>
    );
}

export async function getServerSideProps(): Promise<{ props: Props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    await dbConnect();
    const docBusinesses = await BusinessModel.findUndeleted({});
    return {
        props: {
            businesses: mongooseDocumentToJSON(docBusinesses),
        },
    };
}
