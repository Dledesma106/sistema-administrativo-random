import React from 'react';
import { Badge } from './badge';
import { ExpensePaySource, ExpensePaySourceBank } from '@/api/graphql';
import clsx from 'clsx';

type Props = {
    paySource: ExpensePaySource;
    installments: number | null;
    paySourceBank: ExpensePaySourceBank | null;
};

const ExpensePaySourceBadge = ({ paySource, paySourceBank, installments }: Props) => {
    const contentStyle = clsx({
        'bg-blue-500': paySource === ExpensePaySource.Debito,
        'bg-red-500': paySource === ExpensePaySource.Credito,
        'bg-green-500': paySource === ExpensePaySource.Transferencia,
        'bg-purple-500': paySource === ExpensePaySource.Otro,
        'bg-yellow-500': paySource === ExpensePaySource.Reintegro,
    });
    return (
        <Badge variant="default" className={contentStyle}>
            <span className={contentStyle}></span>
            <span>
                {paySource}
                {paySourceBank !== null ? ` - ${paySourceBank}` : ''}
                {paySource === ExpensePaySource.Credito &&
                    installments !== null &&
                    ` - ${installments} Cuota${installments > 1 ? 's' : ''}`}
            </span>
        </Badge>
    );
};

export default ExpensePaySourceBadge;
