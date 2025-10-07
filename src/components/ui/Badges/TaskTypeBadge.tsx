import { TaskType } from '@prisma/client';
import clsx from 'clsx';

import { Badge } from '@/components/ui/Badges/badge';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';
import { useRouter } from 'next/router';

import { PreventiveFrequency } from '@/api/graphql';

interface TaskTypeBadgeProps {
    type: TaskType;
    frequency?: PreventiveFrequency;
    link?: string;
}

export function TaskTypeBadge({ type, link, frequency }: TaskTypeBadgeProps) {
    const contentStyle = clsx({
        'bg-green-500': type === TaskType.Preventivo,
        'bg-red-500': type === TaskType.Correctivo,
        'bg-blue-500': type === TaskType.Instalacion,
        'bg-yellow-500': type === TaskType.Desmonte,
        'bg-purple-500': type === TaskType.Actualizacion,
        'bg-orange-500': type === TaskType.InspeccionPolicial,
        'whitespace-nowrap': true,
    });

    const router = useRouter();

    return (
        <Badge
            onClick={(e) => {
                e.stopPropagation();
                link && router.push(link);
            }}
            className={contentStyle}
            variant="default"
        >
            <span className={contentStyle} />
            <span>
                {capitalizeFirstLetter(pascalCaseToSpaces(type))}{' '}
                {frequency && `${frequency}`}
            </span>
        </Badge>
    );
}
