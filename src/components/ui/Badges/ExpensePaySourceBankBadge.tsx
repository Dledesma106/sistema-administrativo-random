import React from 'react'
import { Badge } from './badge'
import { ExpensePaySourceBank } from '@/api/graphql'
import clsx from 'clsx';

type Props = {
    paySourceBank: ExpensePaySourceBank;
}

const ExpensePaySourceBankBadge = ({ paySourceBank }: Props) => {
    const contentStyle = clsx({
      'h-2 w-2 rounded-full bg-blue-500': paySourceBank === ExpensePaySourceBank.Bbva,
      'h-2 w-2 rounded-full bg-red-500': paySourceBank === ExpensePaySourceBank.Santander,
      'h-2 w-2 rounded-full bg-green-500': paySourceBank === ExpensePaySourceBank.Nacion,
      'h-2 w-2 rounded-full bg-purple-500': paySourceBank === ExpensePaySourceBank.Otro,
      "h-2 w-2 rounded-full bg-yellow-500": paySourceBank === ExpensePaySourceBank.Chubut
    })
  return (
    <Badge variant="outline" className="space-x-2">                                  
        <span className={contentStyle}></span>
        <span>{paySourceBank}</span>
    </Badge>
  )
}

export default ExpensePaySourceBankBadge