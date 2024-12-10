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
        'h-2 w-2 rounded-full bg-blue-500': paySource === ExpensePaySource.Debito,
        'h-2 w-2 rounded-full bg-red-500': paySource === ExpensePaySource.Credito,
        'h-2 w-2 rounded-full bg-green-500': paySource === ExpensePaySource.Transferencia,
        'h-2 w-2 rounded-full bg-purple-500': paySource === ExpensePaySource.Otro,
        'h-2 w-2 rounded-full bg-yellow-500': paySource === ExpensePaySource.Reintegro,
    });
    return (
        <Badge variant="outline" className="space-x-2">
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
