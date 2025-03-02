import React from 'react';
import { Badge } from './badge';
import { ExpenseType } from '@/api/graphql';
import clsx from 'clsx';

type Props = {
    type: ExpenseType;
};

const ExpenseTypeBadge = ({ type }: Props) => {
    const contentStyle = clsx({
        'h-2 w-2 rounded-full bg-green-500': type === ExpenseType.Combustible,
        'h-2 w-2 rounded-full bg-yellow-500': type === ExpenseType.Comida,
        'h-2 w-2 rounded-full bg-blue-500': type === ExpenseType.Hospedaje,
        'h-2 w-2 rounded-full bg-red-500': type === ExpenseType.Herramienta,
        'h-2 w-2 rounded-full bg-orange-500': type === ExpenseType.Insumos,
        'h-2 w-2 rounded-full bg-purple-500': type === ExpenseType.Otro,
    });
    return (
        <Badge variant="default" className="gap-2">
            <span className={contentStyle}></span>
            <span>{type}</span>
        </Badge>
    );
};

export default ExpenseTypeBadge;
