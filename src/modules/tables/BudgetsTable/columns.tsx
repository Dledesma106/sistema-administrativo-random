import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp } from 'lucide-react';

import { BudgetsTableRowActions } from './budgets-table-row-actions';

import { BudgetStatus, GetBudgetsQuery } from '@/api/graphql';
import BudgetStatusBadge from '@/components/ui/Badges/BudgetStatusBadge';

type Budget = NonNullable<GetBudgetsQuery['budgets']>[number];

const columnHelper = createColumnHelper<Budget>();

export const useBudgetsTableColumns = () => [
    columnHelper.accessor((row) => (row as any).budgetNumber || 'N/A', {
        id: 'budgetNumber',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Número</span>
                    {column.getIsSorted() && (
                        <span>
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 size-4" />
                            ) : (
                                <ArrowDown className="ml-1 size-4" />
                            )}
                        </span>
                    )}
                </button>
            );
        },
        cell: (info) => {
            const budgetNumber = info.getValue();
            return <span className="font-medium">#{budgetNumber}</span>;
        },
        enableSorting: true,
    }),
    columnHelper.accessor('billingProfile.business.name', {
        id: 'business',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Empresa</span>
                    {column.getIsSorted() && (
                        <span>
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 size-4" />
                            ) : (
                                <ArrowDown className="ml-1 size-4" />
                            )}
                        </span>
                    )}
                </button>
            );
        },
        cell: (info) => {
            const businessName = info.getValue();
            return <span className="font-medium">{businessName}</span>;
        },
        filterFn: (row, id, businessIds: string[]) => {
            if (!businessIds?.length) {
                return true;
            }
            const budget = row.original;
            return businessIds.includes(budget.billingProfile.business.id);
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row, {
        id: 'client',
        header: () => <span>Cliente</span>,
        cell: (info) => {
            const budget = info.row.original;
            return (
                <div>
                    <strong>
                        {budget.client?.name || budget.clientName || 'Sin cliente'}
                    </strong>
                    {budget.branch && (
                        <p className="text-xs text-muted-foreground">
                            {budget.branch.number && `Sucursal #${budget.branch.number}`}
                            {budget.branch.name && ` - ${budget.branch.name}`}
                        </p>
                    )}
                </div>
            );
        },
        filterFn: (row, id, clientIds: string[]) => {
            if (!clientIds?.length) {
                return true;
            }
            const budget = row.original;
            return budget.client ? clientIds.includes(budget.client.id) : false;
        },
        enableSorting: true,
    }),
    columnHelper.accessor('subject', {
        id: 'subject',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Asunto</span>
                    {column.getIsSorted() && (
                        <span>
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 size-4" />
                            ) : (
                                <ArrowDown className="ml-1 size-4" />
                            )}
                        </span>
                    )}
                </button>
            );
        },
        cell: (info) => {
            const subject = info.getValue();
            return <span className="font-medium">{subject}</span>;
        },
        enableSorting: true,
    }),
    columnHelper.accessor('description', {
        id: 'description',
        header: () => <span>Descripción</span>,
        cell: (info) => {
            const description = info.getValue();
            if (!description) {
                return <span className="text-muted-foreground">-</span>;
            }

            const maxLength = 67;
            const truncatedDescription =
                description.length > maxLength
                    ? `${description.slice(0, maxLength)}...`
                    : description;

            return (
                <p className="max-w-[250px] text-muted-foreground">
                    {truncatedDescription}
                </p>
            );
        },
        enableSorting: true,
    }),
    columnHelper.accessor('status', {
        id: 'status',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Estado</span>
                    {column.getIsSorted() && (
                        <span>
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 size-4" />
                            ) : (
                                <ArrowDown className="ml-1 size-4" />
                            )}
                        </span>
                    )}
                </button>
            );
        },
        cell: (info) => <BudgetStatusBadge status={info.getValue() as BudgetStatus} />,
        filterFn: (row, id, statuses: string[]) => {
            if (!statuses?.length) {
                return true;
            }
            const status = row.getValue<Budget['status']>(id);
            return statuses.includes(status);
        },
        enableSorting: true,
    }),
    columnHelper.accessor('totalExpectedExpenses', {
        id: 'totalExpectedExpenses',
        header: () => <span>Total Gastos Estimados</span>,
        cell: (info) => {
            const totalExpectedExpenses = info.getValue();
            const totalManpower = info.row.original.manpower.reduce(
                (sum, worker) => sum + worker.payAmount,
                0,
            );
            const total = totalExpectedExpenses + totalManpower;
            return <span className="font-medium">${total.toLocaleString('es-AR')}</span>;
        },
        enableSorting: true,
    }),
    columnHelper.accessor('price', {
        id: 'price',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Monto</span>
                    {column.getIsSorted() && (
                        <span>
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 size-4" />
                            ) : (
                                <ArrowDown className="ml-1 size-4" />
                            )}
                        </span>
                    )}
                </button>
            );
        },
        cell: (info) => {
            const price = info.getValue();
            return (
                <span className="font-medium">
                    {price.toLocaleString('es-AR', {
                        style: 'currency',
                        currency: 'ARS',
                    })}
                </span>
            );
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => format(new Date(row.createdAt), 'dd/MM/yyyy'), {
        id: 'createdAt',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Fecha creación</span>
                    {column.getIsSorted() && (
                        <span>
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 size-4" />
                            ) : (
                                <ArrowDown className="ml-1 size-4" />
                            )}
                        </span>
                    )}
                </button>
            );
        },
        enableSorting: true,
    }),
    columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
            <div className="flex w-full justify-end">
                <BudgetsTableRowActions budget={row.original} />
            </div>
        ),
    }),
];
