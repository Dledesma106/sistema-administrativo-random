import clsx from 'clsx';

import { Badge } from '@/components/ui/Badges/badge';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

import { ServiceOrderStatus } from '@/api/graphql';

interface ServiceOrderStatusBadgeProps {
    status: ServiceOrderStatus;
}

export function ServiceOrderStatusBadge({ status }: ServiceOrderStatusBadgeProps) {
    const contentStyle = clsx({
        'h-2 w-2 rounded-full bg-success': status === ServiceOrderStatus.EnProgreso,
        'h-2 w-2 rounded-full bg-yellow-500': status === ServiceOrderStatus.Pendiente,
        'h-2 w-2 rounded-full bg-blue-400': status === ServiceOrderStatus.Finalizada,
        'h-2 w-2 rounded-full bg-orange-500': status === ServiceOrderStatus.ParaFacturar,
    });

    return (
        <Badge className="gap-2" variant="default">
            <span className={contentStyle} />
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(status))}</span>
        </Badge>
    );
}
