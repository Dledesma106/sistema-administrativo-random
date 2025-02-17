import { createColumnHelper } from '@tanstack/react-table';

import { BillingProfilesTableRowActions } from './billing-profiles-table-row-actions';

export type BillingProfile = {
    id: string;
    businessName: string;
    cuit: string;
    contactName: string;
    contactEmail: string;
    billingEmail: string;
};

const columnHelper = createColumnHelper<BillingProfile>();

export const useBillingProfilesTableColumns = () => [
    columnHelper.accessor('businessName', {
        header: 'Empresa',
    }),
    columnHelper.accessor('cuit', {
        header: 'CUIT',
    }),
    columnHelper.accessor('contactName', {
        header: 'Contacto',
    }),
    columnHelper.accessor('contactEmail', {
        header: 'Email de contacto',
        cell: (info) => (
            <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${info.getValue()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
            >
                {info.getValue()}
            </a>
        ),
    }),
    columnHelper.accessor('billingEmail', {
        header: 'Email de facturación',
        cell: (info) => (
            <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${info.getValue()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
            >
                {info.getValue()}
            </a>
        ),
    }),
    columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
            <div className="flex w-full justify-end">
                <BillingProfilesTableRowActions profile={row.original} />
            </div>
        ),
    }),
];
