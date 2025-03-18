import Link from 'next/link';

import { ExpenseStatus, ExpenseType } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp } from 'lucide-react';

import { ExpensesTableRowActions } from './expenses-table-row-actions';

import { ExpensePaySource, GetExpensesQuery } from '@/api/graphql';
import ExpensePaySourceBadge from '@/components/ui/Badges/ExpensePaySourceBadge';
import ExpenseStatusBadge from '@/components/ui/Badges/ExpenseStatusBadge';
import ExpenseTypeBadge from '@/components/ui/Badges/ExpenseTypeBadge';
import { routesBuilder } from '@/lib/routes';

type Expense = NonNullable<GetExpensesQuery['expenses']>[number];

const columnHelper = createColumnHelper<Expense>();

export const useExpensesTableColumns = () => [
    columnHelper.accessor((row) => row.expenseNumber, {
        id: 'expenseNumber',
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
            const expenseNumber = info.getValue();
            return <span className="block text-left font-medium">#{expenseNumber}</span>;
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row, {
        id: 'task',
        cell: (info) => {
            const expense = info.row.original;

            if (!expense.task) {
                return <> - </>;
            }

            return (
                <Link
                    className="space-y-2 hover:underline"
                    href={routesBuilder.tasks.details(expense.task.id)}
                >
                    <strong>
                        {expense.task.branch?.client?.name ?? expense.task.clientName}
                    </strong>{' '}
                    - {expense.task.business?.name ?? expense.task.businessName}
                    {expense.task.branch && (
                        <p className="text-xs">
                            #{expense.task.branch.number} -{' '}
                            {expense.task.branch.city.name}
                        </p>
                    )}
                </Link>
            );
        },
        header: 'Tarea',
        enableSorting: false,
    }),
    columnHelper.accessor((row) => row.amount, {
        id: 'amount',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full items-center justify-between gap-1 text-left"
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
            const amount = info.getValue();

            return (
                <p className="block text-left text-muted-foreground">
                    ${amount.toLocaleString('es-AR')}
                </p>
            );
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row.registeredBy, {
        id: 'registeredBy',
        cell: (info) => {
            const expense = info.row.original;
            return (
                <span className="block text-left">{expense.registeredBy.fullName}</span>
            );
        },
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full items-center justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Registrado por</span>
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
        filterFn: (row, id, userId: string[]) => {
            if (!userId) {
                return true;
            }

            const thisRegisteredBy = row.getValue<Expense['registeredBy']>(id);
            const registeredByIsInFilteredList = userId.includes(thisRegisteredBy.id);

            return registeredByIsInFilteredList;
        },
    }),
    columnHelper.accessor((row) => row.doneBy, {
        id: 'doneBy',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full items-center justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Pagado por</span>
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
            const expense = info.row.original;
            return <span className="block text-left">{expense.doneBy}</span>;
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row.expenseDate, {
        id: 'expenseDate',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full items-center justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Fecha de pago</span>
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
            const expense = info.row.original;
            const expenseDate = new Date(expense.expenseDate);
            expenseDate.setHours(0, 0, 0, 0);
            return (
                <span className="block text-left">
                    {format(expenseDate, 'dd/MM/yyyy')}
                </span>
            );
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row.expenseType, {
        id: 'expenseType',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full items-center justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span className="ml-2 text-left">Razón</span>
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
        filterFn: (row, id, types: ExpenseType[]) => {
            if (!types) {
                return true;
            }

            const thisType = row.getValue<Expense['expenseType']>(id);
            const expenseIsInFilteredList = types.some((type) => type === thisType);

            return expenseIsInFilteredList;
        },
        cell: (info) => {
            const type = info.getValue();
            return (
                <div className="text-left">
                    <ExpenseTypeBadge type={type} />
                </div>
            );
        },
        enableSorting: true,
    }),
    columnHelper.accessor(
        (row) => ({
            paySource: row.paySource,
            installments: row.installments,
            paySourceBank: row.paySourceBank,
        }),
        {
            id: 'paySource',
            header: ({ column }) => {
                return (
                    <button
                        className="flex w-full items-center justify-between gap-1 text-left"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        <span className="ml-2 text-left">Fuente de pago</span>
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
            filterFn: (row, id, paySources: ExpensePaySource[]) => {
                if (!paySources) {
                    return true;
                }

                const thisPaySource = row.getValue<Expense['paySource']>(id);
                const expenseIsInFilteredList = paySources.some(
                    (paySource) => paySource === thisPaySource,
                );

                return expenseIsInFilteredList;
            },
            cell: (info) => {
                const { paySource, installments, paySourceBank } = info.getValue();
                return (
                    <div className="text-left">
                        <ExpensePaySourceBadge
                            paySource={paySource}
                            installments={installments}
                            paySourceBank={paySourceBank}
                        />
                    </div>
                );
            },
            enableSorting: true,
        },
    ),
    columnHelper.accessor((row) => row.status, {
        id: 'status',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full items-center justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span className="ml-2 text-left">Estado</span>
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
            const status = info.getValue();
            return (
                <div className="text-left">
                    <ExpenseStatusBadge status={status} />
                </div>
            );
        },
        filterFn: (row, id, statuses: ExpenseStatus[]) => {
            if (!statuses?.length) {
                return true;
            }

            const thisStatus = row.getValue<ExpenseStatus>(id);
            return statuses.includes(thisStatus);
        },
        enableSorting: true,
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => {
            const expense = props.row.original;

            return <ExpensesTableRowActions expense={expense} />;
        },
        enableSorting: false,
    }),
];
