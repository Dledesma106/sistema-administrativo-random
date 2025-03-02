import Link from 'next/link';

import { ExpenseStatus, ExpenseType } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';

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
        header: 'Número',
        cell: (info) => {
            const expenseNumber = info.getValue();
            return <span className="font-medium">#{expenseNumber}</span>;
        },
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
    }),
    columnHelper.accessor((row) => row.amount, {
        id: 'amount',
        header: 'Monto',
        cell: (info) => {
            const amount = info.getValue();

            return (
                <p className="max-w-[250px] text-muted-foreground">
                    ${amount.toLocaleString('es-AR')}
                </p>
            );
        },
    }),
    columnHelper.accessor((row) => row.registeredBy, {
        id: 'registeredBy',
        cell: (info) => {
            const expense = info.row.original;
            return expense.registeredBy.fullName;
        },
        header: 'Registrado por',
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
        header: 'Pagado por',
        cell: (info) => {
            const expense = info.row.original;
            return expense.doneBy;
        },
    }),
    columnHelper.accessor((row) => row.expenseDate, {
        id: 'expenseDate',
        header: 'Fecha de pago',
        cell: (info) => {
            const expense = info.row.original;
            return format(new Date(expense.expenseDate), 'dd/MM/yyyy');
        },
    }),
    columnHelper.accessor((row) => row.expenseType, {
        id: 'expenseType',
        header: 'Razon',
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
            return <ExpenseTypeBadge type={type} />;
        },
    }),
    columnHelper.accessor(
        (row) => ({
            paySource: row.paySource,
            installments: row.installments,
            paySourceBank: row.paySourceBank,
        }),
        {
            id: 'paySource',
            header: 'Fuente de pago',
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
                    <ExpensePaySourceBadge
                        paySource={paySource}
                        installments={installments}
                        paySourceBank={paySourceBank}
                    />
                );
            },
        },
    ),
    columnHelper.accessor((row) => row.status, {
        id: 'status',
        header: 'Estado',
        cell: (info) => {
            const status = info.getValue();
            return <ExpenseStatusBadge status={status} />;
        },
        filterFn: (row, id, statuses: ExpenseStatus[]) => {
            if (!statuses?.length) {
                return true;
            }

            const thisStatus = row.getValue<ExpenseStatus>(id);
            return statuses.includes(thisStatus);
        },
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => {
            const expense = props.row.original;

            return <ExpensesTableRowActions expense={expense} />;
        },
    }),
];
