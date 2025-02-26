import Image from 'next/image';

import { DownloadIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { GetTaskQuery } from '@/api/graphql';
import ExpensePaySourceBadge from '@/components/ui/Badges/ExpensePaySourceBadge';
import ExpenseTypeBadge from '@/components/ui/Badges/ExpenseTypeBadge';
import { Button } from '@/components/ui/button';
import { Column } from '@/components/ui/data-list';
import { PDFViewer } from '@/components/ui/PDFViewer';

type Expense = NonNullable<GetTaskQuery['taskById']>['expenses'][number];

export const expenseColumns: Column<Expense>[] = [
    {
        header: 'Número',
        cell: (expense) => <span className="font-medium">#{expense.expenseNumber}</span>,
        accessorKey: 'expenseNumber',
    },
    {
        header: 'Monto',
        cell: (expense) => `$${expense.amount.toLocaleString('es-AR')}`,
        accessorKey: 'amount',
    },
    {
        header: 'Tipo',
        cell: (expense) => <ExpenseTypeBadge type={expense.expenseType} />,
        accessorKey: 'expenseType',
    },
    {
        header: 'Fuente de pago',
        cell: (expense) => (
            <ExpensePaySourceBadge
                paySource={expense.paySource}
                installments={expense.installments}
                paySourceBank={expense.paySourceBank}
            />
        ),
        accessorKey: 'paySource',
    },
    {
        header: 'Fecha',
        cell: (expense) => format(new Date(expense.expenseDate), 'dd/MM/yyyy'),
        accessorKey: 'expenseDate',
    },
    {
        header: 'Registrado por',
        cell: (expense) => expense.registeredBy.fullName,
        accessorKey: 'registeredBy',
    },
    {
        header: 'Pagado por',
        cell: (expense) => expense.doneBy || '-',
        accessorKey: 'doneBy',
    },
    {
        header: 'Observaciones',
        cell: (expense) => expense.observations || '-',
        accessorKey: 'observations',
    },
    {
        header: 'Imágenes',
        cell: (expense) =>
            expense.images && expense.images.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {expense.images.map((image) => (
                        <a
                            key={image.id}
                            className="h-15 group relative inline-block w-20 overflow-hidden rounded-md border border-accent"
                            download={image.id}
                            href={image.url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Image
                                src={image.url}
                                width={40}
                                height={40}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <DownloadIcon className="h-4 w-4" />
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                '-'
            ),
        accessorKey: 'images',
    },
    {
        header: 'Archivos',
        cell: (expense) =>
            expense.files && expense.files.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {expense.files.map((file) =>
                        file.mimeType.includes('pdf') ? (
                            <PDFViewer
                                key={file.id}
                                url={file.url}
                                filename={file.filename}
                            />
                        ) : (
                            <Button key={file.id} asChild size="sm" variant="outline">
                                <a
                                    href={file.url}
                                    download={file.filename}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <DownloadIcon className="mr-2 h-4 w-4" />
                                    {file.filename}
                                </a>
                            </Button>
                        ),
                    )}
                </div>
            ) : (
                '-'
            ),
        accessorKey: 'files',
    },
];
