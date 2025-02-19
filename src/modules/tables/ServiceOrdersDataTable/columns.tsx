import { createColumnHelper } from '@tanstack/react-table';

import { ServiceOrdersTableRowActions } from './service-orders-table-row-actions';

import { ServiceOrderStatusBadge } from '@/components/ui/Badges/ServiceOrderStatusBadge';

export type ServiceOrder = {
    id: string;
    orderNumber: string;
    businessName: string;
    clientName: string;
    branch?: {
        number: string;
        city: {
            name: string;
            province: {
                name: string;
            };
        };
    };
    description: string;
    status: 'Pendiente' | 'EnProgreso' | 'Finalizado';
};

const columnHelper = createColumnHelper<ServiceOrder>();

export const useServiceOrdersTableColumns = () => [
    columnHelper.accessor('orderNumber', {
        header: 'Número',
    }),
    columnHelper.accessor('businessName', {
        header: 'Empresa',
    }),
    columnHelper.accessor('clientName', {
        header: 'Cliente',
    }),
    columnHelper.accessor('branch', {
        header: 'Sucursal',
        cell: (info) => {
            const branch = info.getValue();
            if (!branch) {
                return '-';
            }
            return `#${branch.number} - ${branch.city.name}, ${branch.city.province.name}`;
        },
    }),
    columnHelper.accessor('description', {
        header: 'Descripción',
        cell: (info) => {
            let description = info.getValue();
            const maxLength = 67;
            if (description.length > maxLength) {
                description = `${description.slice(0, maxLength)}...`;
            }
            return <p className="max-w-[250px] text-muted-foreground">{description}</p>;
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
