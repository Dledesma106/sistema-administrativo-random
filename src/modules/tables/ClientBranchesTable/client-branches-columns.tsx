import { createColumnHelper } from '@tanstack/react-table';

import { RowActions } from './client-branches-table-row-actions';

import { GetClientBranchesQuery, GetClientQuery } from '@/api/graphql';
import { Badge } from '@/components/ui/Badges/badge';

const columnHelper = createColumnHelper<GetClientBranchesQuery['clientBranches'][0]>();

export const getClientBranchesTableColumns = (client: GetClientQuery['client']) => [
    columnHelper.accessor((row) => row.number, {
        id: 'number',
        header: 'Número',
    }),
    columnHelper.accessor((row) => row.city, {
        id: 'city',
        header: 'Ciudad',
        cell: (info) => {
            const city = info.getValue();

            return <p>{city.name}</p>;
        },
        filterFn: (row, id, ids: string[]) => {
            if (!ids) {
                return true;
            }

            return ids.includes(
                row.getValue<GetClientBranchesQuery['clientBranches'][0]['city']>('city')
                    .id,
            );
        },
    }),
    columnHelper.accessor((row) => row.businesses, {
        id: 'businesses',
        header: 'Empresas',
        cell: (info) => {
            const businesses = info.getValue();

            if (businesses.length === 0) {
                return <p className="text-muted-foreground">Sin empresas</p>;
            }

            return (
                <div className="-ml-2 -mt-2 flex flex-wrap">
                    {businesses.map((business) => {
                        return (
                            <Badge
                                variant="default"
                                key={business.id}
                                className="ml-2 mt-2"
                            >
                                {business.name}
                            </Badge>
                        );
                    })}
                </div>
            );
        },
        filterFn: (row, id, ids: string[]) => {
            if (!ids) {
                return true;
            }

            const assigned = row.getValue<GetClientBranchesQuery['clientBranches']>(id);
            const assignedIsInFilteredList = assigned.some((user) => {
                return ids.includes(user.id);
            });

            return assignedIsInFilteredList;
        },
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => {
            const branch = props.row.original;

            return <RowActions branch={branch} client={client} />;
        },
    }),
];
