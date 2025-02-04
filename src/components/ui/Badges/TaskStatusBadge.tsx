import { TaskStatus } from '@prisma/client';
import clsx from 'clsx';

import { Badge } from '@/components/ui/Badges/badge';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

interface TaskStatusBadgeProps {
    status: TaskStatus;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
    const contentStyle = clsx({
        'h-2 w-2 rounded-full bg-success': status === TaskStatus.Aprobada,
        'h-2 w-2 rounded-full bg-yellow-500': status === TaskStatus.Pendiente,
        'h-2 w-2 rounded-full bg-blue-400': status === TaskStatus.Finalizada,
        'h-2 w-2 rounded-full bg-destructive': status === TaskStatus.SinAsignar,
    });

    return (
        <Badge
            className="inline-flex space-x-2 whitespace-nowrap"
            variant="outline"
        >
            <span className={contentStyle} />
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(status))}</span>
        </Badge>

    );
} 