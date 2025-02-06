import Image from 'next/image';
import Link from 'next/link';

import { DownloadIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';

import { GetExpenseQuery, ExpenseStatus } from '@/api/graphql';
import ExpensePaySourceBadge from '@/components/ui/Badges/ExpensePaySourceBadge';
import ExpenseTypeBadge from '@/components/ui/Badges/ExpenseTypeBadge';
import { Button } from '@/components/ui/button';
import { TypographyH1 } from '@/components/ui/typography';
import { useUserContext } from '@/context/userContext/UserProvider';
import { useGetExpense } from '@/hooks/api/expenses/useGetExpense';
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
    const { mutateAsync: updateExpenseStatus } = useUpdateExpenseStatus();

    const renderFilePreview = () => {
        if (!expense.file) {
            return null;
        }

        if (expense.file.mimeType.startsWith('application/pdf')) {
            return (
                <>
                    <Title>Archivo PDF</Title>
                    <div className="h-[600px] w-full max-w-3xl">
                        <iframe
                            src={expense.file.url}
                            className="h-full w-full rounded-md border border-gray-200"
                            title="PDF Viewer"
                        />
                    </div>
                </>
            );
        }

        return (
            <>
                <Title>Archivo</Title>
                <a
                    className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 hover:bg-gray-50"
                    href={expense.file.url}
                    target="_blank"
                    rel="noreferrer"
                >
                    <DownloadIcon />
                    Descargar archivo
                </a>
            </>
        );
    };

    return (
        <main className="py-3.5">
            <div className="flex justify-between">
                <TypographyH1 className="mb-2">
                    Gasto #{expense.expenseNumber}
                </TypographyH1>
                {user.roles.includes('AdministrativoContable') && (
                    <div className="flex gap-4">
                        <Button
                            onClick={() =>
                                updateExpenseStatus({
                                    expenseId: expense.id,
                                    status: ExpenseStatus.Aprobado,
                                })
                            }
                        >
                            Aprobar Gasto
                        </Button>
                        <Button
                            onClick={() =>
                                updateExpenseStatus({
                                    expenseId: expense.id,
                                    status: ExpenseStatus.Rechazado,
                                })
                            }
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

                <section>
                    {expense.image && (
                        <>
                            <Title>Imágen</Title>
                            <a
                                className="group relative inline-block overflow-hidden rounded-md border border-gray-200"
                                download={expense.image.id}
                                href={expense.image.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Image
                                    src={expense.image.url}
                                    width={640}
                                    height={1252}
                                    alt=""
                                    className="z-0"
                                />

                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 transition-colors duration-200 group-hover:bg-white/90">
                                    <DownloadIcon />
                                </div>
                            </a>
                        </>
                    )}

                    {expense.file && renderFilePreview()}
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
