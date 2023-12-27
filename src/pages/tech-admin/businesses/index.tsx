import BusinessTable from '@/components/Tables/BusinessTable';
import TitleButton from '@/components/TitleButton';
import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import Business from 'backend/models/Business';
import { type IBusiness } from 'backend/models/interfaces';

interface props {
    businesses: IBusiness[];
}

export default function Businesses({ businesses }: props): JSX.Element {
    return (
        <>
            <TitleButton
                title="Empresas"
                path="/tech-admin/businesses/new"
                nameButton="Agregar una empresa"
            />
            <BusinessTable businesses={businesses} />
        </>
    );
}

export async function getServerSideProps(): Promise<{ props: props }> {
    // ctx.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=59')
    await dbConnect();
    const docBusinesses = await Business.findUndeleted({});
    return {
        props: {
            businesses: mongooseDocumentToJSON(docBusinesses),
        },
    };
}
