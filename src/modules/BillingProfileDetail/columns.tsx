import { GetBillingProfileByIdQuery } from '@/api/graphql';
import { BillStatusBadge } from '@/components/ui/Badges/BillStatusBadge';
import { Column } from '@/components/ui/data-list';

type Bill = NonNullable<
    GetBillingProfileByIdQuery['billingProfileById']
>['bills'][number];

export const billColumns: Column<Bill>[] = [
    {
        header: 'Número',
        cell: (bill) => {
            if (bill.pointOfSale && bill.caeData?.code) {
                return `${bill.pointOfSale.toString().padStart(4, '0')}-${bill.caeData.code.padStart(8, '0')}`;
            }
            if (bill.caeData?.code) {
                return bill.caeData.code.padStart(8, '0');
            }
            return `#${bill.id}`;
        },
        accessorKey: 'id' as const,
    },
    {
        header: 'Monto',
        cell: (bill) => {
            const total = bill.totalAmount || 0;
            return `$${total.toLocaleString('es-AR')}`;
        },
        accessorKey: 'details' as const,
    },
    {
        header: 'Estado',
        cell: (bill) => (bill.status ? <BillStatusBadge status={bill.status} /> : 'N/A'),
        accessorKey: 'status' as const,
    },
    {
        header: 'Fecha de emisión',
        cell: (bill) =>
            bill.emissionDate
                ? new Date(bill.emissionDate).toLocaleDateString('es-AR')
                : 'N/A',
        accessorKey: 'emissionDate' as const,
    },
    {
        header: 'Fecha de vencimiento',
        cell: (bill) =>
            bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('es-AR') : 'N/A',
        accessorKey: 'dueDate' as const,
    },
    {
        header: 'Descripción',
        cell: (bill) => bill.description || 'Sin descripción',
        accessorKey: 'description' as const,
    },
];
