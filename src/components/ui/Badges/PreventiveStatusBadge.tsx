import { PreventiveStatus } from '@prisma/client';
import clsx from 'clsx';

import { Badge } from '@/components/ui/Badges/badge';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

interface PreventiveStatusBadgeProps {
    status: PreventiveStatus;
}

export function PreventiveStatusBadge({ status }: PreventiveStatusBadgeProps) {
    const contentStyle = clsx({
        'bg-success': status === PreventiveStatus.AlDia,
        'bg-yellow-500': status === PreventiveStatus.Pendiente,
    });

    return (
        <Badge className={contentStyle} variant="default">
            <span className={contentStyle} />
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(status))}</span>
        </Badge>
    );
}
