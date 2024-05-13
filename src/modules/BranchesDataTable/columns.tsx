import Link from 'next/link';

import { createColumnHelper } from '@tanstack/react-table';


import { BranchesQuery } from '@/api/graphql';
import { routesBuilder } from '@/lib/routes';

type Branch = BranchesQuery['branches'][0];

const columnHelper = createColumnHelper<BranchesQuery['branches'][0]>();

export const useBranchesTableColumns = () => [
    columnHelper.accessor((row) => row, {
        id: 'location',
        cell: (info) => {
            const branch = info.row.original;

            return (
                <Link
                    className="space-y-2 hover:underline"
                    href={routesBuilder.branches.details(branch.id)}
                >
                    <strong>{branch.client.name}</strong> - 
                    <p className="text-xs">
                        #{branch.number} - {branch.city.name},{' '}
                        {branch.city.province.name}
                    </p>
                </Link>
            );
        },
        header: 'Locación',
    }),
    columnHelper.accessor((row) => row.businesses, {
        id: 'business',
        cell: (info) => {
            const branch = info.row.original;
            return branch.businesses;
        },
        header: 'Empresa',
        filterFn: (row, id, businessesIDs: string[]) => {
            if (!businessesIDs) {
                return true;
            }

            const businessID = row.getValue<Branch['businesses']['id']>(id);
            const businessIsInFilteredList = businessesIDs.some(
                (someId) => someId === businessID,
            );

            return businessIsInFilteredList;
        },
    }),
    columnHelper.accessor((row) => row.client.id, {
        id: 'client',
        header: 'Cliente',
        filterFn: (row, id, clientsIDs: string[]) => {
            if (!clientsIDs) {
                return true;
            }

            const clientId = row.getValue<Branch['client']['id']>(id);
            const clientIsInFilteredList = clientsIDs.some(
                (clientID) => clientID === clientId,
            );

            return clientIsInFilteredList;
        },
    }),
    
];
