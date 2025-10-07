import clsx from 'clsx';

import { Badge } from './badge';
import { BudgetStatus } from '@/api/graphql';

type Props = {
    status: BudgetStatus;
};

const BudgetStatusBadge = ({ status }: Props) => {
    const contentStyle = clsx({
        'h-2 w-2 rounded-full bg-yellow-500': status === BudgetStatus.Enviado,
        'h-2 w-2 rounded-full bg-blue-500': status === BudgetStatus.Borrador,
        'h-2 w-2 rounded-full bg-green-500': status === BudgetStatus.Aprobado,
        'h-2 w-2 rounded-full bg-purple-500': status === BudgetStatus.Expirado,
        'h-2 w-2 rounded-full bg-red-500': status === BudgetStatus.Rechazado,
    });

    return (
        <Badge variant="default" className="gap-2">
            <span className={contentStyle}></span>
            <span>{status}</span>
        </Badge>
    );
};

export default BudgetStatusBadge;
