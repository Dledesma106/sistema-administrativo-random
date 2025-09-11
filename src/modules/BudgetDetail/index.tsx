import { useRouter } from 'next/router';

import { BudgetStatus } from '@prisma/client';
import { format } from 'date-fns';

import Combobox from '@/components/Combobox';
import BudgetStatusBadge from '@/components/ui/Badges/BudgetStatusBadge';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/skeleton';
import { TypographyH1 } from '@/components/ui/typography';
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
                        {budget.client?.name || 'Sin cliente asignado'}
                    </p>
                </div>

                <div>
                    <Title>Sucursal</Title>
                    <p className="mb-1">
                        {budget.branch
                            ? `Sucursal #${budget.branch.number} - ${budget.branch.name}`
                            : 'Sin sucursal asignada'}
                    </p>
                </div>

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
            </div>

            {budget.gmailThreadId && (
                <div className="mt-8">
                    <Title>Comunicaciones</Title>
                    <div className="rounded-lg border border-accent p-4">
                        <p className="text-muted-foreground">
                            Este presupuesto está vinculado a un hilo de Gmail (ID:{' '}
                            {budget.gmailThreadId}).
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            La integración con Gmail para mostrar las comunicaciones
                            estará disponible próximamente.
                        </p>
                    </div>
                </div>
            )}
        </main>
    );
};
