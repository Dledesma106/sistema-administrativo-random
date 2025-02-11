import { useRouter } from 'next/router';

import { PreventiveDetail } from '@/modules/PreventiveDetail';

export default function PreventiveView(): JSX.Element {
    const router = useRouter();

    return (
        <>
            <PreventiveDetail id={router.query.id as string} />
        </>
    );
}
