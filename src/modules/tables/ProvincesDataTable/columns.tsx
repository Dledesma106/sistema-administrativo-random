import { createColumnHelper } from '@tanstack/react-table';

import { ProvincesTableRowActions } from './provinces-table-row-actions';

import { GetProvincesQuery } from '@/api/graphql';

type Province = GetProvincesQuery['provinces'][number];

const columnHelper = createColumnHelper<Province>();

export const useProvincesTableColumns = () => [
    columnHelper.accessor('name', {
        header: 'Nombre',
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => <ProvincesTableRowActions province={props.row.original} />,
    }),
];
