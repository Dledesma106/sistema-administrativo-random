import { useRouter } from 'next/router';

import { TaskDetail } from '@/modules/TaskDetail';

export default function TaskView(): JSX.Element {
    const router = useRouter();

    return (
        <>
            <TaskDetail id={router.query.id as string} />
        </>
    );
}
