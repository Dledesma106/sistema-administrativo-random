import clsx from 'clsx';

import { Badge } from '@/components/ui/Badges/badge';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

import { BillStatus } from '@/api/graphql';

interface BillStatusBadgeProps {
    status: BillStatus;
}

export function BillStatusBadge({ status }: BillStatusBadgeProps) {
    const contentStyle = clsx({
        'bg-success': status === BillStatus.Pagada,
        'bg-yellow-500': status === BillStatus.Pendiente,
        'bg-blue-400': status === BillStatus.Borrador,
        'bg-red-500': status === BillStatus.Vencida,
    });

    return (
        <Badge className={contentStyle} variant="default">
            <span className={contentStyle} />
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(status))}</span>
        </Badge>
    );
}
