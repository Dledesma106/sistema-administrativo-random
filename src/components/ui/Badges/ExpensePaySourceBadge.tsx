import React from 'react'
import { Badge } from './badge'
import { ExpensePaySource } from '@/api/graphql'
import clsx from 'clsx';

type Props = {
    paySource: ExpensePaySource;
}

const ExpensePaySourceBadge = ({ paySource }: Props) => {
    const contentStyle = clsx({'h-2 w-2 rounded-full bg-green-500': paySource === ExpensePaySource.Tarjeta, "h-2 w-2 rounded-full bg-yellow-500": paySource === ExpensePaySource.Reintegro})
  return (
    <Badge variant="outline" className="space-x-2">                                  
        <span className={contentStyle}></span>
        <span>{paySource}</span>
    </Badge>
  )
}

export default ExpensePaySourceBadge