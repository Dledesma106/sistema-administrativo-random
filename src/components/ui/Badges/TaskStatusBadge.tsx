import { TaskStatus } from '@prisma/client';
import clsx from 'clsx';

import { Badge } from '@/components/ui/Badges/badge';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

interface TaskStatusBadgeProps {
    status: TaskStatus;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
    const contentStyle = clsx({
        'bg-success': status === TaskStatus.Aprobada,
        'bg-yellow-500': status === TaskStatus.Pendiente,
        'bg-blue-400': status === TaskStatus.Finalizada,
        'bg-destructive': status === TaskStatus.SinAsignar,
    });

    return (
        <Badge className={contentStyle} variant="default">
            <span className={contentStyle} />
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(status))}</span>
        </Badge>
    );
}
