import React from 'react';
import { Badge } from './badge';
import { ExpensePaySourceBank } from '@/api/graphql';
import clsx from 'clsx';

type Props = {
    paySourceBank: ExpensePaySourceBank;
};

const ExpensePaySourceBankBadge = ({ paySourceBank }: Props) => {
    const contentStyle = clsx({
        'bg-blue-500': paySourceBank === ExpensePaySourceBank.Bbva,
        'bg-red-500':
            paySourceBank === ExpensePaySourceBank.Santander,
        'bg-green-500':
            paySourceBank === ExpensePaySourceBank.Nacion,
        'bg-purple-500': paySourceBank === ExpensePaySourceBank.Otro,
        'bg-yellow-500':
            paySourceBank === ExpensePaySourceBank.Chubut,
    });
    return (
        <Badge variant="default" className={contentStyle}>
            <span className={contentStyle}></span>
            <span>{paySourceBank}</span>
        </Badge>
    );
};

export default ExpensePaySourceBankBadge;
