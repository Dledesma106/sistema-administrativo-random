import { useRouter } from 'next/router';

import { BillingProfileDetail } from '@/modules/BillingProfileDetail';

export default function BillingProfilePage(): JSX.Element {
    const {
        query: { id },
    } = useRouter();

    if (!id || typeof id !== 'string') {
        return <div>No se encontró el perfil de facturación</div>;
    }

    return <BillingProfileDetail id={id} />;
}
