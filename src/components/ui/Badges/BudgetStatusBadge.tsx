import clsx from 'clsx';

import { Badge } from './badge';
import { BudgetStatus } from '@/api/graphql';

type Props = {
    status: BudgetStatus;
};

const BudgetStatusBadge = ({ status }: Props) => {
    const contentStyle = clsx({
        'bg-yellow-500': status === BudgetStatus.Enviado,
        'bg-blue-500': status === BudgetStatus.Borrador,
        'bg-green-500': status === BudgetStatus.Aprobado,
        'bg-purple-500': status === BudgetStatus.Expirado,
        'bg-red-500': status === BudgetStatus.Rechazado,
    });

    return (
        <Badge variant="default" className={contentStyle}>
            <span className={contentStyle}></span>
            <span>{status}</span>
        </Badge>
    );
};

export default BudgetStatusBadge;
