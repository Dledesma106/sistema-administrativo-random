import clsx from 'clsx';

import { Badge } from '@/components/ui/Badges/badge';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

export type ServiceOrderStatus = 'Pendiente' | 'EnProgreso' | 'Finalizado';

interface ServiceOrderStatusBadgeProps {
    status: ServiceOrderStatus;
}

export function ServiceOrderStatusBadge({ status }: ServiceOrderStatusBadgeProps) {
    const contentStyle = clsx({
        'h-2 w-2 rounded-full bg-success': status === 'EnProgreso',
        'h-2 w-2 rounded-full bg-yellow-500': status === 'Pendiente',
        'h-2 w-2 rounded-full bg-blue-400': status === 'Finalizado',
    });

    return (
        <Badge className="gap-2" variant="default">
            <span className={contentStyle} />
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(status))}</span>
        </Badge>
    );
}
