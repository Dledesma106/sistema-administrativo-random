import { TaskType } from '@prisma/client';
import clsx from 'clsx';

import { Badge } from '@/components/ui/Badges/badge';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

interface TaskTypeBadgeProps {
    type: TaskType;
}

export function TaskTypeBadge({ type }: TaskTypeBadgeProps) {
    const contentStyle = clsx({
        'h-2 w-2 rounded-full bg-green-500': type === TaskType.Preventivo,
        'h-2 w-2 rounded-full bg-red-500': type === TaskType.Correctivo,
        'h-2 w-2 rounded-full bg-blue-500': type === TaskType.Instalacion,
        'h-2 w-2 rounded-full bg-yellow-500': type === TaskType.Desmonte,
        'h-2 w-2 rounded-full bg-purple-500': type === TaskType.Actualizacion,
        'h-2 w-2 rounded-full bg-orange-500': type === TaskType.InspeccionPolicial,
    });

    return (
        <Badge className="gap-2 whitespace-nowrap" variant="default">
            <span className={contentStyle} />
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(type))}</span>
        </Badge>
    );
}
