import React from 'react';
import { Badge } from './badge';
import { ExpenseStatus } from '@/api/graphql';
import clsx from 'clsx';

type Props = {
    status: ExpenseStatus;
};

const ExpenseStatusBadge = ({ status }: Props) => {
    const contentStyle = clsx({
        'bg-green-500': status === ExpenseStatus.Aprobado,
        'bg-yellow-500': status === ExpenseStatus.Enviado,
        'bg-red-500': status === ExpenseStatus.Rechazado,
    });
    return (
        <Badge variant="default" className={contentStyle}>
            <span className={contentStyle}></span>
            <span>{status}</span>
        </Badge>
    );
};

export default ExpenseStatusBadge;
