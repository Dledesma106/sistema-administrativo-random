import { createColumnHelper } from '@tanstack/react-table';

import { ServiceOrdersTableRowActions } from './service-orders-table-row-actions';

import type { ServiceOrder } from '@/api/graphql';
import { ServiceOrderStatusBadge } from '@/components/ui/Badges/ServiceOrderStatusBadge';

export type { ServiceOrder };

const columnHelper = createColumnHelper<ServiceOrder>();

export const useServiceOrdersTableColumns = () => [
    columnHelper.accessor('serviceOrderNumber', {
        header: 'Número',
        cell: (info) => `OS-${String(info.getValue()).padStart(3, '0')}`,
    }),
    columnHelper.display({
        id: 'businessName',
        header: 'Empresa',
        cell: (info) => info.row.original.business?.name || '-',
    }),
    columnHelper.display({
        id: 'clientName',
        header: 'Cliente',
        cell: (info) =>
            info.row.original.clientName || info.row.original.client?.name || '-',
    }),
    columnHelper.display({
        id: 'branch',
        header: 'Sucursal',
        cell: (info) => {
            const { branch, customBranch } = info.row.original;

            // Priorizar customBranch si existe
            if (customBranch) {
                const parts = [];
                if (customBranch.number) {
                    parts.push(`#${customBranch.number}`);
                }
                if (customBranch.name) {
                    parts.push(customBranch.name);
                }
                return parts.length > 0 ? parts.join(' - ') : '-';
            }

            // Si no hay customBranch, usar branch
            if (branch) {
                const parts = [];
                if (branch.number) {
                    parts.push(`#${branch.number}`);
                }
                if (branch.name) {
                    parts.push(branch.name);
                } else if (branch.city) {
                    parts.push(`${branch.city.name}, ${branch.city.province.name}`);
                }
                return parts.length > 0 ? parts.join(' - ') : '-';
            }

            return '-';
        },
    }),
    columnHelper.accessor('description', {
        header: 'Descripción',
        cell: (info) => {
            const description = info.getValue();
            const maxLength = 67;
            const displayText =
                description && description.length > maxLength
                    ? `${description.slice(0, maxLength)}...`
                    : description || '-';
            return <p className="max-w-[250px] text-muted-foreground">{displayText}</p>;
        },
    }),
    columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => <ServiceOrderStatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
            <div className="flex w-full justify-end">
                <ServiceOrdersTableRowActions serviceOrder={row.original} />
            </div>
        ),
    }),
];
