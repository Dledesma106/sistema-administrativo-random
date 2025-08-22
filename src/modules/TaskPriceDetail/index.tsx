import { TaskType } from '@prisma/client';
import { format } from 'date-fns';
import { useState } from 'react';

import { UpdatePriceModal } from '@/components/Modals/UpdatePriceModal';
import { TaskTypeBadge } from '@/components/ui/Badges/TaskTypeBadge';
import { Button } from '@/components/ui/button';
import { DataList, Column } from '@/components/ui/data-list';
import { FormSkeleton } from '@/components/ui/skeleton';
import { TypographyH1 } from '@/components/ui/typography';

// Mock data para el maquetado
const mockTaskPrice = {
    id: '1',
    taskType: TaskType.Preventivo,
    businessName: 'Empresa Ejemplo S.A.',
    price: 15000,
    priceHistory: [
        {
            price: 15000,
            updatedAt: new Date('2024-01-15'),
        },
        {
            price: 12000,
            updatedAt: new Date('2023-12-01'),
        },
        {
            price: 10000,
            updatedAt: new Date('2023-06-15'),
        },
    ],
};

type PriceHistoryItem = {
    price: number;
    updatedAt: Date;
};

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold text-primary-foreground">{children}</h2>
);

type Props = {
    taskPrice: typeof mockTaskPrice;
};

const Content: React.FC<Props> = ({ taskPrice }) => {
    const [currentPrice, setCurrentPrice] = useState(taskPrice.price);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [priceHistory, setPriceHistory] = useState(taskPrice.priceHistory);

    const priceHistoryColumns: Column<PriceHistoryItem>[] = [
        {
            header: 'Precio',
            cell: (item) => {
                return item.price.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                });
            },
            accessorKey: 'price',
        },
        {
            header: 'Fecha de actualización',
            cell: (item) => format(new Date(item.updatedAt), 'dd/MM/yyyy HH:mm'),
            accessorKey: 'updatedAt',
        },
    ];

    const handleUpdatePrice = () => {
        setIsModalOpen(true);
    };

    const handleConfirmUpdatePrice = (newPrice: number) => {
        setIsUpdating(true);
        // Simular actualización
        setTimeout(() => {
            // Agregar el precio anterior al historial
            const previousPriceEntry = {
                price: currentPrice,
                updatedAt: new Date(),
            };

            setPriceHistory([previousPriceEntry, ...priceHistory]);
            setCurrentPrice(newPrice);
            setIsUpdating(false);
        }, 1000);
    };

    return (
        <main className="rounded-lg border border-accent bg-background-primary p-4">
            <TypographyH1 className="mb-2">Precio de Tarea #{taskPrice.id}</TypographyH1>

            <div className="space-y-4 pt-4">
                <div>
                    <Title>Tipo de tarea</Title>
                    <TaskTypeBadge type={taskPrice.taskType} />
                </div>

                <div>
                    <Title>Empresa</Title>
                    <p>{taskPrice.businessName}</p>
                </div>

                <div>
                    <Title>Precio actual</Title>
                    <p className="text-lg font-semibold">
                        {currentPrice.toLocaleString('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                        })}
                    </p>
                </div>

                <div>
                    <Title>Actualizar precio</Title>
                    <Button
                        onClick={handleUpdatePrice}
                        disabled={isUpdating}
                        className="mt-2"
                    >
                        {isUpdating ? 'Actualizando...' : 'Actualizar precio'}
                    </Button>
                </div>

                <section>
                    <Title>Historial de precios</Title>
                    <DataList
                        data={priceHistory}
                        columns={priceHistoryColumns}
                        emptyMessage="No hay historial de precios"
                    />
                </section>
            </div>

            <UpdatePriceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentPrice={currentPrice}
                onUpdatePrice={handleConfirmUpdatePrice}
                isUpdating={isUpdating}
            />
        </main>
    );
};

export const TaskPriceDetail = () => {
    // Por ahora usamos datos mock para el maquetado
    // En el futuro aquí se haría la llamada al hook useGetTaskPrice

    // Simular loading
    const isLoading = false;
    const isError = false;

    if (isLoading) {
        return <FormSkeleton />;
    }

    if (isError) {
        return <p>Error</p>;
    }

    return <Content taskPrice={mockTaskPrice} />;
};
