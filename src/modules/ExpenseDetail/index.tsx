import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { DownloadIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { useState } from 'react';

import { GetExpenseQuery, ExpenseStatus } from '@/api/graphql';
import ExpensePaySourceBadge from '@/components/ui/Badges/ExpensePaySourceBadge';
import ExpenseTypeBadge from '@/components/ui/Badges/ExpenseTypeBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PDFViewer } from '@/components/ui/PDFViewer';
import { TypographyH1 } from '@/components/ui/typography';
import { useUserContext } from '@/context/userContext/UserProvider';
import { useGetExpense } from '@/hooks/api/expenses/useGetExpense';
import { useUpdateExpenseDiscountAmount } from '@/hooks/api/expenses/useUpdateExpenseDiscountAmount';
import { useUpdateExpenseStatus } from '@/hooks/api/expenses/useUpdateExpenseStatus';
import { routesBuilder } from '@/lib/routes';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold">{children}</h2>
);

type Props = {
    expense: NonNullable<GetExpenseQuery['expenseById']>;
};

const Content: React.FC<Props> = ({ expense }) => {
    const { user } = useUserContext();
    const router = useRouter();
    const { mutateAsync: updateExpenseStatus } = useUpdateExpenseStatus();
    const { mutateAsync: updateExpenseDiscountAmount } = useUpdateExpenseDiscountAmount();

    const [discountAmount, setDiscountAmount] = useState<string>(
        expense.discountAmount ? expense.discountAmount.toString() : '',
    );
    const [isEditingDiscount, setIsEditingDiscount] = useState(false);

    const handleStatusUpdate = async (status: ExpenseStatus) => {
        await updateExpenseStatus({
            expenseId: expense.id,
            status: status,
        });
        // Redirigir a la tabla de gastos después de actualizar
        router.push(routesBuilder.accounting.expenses.list());
    };

    const handleDiscountAmountUpdate = async () => {
        if (discountAmount === '') {
            await updateExpenseDiscountAmount({
                expenseId: expense.id,
                discountAmount: null,
            });
        } else {
            const amount = parseFloat(discountAmount);
            if (!isNaN(amount)) {
                await updateExpenseDiscountAmount({
                    expenseId: expense.id,
                    discountAmount: amount,
                });
            }
        }
        setIsEditingDiscount(false);
    };

    return (
        <main className="rounded-lg border border-accent bg-background-primary p-4">
            <div className="flex justify-between">
                <TypographyH1 className="mb-2">
                    Gasto #{expense.expenseNumber}
                </TypographyH1>
                {user.roles.includes('AdministrativoContable') && (
                    <div className="flex gap-4">
                        <Button
                            onClick={() => handleStatusUpdate(ExpenseStatus.Aprobado)}
                        >
                            Aprobar Gasto
                        </Button>
                        <Button
                            onClick={() => handleStatusUpdate(ExpenseStatus.Rechazado)}
                        >
                            Rechazar Gasto
                        </Button>
                    </div>
                )}
            </div>
            <div className="space-y-4 pt-4">
                <div>
                    <Title>Tarea</Title>
                    {expense.task ? (
                        <Link
                            className="space-y-2 hover:underline"
                            href={routesBuilder.tasks.details(expense.task.id)}
                        >
                            #{expense.task.taskNumber}
                        </Link>
                    ) : (
                        'N/A'
                    )}
                </div>
                <div>
                    <Title>Monto</Title>${expense.amount.toLocaleString('es-AR')}
                </div>
                {user.roles.includes('AdministrativoContable') && (
                    <div>
                        <Title>Monto con descuento</Title>
                        {isEditingDiscount ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={discountAmount}
                                    onChange={(e) => setDiscountAmount(e.target.value)}
                                    placeholder="Monto con descuento"
                                    className="w-40"
                                />
                                <Button size="sm" onClick={handleDiscountAmountUpdate}>
                                    Guardar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setDiscountAmount(
                                            expense.discountAmount?.toString() || '',
                                        );
                                        setIsEditingDiscount(false);
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {expense.discountAmount
                                    ? `$${expense.discountAmount.toLocaleString('es-AR')}`
                                    : 'No establecido'}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsEditingDiscount(true)}
                                >
                                    Editar
                                </Button>
                            </div>
                        )}
                    </div>
                )}
                <div>
                    <Title>Registrado por</Title>
                    {expense.registeredBy.fullName}
                </div>
                <div>
                    <Title>Pagado por</Title>
                    {expense.doneBy}
                </div>
                <div>
                    <Title>Fecha registrado</Title>
                    {dayjs(expense.createdAt).format('DD/MM/YYYY')}
                </div>

                <div>
                    <Title>Fecha de pago</Title>
                    {dayjs(expense.expenseDate).format('DD/MM/YYYY')}
                </div>
                <div>
                    <Title>Estado</Title>
                    {expense.status}
                </div>
                <div>
                    <Title>Ciudad</Title>
                    {expense.cityName}
                </div>

                <div>
                    <Title>Tipo de gasto</Title>
                    <ExpenseTypeBadge type={expense.expenseType} />
                </div>
                <div>
                    <Title>Fuente de pago</Title>
                    <ExpensePaySourceBadge
                        paySource={expense.paySource}
                        installments={expense.installments}
                        paySourceBank={expense.paySourceBank}
                    />
                </div>

                <div>
                    <Title>Observaciones</Title>
                    <p className="mb-1">{expense.observations}</p>
                </div>

                <section className="space-y-4">
                    {expense.images && expense.images.length > 0 && (
                        <div>
                            <Title>Imágenes</Title>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {expense.images.map((image) => (
                                    <a
                                        key={image.id}
                                        className="group relative block overflow-hidden rounded-md border border-accent"
                                        download={image.id}
                                        href={image.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Image
                                            src={image.url}
                                            width={500}
                                            height={700}
                                            alt=""
                                            className="aspect-[5/7] w-full object-cover"
                                        />
                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/30 opacity-0 transition-colors duration-200 group-hover:bg-background/90 group-hover:opacity-100">
                                            <DownloadIcon className="h-6 w-6" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {expense.files && expense.files.length > 0 && (
                        <div>
                            <Title>Archivos</Title>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {expense.files.map((file) => (
                                    <div key={file.id}>
                                        {file.mimeType.startsWith('application/pdf') ? (
                                            <div className="h-[600px] w-full">
                                                <PDFViewer
                                                    url={file.url}
                                                    filename={file.filename}
                                                    showPreviewButton={false}
                                                />
                                            </div>
                                        ) : (
                                            <Button
                                                className="w-full"
                                                variant="outline"
                                                asChild
                                            >
                                                <a
                                                    className="inline-flex items-center gap-2"
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <DownloadIcon />
                                                    {file.filename}
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export const ExpenseDetail = ({ id }: { id: string }) => {
    const result = useGetExpense(id);

    if (result.isPending) {
        return <p>Loading...</p>;
    }

    if (result.isError) {
        return <p>Error</p>;
    }

    if (!result.data.expenseById) {
        return <p>Not found</p>;
    }

    return <Content expense={result.data.expenseById} />;
};
