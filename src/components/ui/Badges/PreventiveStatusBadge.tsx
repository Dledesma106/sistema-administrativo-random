import { PreventiveStatus } from '@prisma/client';
import clsx from 'clsx';

import { Badge } from '@/components/ui/Badges/badge';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

interface PreventiveStatusBadgeProps {
    status: PreventiveStatus;
}

export function PreventiveStatusBadge({ status }: PreventiveStatusBadgeProps) {
    const contentStyle = clsx({
        'h-2 w-2 rounded-full bg-success': status === PreventiveStatus.AlDia,
        'h-2 w-2 rounded-full bg-yellow-500': status === PreventiveStatus.Pendiente,
    });

    return (
        <Badge className="gap-2 min-w-[75px]" variant="default">
            <span className={contentStyle} />
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(status))}</span>
        </Badge>
    );
}
