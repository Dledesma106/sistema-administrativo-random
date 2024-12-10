import React from 'react';
import { Badge } from './badge';
import { ExpenseStatus } from '@/api/graphql';
import clsx from 'clsx';

type Props = {
    status: ExpenseStatus;
};

const ExpenseStatusBadge = ({ status }: Props) => {
    const contentStyle = clsx({
        'h-2 w-2 rounded-full bg-green-500': status === ExpenseStatus.Aprobado,
        'h-2 w-2 rounded-full bg-yellow-500': status === ExpenseStatus.Enviado,
        'h-2 w-2 rounded-full bg-red-500': status === ExpenseStatus.Rechazado,
    });
    return (
        <Badge variant="outline" className="space-x-2">
            <span className={contentStyle}></span>
            <span>{status}</span>
        </Badge>
    );
};

export default ExpenseStatusBadge;
