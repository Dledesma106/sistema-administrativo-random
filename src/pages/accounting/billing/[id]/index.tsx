import { useRouter } from 'next/router';

import { BillingDetail } from '@/modules/BillingDetail';

export default function BillingDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    if (!id || typeof id !== 'string') {
        return null;
    }

    return <BillingDetail id={id} />;
}
