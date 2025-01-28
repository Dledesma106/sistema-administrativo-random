import clsx from 'clsx';

import { Badge } from './badge';

export enum BudgetStatus {
    Enviado = 'Enviado',
    Recibido = 'Recibido',
    Aprobado = 'Aprobado',
    Rechazado = 'Rechazado',
}

type Props = {
    status: BudgetStatus;
};

const BudgetStatusBadge = ({ status }: Props) => {
    const contentStyle = clsx({
        'h-2 w-2 rounded-full bg-yellow-500': status === BudgetStatus.Enviado,
        'h-2 w-2 rounded-full bg-blue-500': status === BudgetStatus.Recibido,
        'h-2 w-2 rounded-full bg-green-500': status === BudgetStatus.Aprobado,
        'h-2 w-2 rounded-full bg-red-500': status === BudgetStatus.Rechazado,
    });

    return (
        <Badge variant="outline" className="space-x-2">
            <span className={contentStyle}></span>
            <span>{status}</span>
        </Badge>
    );
};

export default BudgetStatusBadge; 