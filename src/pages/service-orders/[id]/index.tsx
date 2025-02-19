import { useRouter } from 'next/router';

import { ServiceOrderDetail } from '@/modules/ServiceOrderDetail';

export default function ServiceOrderDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    if (!id || typeof id !== 'string') {
        return null;
    }

    return <ServiceOrderDetail id={id} />;
}
