import { useRouter } from 'next/router';

import { DashboardLayout } from '@/components/DashboardLayout';
import { TaskDetail } from '@/modules/TaskDetail';

export default function TaskView(): JSX.Element {
    const router = useRouter();

    return (
        <DashboardLayout>
            <TaskDetail id={router.query.id as string} />
        </DashboardLayout>
    );
}
