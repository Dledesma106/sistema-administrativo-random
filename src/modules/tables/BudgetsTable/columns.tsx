import { createColumnHelper } from '@tanstack/react-table';

type Budget = {
    id: string;
    company: string;
    description: string;
    price: number;
    // Puedes agregar más campos según necesites
};

const columnHelper = createColumnHelper<Budget>();

export const useBudgetsTableColumns = () => [
    columnHelper.accessor('company', {
        header: 'Empresa',
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
    columnHelper.accessor('price', {
        header: 'Precio',
        cell: (info) => {
            const price = info.getValue();
            return price.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
            });
        },
    }),
];
