import React from 'react';
import { Badge } from './badge';
import { ExpenseType } from '@/api/graphql';
import clsx from 'clsx';

type Props = {
    type: ExpenseType;
};

const ExpenseTypeBadge = ({ type }: Props) => {
    const contentStyle = clsx({
        'bg-green-500': type === ExpenseType.Combustible,
        'bg-yellow-500': type === ExpenseType.Comida,
        'bg-blue-500': type === ExpenseType.Hospedaje,
        'bg-red-500': type === ExpenseType.Herramienta,
        'bg-orange-500': type === ExpenseType.Insumos,
        'bg-purple-500': type === ExpenseType.Otro,
    });
    return (
        <Badge variant="default" className={contentStyle}>
            <span className={contentStyle}></span>
            <span>{type}</span>
        </Badge>
    );
};

export default ExpenseTypeBadge;
