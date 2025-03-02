import { createColumnHelper } from '@tanstack/react-table';

import { CitiesTableRowActions } from './cities-table-row-actions';

import { GetCitiesQuery } from '@/api/graphql';

type City = GetCitiesQuery['cities'][number];

const columnHelper = createColumnHelper<City>();

export const useCitiesTableColumns = () => [
    columnHelper.accessor('name', {
        header: 'Nombre',
    }),
    columnHelper.accessor('province.name', {
        header: 'Provincia',
    }),
    columnHelper.accessor('province.id', {
        id: 'provinceId',
        enableHiding: true,
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => <CitiesTableRowActions city={props.row.original} />,
    }),
];
