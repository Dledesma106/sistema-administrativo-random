import { GetBillByIdQuery } from '@/api/graphql';
import { Column } from '@/components/ui/data-list';
import { calculateIVAAmount, AlicuotaIVALabel } from '@/lib/utils';

type Detail = NonNullable<GetBillByIdQuery['bill']>['details'][number];

export const billDetailColumns: Column<Detail>[] = [
    {
        header: 'Descripción',
        cell: (d) => d.description,
        accessorKey: 'description' as const,
    },
    {
        header: 'Cantidad',
        cell: (d) => d.quantity,
        accessorKey: 'quantity' as const,
    },
    {
        header: 'Precio unitario',
        cell: (d) =>
            d.unitPrice.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
            }),
        accessorKey: 'unitPrice' as const,
    },
    {
        header: 'Subtotal',
        cell: (d) => {
            const subtotal = d.quantity * d.unitPrice;
            return subtotal.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
            });
        },
        accessorKey: 'unitPrice' as const,
    },
    {
        header: 'IVA',
        cell: (d) => AlicuotaIVALabel(d.alicuotaIVA),
        accessorKey: 'alicuotaIVA' as const,
    },
    {
        header: 'IVA (monto)',
        cell: (d) => {
            const subtotal = d.quantity * d.unitPrice;
            const iva = calculateIVAAmount(subtotal, d.alicuotaIVA);
            return iva.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
            });
        },
        accessorKey: 'alicuotaIVA' as const,
    },
    {
        header: 'Total',
        cell: (d) => {
            const subtotal = d.quantity * d.unitPrice;
            const iva = calculateIVAAmount(subtotal, d.alicuotaIVA);
            const total = subtotal + iva;
            return total.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
            });
        },
        accessorKey: 'unitPrice' as const,
    },
    {
        header: 'Tarea',
        cell: (d) => (d.task ? `#${d.task.taskNumber}` : d.taskId || '-'),
        accessorKey: 'taskId' as const,
    },
];
