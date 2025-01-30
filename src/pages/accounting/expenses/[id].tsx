import { useRouter } from 'next/router';

import { ExpenseDetail } from '@/modules/ExpenseDetail';

export default function ExpenseView(): JSX.Element {
    const router = useRouter();

    return (
        <>
            <ExpenseDetail id={router.query.id as string} />
        </>
    );
}
