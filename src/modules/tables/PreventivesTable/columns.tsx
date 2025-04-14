import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';

import { PreventivesTableRowActions } from './preventives-table-row-actions';

import { GetPreventivesQuery } from '@/api/graphql';
import { Badge } from '@/components/ui/Badges/badge';
import { PreventiveStatusBadge } from '@/components/ui/Badges/PreventiveStatusBadge';

type Preventive = GetPreventivesQuery['preventives'][0];

const columnHelper = createColumnHelper<Preventive>();

export const PREVENTIVES_TABLE_COLUMNS = [
    columnHelper.accessor('business', {
        id: 'business.name',
        header: 'Empresa',
        cell: (props) => {
            const preventive = props.row.original;

            return <p>{preventive.business.name}</p>;
        },
        filterFn: (rows, id, ids: string[]) => {
            if (!ids) {
                return true;
            }

            const business = rows.getValue<Preventive['business']>(id);

            return ids.includes(business.id);
        },
    }),
    columnHelper.accessor('status', {
        header: 'Estado',
        cell: (props) => {
            const preventive = props.row.original;

            return <PreventiveStatusBadge status={preventive.status} />;
        },
    }),
    columnHelper.accessor('branch.city', {
        id: 'city',
        enableHiding: true,
        filterFn: (rows, id, ids: string[]) => {
            if (!ids?.length) {
                return true;
            }

            const preventive = rows.original;
            return ids.includes(preventive.branch.city.id);
        },
    }),
    columnHelper.accessor('branch', {
        header: 'Sucursal',
        cell: (props) => {
            const preventive = props.row.original;

            return (
                <p>
                    {preventive.branch.number}, {preventive.branch.client.name},{' '}
                    {preventive.branch.city.name}
                </p>
            );
        },
        filterFn: (rows, id, ids: string[]) => {
            if (!ids) {
                return true;
            }

            const branch = rows.getValue<Preventive['branch']>(id);

            return ids.includes(branch.id);
        },
    }),
    columnHelper.accessor('assigned', {
        id: 'assigned',
        header: 'Técnicos',
        cell: (props) => {
            const preventive = props.row.original;

            if (!preventive.assigned.length) {
                return '-';
            }

            return (
                <div className="-ml-2 -mt-2 flex max-w-[250px] flex-wrap">
                    {preventive.assigned.map((technician) => (
                        <Badge
                            key={technician.id}
                            variant="default"
                            className="ml-2 mt-2 whitespace-nowrap"
                        >
                            {technician.fullName}
                        </Badge>
                    ))}
                </div>
            );
        },
        filterFn: (rows, id, ids: string[]) => {
            if (!ids) {
                return true;
            }

            const assigned = rows.getValue<Preventive['assigned']>(id);
            return ids.some((filterId) => {
                return assigned.some((technician) => technician.id === filterId);
            });
        },
    }),
    columnHelper.accessor('frequency', {
        header: 'Frecuencia',
        cell: (props) => {
            const preventive = props.row.original;

            return preventive.frequency ?? '-';
        },
    }),
    columnHelper.accessor('months', {
        header: 'Meses',
        cell: (props) => {
            const preventive = props.row.original;

            return preventive.months.length > 1
                ? preventive.months.map((month) => `${month}, `)
                : preventive.months[0];
        },
    }),
    columnHelper.accessor('observations', {
        header: 'Observaciones',
    }),
    columnHelper.accessor(
        (row) => {
            return row.lastDoneAt !== null
                ? format(new Date(row.lastDoneAt), 'dd/MM/yyyy')
                : '';
        },
        {
            id: 'lastDoneAt',
            header: 'Última vez',
        },
    ),
    columnHelper.accessor('branch.client.id', {
        id: 'branch.client.id',
        header: 'Cliente',
        filterFn: (rows, id, ids: string[]) => {
            if (!ids) {
                return true;
            }

            const clientId = rows.getValue<Preventive['branch']['client']['id']>(id);

            return ids.includes(clientId);
        },
    }),
    columnHelper.accessor((row) => format(new Date(row.batteryChangedAt), 'dd/MM/yyyy'), {
        id: 'batteryChangedAt',
        header: 'Fecha batería',
        cell: (props) => {
            const preventive = props.row.original;

            return preventive.batteryChangedAt
                ? format(new Date(preventive.batteryChangedAt), 'dd/MM/yyyy')
                : '';
        },
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => {
            const preventive = props.row.original;

            return <PreventivesTableRowActions preventive={preventive} />;
        },
    }),
];
