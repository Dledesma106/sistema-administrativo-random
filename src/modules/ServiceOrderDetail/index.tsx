import { useRouter } from 'next/router';

import { BsPlus } from 'react-icons/bs';

import { getTaskColumns } from './columns';

import { Role, ServiceOrderQuery, ServiceOrderStatus } from '@/api/graphql';
import { ServiceOrderStatusBadge } from '@/components/ui/Badges/ServiceOrderStatusBadge';
import { Button } from '@/components/ui/button';
import { DataList } from '@/components/ui/data-list';
import { FormSkeleton } from '@/components/ui/skeleton';
import { TypographyH1 } from '@/components/ui/typography';
import { useUserContext } from '@/context/userContext/UserProvider';
import { useGetServiceOrder } from '@/hooks/api/serviceOrders/useGetServiceOrder';
import { routesBuilder } from '@/lib/routes';

type ServiceOrderData = NonNullable<ServiceOrderQuery['serviceOrder']>;

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold text-primary-foreground">{children}</h2>
);

const Content = ({ serviceOrder }: { serviceOrder: ServiceOrderData }) => {
    const router = useRouter();
    const { user } = useUserContext();
    const isAccountingAdmin = user.roles.includes(Role.AdministrativoContable);

    const taskColumns = getTaskColumns(isAccountingAdmin);

    const totalExpenses =
        serviceOrder.tasks?.reduce((acc: number, task) => {
            return (
                acc +
                (task.expenses?.reduce(
                    (taskAcc: number, expense) => taskAcc + expense.amount,
                    0,
                ) || 0)
            );
        }, 0) || 0;

    return (
        <main className="rounded-lg border border-accent bg-background-primary p-4">
            <div className="flex justify-between">
                <TypographyH1 className="mb-2">
                    Orden de Servicio #
                    {String(serviceOrder.serviceOrderNumber).padStart(3, '0')}
                </TypographyH1>
                <Button
                    className="flex items-center gap-1"
                    onClick={() =>
                        router.push(`/service-orders/${serviceOrder.id}/tasks/new`)
                    }
                >
                    <BsPlus size="20" />
                    <span>Crear tarea</span>
                </Button>
            </div>

            <div className="space-y-4 pt-4">
                <div>
                    <Title>Estado</Title>
                    <ServiceOrderStatusBadge
                        status={serviceOrder.status as ServiceOrderStatus}
                    />
                </div>

                <div>
                    <Title>Empresa</Title>
                    <p>{serviceOrder.business.name}</p>
                </div>

                <div>
                    <Title>Cliente</Title>
                    <p>{serviceOrder.client?.name || serviceOrder.clientName}</p>
                </div>

                {(serviceOrder.branch || serviceOrder.customBranch) && (
                    <div>
                        <Title>Sucursal</Title>
                        <p>
                            {serviceOrder.customBranch ? (
                                <>
                                    {serviceOrder.customBranch.number &&
                                        `#${serviceOrder.customBranch.number} - `}
                                    {serviceOrder.customBranch.name}
                                </>
                            ) : (
                                serviceOrder.branch && (
                                    <>
                                        {serviceOrder.branch.number &&
                                            `#${serviceOrder.branch.number} - `}
                                        {serviceOrder.branch.name ||
                                            `${serviceOrder.branch.city?.name}, ${serviceOrder.branch.city?.province?.name}`}
                                    </>
                                )
                            )}
                        </p>
                    </div>
                )}

                {serviceOrder.subject && (
                    <div>
                        <Title>Asunto</Title>
                        <p>{serviceOrder.subject}</p>
                    </div>
                )}

                <div>
                    <Title>Descripción</Title>
                    <p className="text-muted-foreground">{serviceOrder.description}</p>
                </div>

                {serviceOrder.participants?.length > 0 && (
                    <div>
                        <Title>Técnicos Participantes</Title>
                        <div className="flex flex-wrap gap-2">
                            {serviceOrder.participants.map(
                                (participant: string, index: number) => (
                                    <div
                                        key={index}
                                        className="rounded-md border border-accent bg-background px-3 py-1.5 text-sm"
                                    >
                                        {participant}
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                )}

                {isAccountingAdmin && (
                    <div>
                        <Title>Gasto total</Title>
                        <p>
                            {totalExpenses.toLocaleString('es-AR', {
                                style: 'currency',
                                currency: 'ARS',
                            })}
                        </p>
                    </div>
                )}

                <section>
                    <Title>Tareas</Title>
                    <DataList
                        data={serviceOrder.tasks}
                        columns={taskColumns}
                        onRowClick={(task) =>
                            router.push(routesBuilder.tasks.details(task.id))
                        }
                        emptyMessage="No hay tareas"
                    />
                </section>
            </div>
        </main>
    );
};

export const ServiceOrderDetail = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data, isPending, isError } = useGetServiceOrder(id as string);

    if (isPending) {
        return <FormSkeleton />;
    }

    if (isError) {
        return <p>Error al cargar la orden de servicio</p>;
    }

    if (!data?.serviceOrder) {
        return <p>Orden de servicio no encontrada</p>;
    }

    return <Content serviceOrder={data.serviceOrder} />;
};
