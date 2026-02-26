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
        'bg-blue-500':
            invoiceType === ExpenseInvoiceType.FacturaPapel,
        'bg-green-500':
            invoiceType === ExpenseInvoiceType.FacturaElectronicaAdjunta,
        'bg-purple-500':
            invoiceType === ExpenseInvoiceType.FacturaViaMailOWhatsapp,
        'bg-gray-500': invoiceType === ExpenseInvoiceType.SinFactura,
    });

    return (
        <Badge variant="default" className={contentStyle}>
            <span className={contentStyle}></span>
            <span>{capitalizeFirstLetter(pascalCaseToSpaces(invoiceType))}</span>
        </Badge>
    );
};

export default ExpenseInvoiceTypeBadge;
