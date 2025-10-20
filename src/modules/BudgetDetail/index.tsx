import { useRouter } from 'next/router';

import { BudgetStatus } from '@prisma/client';
import { format } from 'date-fns';

import Combobox from '@/components/Combobox';
import BudgetStatusBadge from '@/components/ui/Badges/BudgetStatusBadge';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/skeleton';
import { TypographyH1, TypographyH3 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import { useGetBudgetById } from '@/hooks/api/budget/useGetBudgetById';
import { useUpdateBudgetStatus } from '@/hooks/api/budget/useUpdateBudgetStatus';
import { routesBuilder } from '@/lib/routes';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold">{children}</h2>
);

// TODO: Implementar integración con Gmail API para obtener hilos de email
// Por ahora, mostramos un mensaje cuando hay un gmailThreadId

export const BudgetDetail = ({ id }: { id: string }) => {
    const router = useRouter();
    const { triggerAlert } = useAlert();

    const { data, error, isLoading } = useGetBudgetById({ id });
    const updateBudgetStatus = useUpdateBudgetStatus();

    const handleStatusChange = async (newStatus: string) => {
        if (!data?.budgetById) {
            return;
        }

        try {
            await updateBudgetStatus.mutateAsync({
                id,
                input: {
                    status: newStatus as BudgetStatus,
                },
            });

            triggerAlert({
                type: 'Success',
                message: 'Estado del presupuesto actualizado correctamente',
            });

            // Si el estado cambia a aprobado, crear orden de servicio
            if (newStatus === BudgetStatus.Aprobado) {
                // TODO: Implementar creación de orden de servicio
                // console.log('Crear orden de servicio para el presupuesto:', id);
            }
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: 'Error al actualizar el estado del presupuesto',
            });
        }
    };

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error || !data?.budgetById) {
        return (
            <div className="rounded-lg border border-accent bg-background-primary p-4">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-destructive">
                        Error al cargar el presupuesto
                    </h2>
                    <p className="text-muted-foreground">
                        No se pudo cargar la información del presupuesto.
                    </p>
                    <Button
                        className="mt-4"
                        onClick={() =>
                            router.push(routesBuilder.accounting.budgets.list())
                        }
                    >
                        Volver a la lista
                    </Button>
                </div>
            </div>
        );
    }

    const budget = data.budgetById;

    return (
        <main className="rounded-lg border border-accent bg-background-primary p-4">
            <div className="flex justify-between">
                <TypographyH1 className="mb-2">Presupuesto #{id}</TypographyH1>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.push(routesBuilder.accounting.budgets.list())
                        }
                    >
                        Volver
                    </Button>
                    <Button
                        onClick={() =>
                            router.push(routesBuilder.accounting.budgets.edit(id))
                        }
                    >
                        Editar
                    </Button>
                </div>
            </div>
            {budget.description && (
                <p className="text-muted-foreground">{budget.description}</p>
            )}

            <div className="space-y-4 pt-4">
                <div>
                    <Title>Estado</Title>
                    <div className="flex items-center gap-2">
                        <BudgetStatusBadge status={budget.status} />
                        <Combobox
                            selectPlaceholder="Cambiar estado"
                            searchPlaceholder="Buscar estado"
                            value={budget.status}
                            onChange={handleStatusChange}
                            items={Object.values(BudgetStatus).map((status) => ({
                                label: capitalizeFirstLetter(pascalCaseToSpaces(status)),
                                value: status,
                            }))}
                        />
                    </div>
                </div>

                <div>
                    <Title>Asunto</Title>
                    <p className="mb-1">{budget.subject}</p>
                </div>

                <div>
                    <Title>Empresa</Title>
                    <p className="mb-1">{budget.billingProfile.business.name}</p>
                </div>

                <div>
                    <Title>Cliente</Title>
                    <p className="mb-1">
                        {budget.client?.name ||
                            budget.clientName ||
                            'Sin cliente asignado'}
                    </p>
                </div>

                {budget.branch && (
                    <div>
                        <Title>Sucursal</Title>
                        <p className="mb-1">
                            {budget.branch.number && `Sucursal #${budget.branch.number}`}
                            {budget.branch.name && ` - ${budget.branch.name}`}
                        </p>
                    </div>
                )}

                <div>
                    <Title>Perfil de Facturación</Title>
                    <p className="mb-1">{budget.billingProfile.legalName}</p>
                </div>

                <div>
                    <Title>Monto</Title>
                    <p className="mb-1">
                        {budget.price.toLocaleString('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                        })}
                    </p>
                </div>

                <div>
                    <Title>Fecha de creación</Title>
                    <p className="mb-1">
                        {format(new Date(budget.createdAt), 'dd/MM/yyyy HH:mm')}
                    </p>
                </div>

                <div>
                    <Title>Creado por</Title>
                    <p className="mb-1">{budget.createdBy.fullName}</p>
                </div>

                {/* Gastos Estimados */}
                {budget.expectedExpenses && budget.expectedExpenses.length > 0 && (
                    <div className="rounded-lg border border-accent p-4">
                        <TypographyH3 className="mb-4">Gastos Estimados</TypographyH3>
                        <div className="space-y-3">
                            {budget.expectedExpenses.map((expense, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-1 gap-4 rounded-md bg-muted p-3 md:grid-cols-5"
                                >
                                    <div>
                                        <Title>Tipo</Title>
                                        <p className="text-sm">
                                            {pascalCaseToSpaces(expense.type)}
                                        </p>
                                    </div>
                                    <div>
                                        <Title>Precio Unitario</Title>
                                        <p className="text-sm">
                                            ${expense.unitPrice.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <Title>Cantidad</Title>
                                        <p className="text-sm">
                                            {expense.type === 'Combustible'
                                                ? 'N/A'
                                                : expense.quantity}
                                        </p>
                                    </div>
                                    <div>
                                        <Title>Subtotal</Title>
                                        <p className="text-sm font-medium">
                                            ${expense.amount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <span className="text-xs text-muted-foreground">
                                            #{index + 1}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <div className="rounded-md bg-background p-2">
                                <span className="font-medium">
                                    Total Gastos Estimados: $
                                    {budget.totalExpectedExpenses.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mano de Obra */}
                {budget.manpower && budget.manpower.length > 0 && (
                    <div className="rounded-lg border border-accent p-4">
                        <TypographyH3 className="mb-4">Mano de Obra</TypographyH3>
                        <div className="space-y-3">
                            {budget.manpower.map((worker, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-1 gap-4 rounded-md bg-muted p-3 md:grid-cols-3"
                                >
                                    <div>
                                        <Title>Técnico</Title>
                                        <p className="text-sm">{worker.technician}</p>
                                    </div>
                                    <div>
                                        <Title>Paga</Title>
                                        <p className="text-sm font-medium">
                                            ${worker.payAmount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <span className="text-xs text-muted-foreground">
                                            #{index + 1}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <div className="rounded-md bg-background p-2">
                                <span className="font-medium">
                                    Total Mano de Obra: $
                                    {budget.manpower
                                        .reduce(
                                            (sum, worker) => sum + worker.payAmount,
                                            0,
                                        )
                                        .toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Resumen de Cálculos */}
                <div className="rounded-lg border border-accent p-4">
                    <TypographyH3 className="mb-4">Resumen de Cálculos</TypographyH3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Total Gastos Estimados:</span>
                            <span>${budget.totalExpectedExpenses.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Mano de Obra:</span>
                            <span>
                                $
                                {budget.manpower
                                    ?.reduce((sum, worker) => sum + worker.payAmount, 0)
                                    .toFixed(2) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span>Subtotal:</span>
                            <span>
                                $
                                {(
                                    budget.totalExpectedExpenses +
                                    (budget.manpower?.reduce(
                                        (sum, worker) => sum + worker.payAmount,
                                        0,
                                    ) || 0)
                                ).toFixed(2)}
                            </span>
                        </div>
                        {budget.markup && budget.markup > 0 && (
                            <>
                                <div className="flex justify-between">
                                    <span>Markup ({budget.markup}%):</span>
                                    <span>
                                        $
                                        {(
                                            (budget.totalExpectedExpenses +
                                                (budget.manpower?.reduce(
                                                    (sum, worker) =>
                                                        sum + worker.payAmount,
                                                    0,
                                                ) || 0)) *
                                            (budget.markup / 100)
                                        ).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Precio Final:</span>
                                    <span>${budget.price.toFixed(2)}</span>
                                </div>
                            </>
                        )}
                        {(!budget.markup || budget.markup === 0) && (
                            <div className="flex justify-between text-lg font-bold">
                                <span>Precio Final:</span>
                                <span>${budget.price.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};
