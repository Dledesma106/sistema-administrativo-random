import { createColumnHelper } from '@tanstack/react-table';

import { BillingTableRowActions } from './billing-table-row-actions';

import { GetBillsQuery } from '@/api/graphql';
import { BillStatusBadge } from '@/components/ui/Badges/BillStatusBadge';

export type Bill = GetBillsQuery['bills'][number];

const columnHelper = createColumnHelper<Bill>();

export const useBillingTableColumns = () => [
    columnHelper.accessor('business.name', {
        header: 'Empresa',
    }),
    columnHelper.accessor('billingProfile.firstContact.fullName', {
        header: 'Nombre de contacto',
    }),
    columnHelper.accessor('billingProfile.firstContact.email', {
        header: 'Email de contacto',
        cell: (info) => (
            <a
                href={`mailto:${info.getValue()}`}
                className="text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
            >
                {info.getValue()}
            </a>
        ),
    }),
    columnHelper.accessor('billingProfile.billingEmails', {
        header: 'Emails de facturación',
        cell: (info) => (
            <div className="flex flex-col gap-1">
                {info.getValue().map((email) => (
                    <a
                        href={`mailto:${email}`}
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                        key={email}
                    >
                        {email}
                    </a>
                ))}
            </div>
        ),
    }),
    columnHelper.accessor('description', {
        header: 'Descripción',
        cell: (info) => {
            let description = info.getValue();
            if (!description) {
                return <span className="text-muted-foreground">-</span>;
            }
            const maxLength = 50;
            if (description.length > maxLength) {
                description = `${description?.slice(0, maxLength)}...`;
            }
            return <p className="max-w-[250px] text-muted-foreground">{description}</p>;
        },
    }),
    columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => <BillStatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('totalAmount', {
        header: 'Monto',
        cell: (info) =>
            info?.getValue()?.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
            }),
    }),
    columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
            <div className="flex w-full justify-end">
                <BillingTableRowActions bill={row.original} />
            </div>
        ),
    }),
];
