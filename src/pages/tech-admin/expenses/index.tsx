import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    ColumnFiltersState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from '@tanstack/react-table';
import lodash from 'lodash';
import { useEffect, useState } from 'react';
import { Control, useForm } from 'react-hook-form';

import { DashboardLayout } from '@/components/DashboardLayout';
import DataTableComboboxFilter from '@/components/DataTableComboboxFilter';
import TitleButton from '@/components/TitleButton';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import useAlert from '@/context/alertContext/useAlert';
import { techAdmin } from '@/lib/apiEndpoints';
import { axiosInstance } from '@/lib/fetcher';
import { IExpense } from 'backend/models/interfaces';
import { ExpenseStatus } from 'backend/models/types';

const columnHelper = createColumnHelper<IExpense>();

const taskStatuses: ExpenseStatus[] = [ExpenseStatus.Aprobado, ExpenseStatus.Enviado];
type FormValues = {
    expenses: Record<string, { status: ExpenseStatus }>;
};

type ExpenseStatusCellProps = {
    id: string;
    control: Control<FormValues>;
};

const ExpenseStatusCell = ({ id, control }: ExpenseStatusCellProps) => {
    return (
        <FormField
            name={`expenses.${id}.status`}
            control={control}
            render={({ field }) => {
                return (
                    <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Selecciona un estado</SelectLabel>
                                    {taskStatuses.map(
                                        (status: ExpenseStatus, index: number) => (
                                            <SelectItem key={index} value={status}>
                                                {status}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FormItem>
                );
            }}
        />
    );
};

const columns = [
    columnHelper.accessor((expense) => expense.doneBy, {
        header: 'Realizado por',
        id: 'doneBy',
        cell: (props) => {
            const value = props.getValue();
            return (
                <div>
                    <p className="mb-0.5 font-bold">{value.fullName}</p>
                    <p className="text-sm text-muted-foreground">{value.email}</p>
                </div>
            );
        },
        filterFn: (row, id, value: string) => {
            const doneBy = row.getValue(id) as IExpense['doneBy'];
            return doneBy._id.toString() === value;
        },
    }),
    columnHelper.accessor((expense) => expense.expenseType, {
        header: 'Tipo de gasto',
    }),
    columnHelper.accessor((expense) => expense.amount, {
        header: 'Monto',
        cell: (props) => {
            const value = props.getValue();
            return <span>${value}</span>;
        },
    }),
    columnHelper.accessor((expense) => expense.paySource, {
        header: 'Método de pago',
    }),
    columnHelper.accessor((expense) => expense, {
        id: 'task-or-activity',
        header: 'Tarea o actividad',
        cell: (props) => {
            const value = props.getValue();
            return <span>{value.task ? 'Tarea' : 'Actividad'}</span>;
        },
    }),
    columnHelper.accessor((expense) => expense, {
        id: 'status',
        header: 'Estado',
        cell: (props) => {
            const value = props.getValue();
            const control = (props as any).control;
            return <ExpenseStatusCell id={value._id.toString()} control={control} />;
        },
        filterFn: (row, id, value: ExpenseStatus) => {
            const rowValue = row.getValue(id) as IExpense;
            const status = rowValue.status;
            return status.toLowerCase() === value;
        },
    }),
];

type ExpensesProps = {
    data: IExpense[];
};

const ExpensesTable = (props: ExpensesProps) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data: props.data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    });
    const form = useForm<FormValues>({
        defaultValues: {
            expenses: props.data.reduce(
                (acc, next) => {
                    acc[next._id.toString()] = {
                        status: next.status,
                    };

                    return acc;
                },
                {} as FormValues['expenses'],
            ),
        },
    });

    const queryClient = useQueryClient();
    const { triggerAlert } = useAlert();

    const { watch } = form;
    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: ExpenseStatus }) => {
            const res = await axiosInstance.put(`${techAdmin.expenses}/${id}`, {
                status,
            });

            return res.data.data;
        },
        onSuccess: (data, { id }) => {
            queryClient.setQueryData<IExpense[]>(['expenses'], (oldData) => {
                if (!oldData) {
                    return oldData;
                }

                return oldData.map((expense) => {
                    if (expense._id.toString() === id) {
                        return {
                            ...expense,
                            status: data.status,
                        };
                    }

                    return expense;
                });
            });

            triggerAlert({
                message: 'Estado del gasto actualizado correctamente.',
                type: 'Success',
            });
        },
        onError: () => {
            triggerAlert({
                message: 'Error al actualizar el estado del gasto.',
                type: 'Failure',
            });
        },
    });

    const mutateStatus = statusMutation.mutate;

    useEffect(() => {
        const subscription = watch((values, { name, type }) => {
            if (type !== 'change' || !name) {
                return;
            }

            const newStatus = lodash.get(values, name) as unknown as ExpenseStatus;
            const id = name.split('.')[1];
            mutateStatus({
                id,
                status: newStatus,
            });
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [watch, mutateStatus]);

    return (
        <Form {...form}>
            <div className="flex flex-wrap items-center space-x-4 py-4">
                <Label className="block">Filtrar por</Label>

                <DataTableComboboxFilter
                    selectPlaceholder="Seleccionar técnico"
                    searchPlaceholder="Buscar técnico"
                    value={(table.getColumn('doneBy')?.getFilterValue() as string) || ''}
                    onChange={table.getColumn('doneBy')?.setFilterValue}
                    items={props.data
                        .map((expense) => ({
                            value: expense.doneBy._id.toString(),
                            label: expense.doneBy.fullName || '',
                        }))
                        .filter(
                            (item, index, self) =>
                                self.findIndex((i) => i.value === item.value) === index,
                        )}
                />

                <DataTableComboboxFilter
                    selectPlaceholder="Seleccionar estado"
                    searchPlaceholder="Buscar estado"
                    value={(table.getColumn('status')?.getFilterValue() as string) || ''}
                    onChange={table.getColumn('status')?.setFilterValue}
                    items={[
                        {
                            value: ExpenseStatus.Aprobado.toLowerCase(),
                            label: 'Aprobado',
                        },
                        {
                            value: ExpenseStatus.Enviado.toLowerCase(),
                            label: 'Enviado',
                        },
                    ]}
                />
            </div>

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No se encontraron resultados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Form>
    );
};

const useExpensesQuery = () => {
    return useQuery<IExpense[]>({
        queryKey: ['expenses'],
        queryFn: async () => {
            const res = await axiosInstance.get(techAdmin.expenses);
            return res.data.data;
        },
    });
};

const ExpensesPage = () => {
    const { data, isError, isPending } = useExpensesQuery();

    if (isPending) {
        return (
            <DashboardLayout>
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </DashboardLayout>
        );
    }

    if (isError) {
        return <DashboardLayout>Error</DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <TitleButton title="Gastos" />

            <ExpensesTable data={data} />
        </DashboardLayout>
    );
};

export default ExpensesPage;
