import { createColumnHelper } from '@tanstack/react-table';

import { BillingTableRowActions } from './billing-table-row-actions';

import { BillStatus, BillStatusBadge } from '@/components/ui/Badges/BillStatusBadge';

export type Bill = {
    id: string;
    businessName: string;
    contactName: string;
    contactEmail: string;
    billingEmail: string;
    description: string;
    status: BillStatus;
    amount: number;
};

const columnHelper = createColumnHelper<Bill>();

export const useBillingTableColumns = () => [
    columnHelper.accessor('businessName', {
        header: 'Empresa',
    }),
    columnHelper.accessor('contactName', {
        header: 'Nombre de contacto',
    }),
    columnHelper.accessor('contactEmail', {
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
    columnHelper.accessor('billingEmail', {
        header: 'Email de facturación',
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
    columnHelper.accessor('description', {
        header: 'Descripción',
        cell: (info) => {
            let description = info.getValue();
            const maxLength = 50;
            if (description.length > maxLength) {
                description = `${description.slice(0, maxLength)}...`;
            }
            return <p className="max-w-[250px] text-muted-foreground">{description}</p>;
        },
    }),
    columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => <BillStatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('amount', {
        header: 'Monto',
        cell: (info) =>
            info.getValue().toLocaleString('es-AR', {
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
