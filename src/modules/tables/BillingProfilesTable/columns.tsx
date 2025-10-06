import { createColumnHelper } from '@tanstack/react-table';

import { BillingProfilesTableRowActions } from './billing-profiles-table-row-actions';

import { GetBillingProfilesQuery } from '@/api/graphql';

// Tipo específico para la tabla usando el tipo generado por GraphQL CodeGen
export type ColumnBillingProfile = NonNullable<
    GetBillingProfilesQuery['billingProfiles']
>[0];

const columnHelper = createColumnHelper<ColumnBillingProfile>();

export const useBillingProfilesTableColumns = () => [
    columnHelper.accessor('business.name', {
        header: 'Empresa',
    }),
    columnHelper.accessor('CUIT', {
        header: 'CUIT',
    }),
    columnHelper.accessor('firstContact.fullName', {
        header: 'Contacto',
    }),
    columnHelper.accessor('firstContact.email', {
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
