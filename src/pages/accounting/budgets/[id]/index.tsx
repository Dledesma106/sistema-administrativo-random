import { useRouter } from 'next/router';

import { BudgetDetail } from '@/modules/BudgetDetail';

export default function BudgetView(): JSX.Element {
    const router = useRouter();

    return <BudgetDetail id={router.query.id as string} />;
}
