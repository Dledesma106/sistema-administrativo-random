import React from 'react';
import { Badge } from './badge';
import { ExpenseInvoiceType } from '@/api/graphql';
import clsx from 'clsx';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

type Props = {
    invoiceType: ExpenseInvoiceType;
};

const ExpenseInvoiceTypeBadge = ({ invoiceType }: Props) => {
    const contentStyle = clsx({
        'h-2 w-2 rounded-full bg-blue-500':
            invoiceType === ExpenseInvoiceType.FacturaPapel,
        'h-2 w-2 rounded-full bg-green-500':
            invoiceType === ExpenseInvoiceType.FacturaElectronicaAdjunta,
        'h-2 w-2 rounded-full bg-purple-500':
            invoiceType === ExpenseInvoiceType.FacturaViaMailOWhatsapp,
        'h-2 w-2 rounded-full bg-gray-500': invoiceType === ExpenseInvoiceType.SinFactura,
    });

    return (
        <Badge variant="default" className="gap-2">
            <span className={contentStyle}></span>
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(invoiceType))}</span>
        </Badge>
    );
};

export default ExpenseInvoiceTypeBadge;
