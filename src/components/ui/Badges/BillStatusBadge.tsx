import clsx from 'clsx';

import { Badge } from '@/components/ui/Badges/badge';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

export type BillStatus = 'Borrador' | 'Pendiente' | 'Pagada' | 'Vencida';

interface BillStatusBadgeProps {
    status: BillStatus;
}

export function BillStatusBadge({ status }: BillStatusBadgeProps) {
    const contentStyle = clsx({
        'h-2 w-2 rounded-full bg-success': status === 'Pagada',
        'h-2 w-2 rounded-full bg-yellow-500': status === 'Pendiente',
        'h-2 w-2 rounded-full bg-blue-400': status === 'Borrador',
        'h-2 w-2 rounded-full bg-red-500': status === 'Vencida',
    });

    return (
        <Badge className="gap-2" variant="default">
            <span className={contentStyle} />
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(status))}</span>
        </Badge>
    );
}
