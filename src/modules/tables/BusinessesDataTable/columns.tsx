import { createColumnHelper } from '@tanstack/react-table';

import { BusinessesTableRowActions } from './businesses-table-row-actions';

import { GetBusinessesQuery } from '@/api/graphql';

type Business = GetBusinessesQuery['businesses'][number];

const columnHelper = createColumnHelper<Business>();

export const useBusinessesTableColumns = () => [
    columnHelper.accessor('name', {
        header: 'Nombre',
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => <BusinessesTableRowActions business={props.row.original} />,
    }),
];
