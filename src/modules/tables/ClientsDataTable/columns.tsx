import { createColumnHelper } from '@tanstack/react-table';

import { ClientsTableRowActions } from './clients-table-row-actions';

import { GetClientsQuery } from '@/api/graphql';

type Client = GetClientsQuery['clients'][number];

const columnHelper = createColumnHelper<Client>();

export const useClientsTableColumns = () => [
    columnHelper.accessor('name', {
        header: 'Nombre',
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Acciones',
        cell: (props) => <ClientsTableRowActions client={props.row.original} />,
    }),
];
