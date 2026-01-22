import clsx from 'clsx';

import { Badge } from '@/components/ui/Badges/badge';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

import { ServiceOrderStatus } from '@/api/graphql';

interface ServiceOrderStatusBadgeProps {
    status: ServiceOrderStatus;
}

export function ServiceOrderStatusBadge({ status }: ServiceOrderStatusBadgeProps) {
    const contentStyle = clsx({
        'bg-success': status === ServiceOrderStatus.EnProgreso,
        'bg-yellow-500': status === ServiceOrderStatus.Pendiente,
        'bg-blue-400': status === ServiceOrderStatus.Finalizada,
        'bg-orange-500': status === ServiceOrderStatus.ParaFacturar,
    });

    return (
        <Badge className={contentStyle} variant="default">
            <span className={contentStyle} />
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(status))}</span>
        </Badge>
    );
}
