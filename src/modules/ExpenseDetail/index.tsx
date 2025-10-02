import Link from 'next/link';
import { useRouter } from 'next/router';

import dayjs from 'dayjs';
import { Eye } from 'lucide-react';
import { useState } from 'react';

import { GetExpenseQuery, ExpenseStatus } from '@/api/graphql';
import ExpensePaySourceBadge from '@/components/ui/Badges/ExpensePaySourceBadge';
import ExpenseTypeBadge from '@/components/ui/Badges/ExpenseTypeBadge';
import { Button } from '@/components/ui/button';
import { ImageViewer } from '@/components/ui/ImageViewer';
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
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {expense.images.map((image) => (
                                    <ImageViewer
                                        key={image.id}
                                        src={image.url}
                                        alt=""
                                        filename={`Imagen ${image.id}`}
                                        showPreviewButton={true}
                                        className="max-h-32 w-auto object-contain"
                                        previewClassName="group overflow-hidden rounded-md border border-accent"
                                        modalClassName="max-w-6xl border-accent"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {expense.files && expense.files.length > 0 && (
                        <div>
                            <Title>Archivos</Title>
                            <div className="flex flex-wrap gap-4">
                                {expense.files.map((file) => (
                                    <div key={file.id}>
                                        {file.mimeType &&
                                        file.mimeType.startsWith('image/') ? (
                                            <ImageViewer
                                                src={file.url}
                                                alt={file.filename || ''}
                                                filename={file.filename || ''}
                                                showPreviewButton={true}
                                                className="aspect-square object-contain transition-all duration-300"
                                                previewClassName="group relative aspect-square overflow-hidden rounded-md border border-accent"
                                            />
                                        ) : file.mimeType &&
                                          file.mimeType.startsWith('application/pdf') ? (
                                            <div className="h-[600px] w-full">
                                                <PDFViewer
                                                    url={file.url}
                                                    filename={file.filename || ''}
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
                                                    rel="noopener noreferrer"
                                                >
                                                    <Eye className="size-5" />
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
