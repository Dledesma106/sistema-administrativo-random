import { useRouter } from 'next/router';

import BudgetStatusBadge, {
    BudgetStatus,
} from '@/components/ui/Badges/BudgetStatusBadge';
import { Button } from '@/components/ui/button';
import { TypographyH1 } from '@/components/ui/typography';
import { routesBuilder } from '@/lib/routes';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold">{children}</h2>
);

// Mock data - Reemplazar con datos reales de tu API
const mockBudget = {
    id: '1',
    company: 'Empresa A',
    description: 'Descripción detallada del presupuesto A',
    price: 150000,
    status: BudgetStatus.Enviado,
    client: 'Cliente A',
    branch: 'Sucursal #123 - Buenos Aires',
    createdAt: '2024-03-20',
};

export const BudgetDetail = ({ id }: { id: string }) => {
    const router = useRouter();

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
            <p className="text-muted-foreground">{mockBudget.description}</p>

            <div className="space-y-4 pt-4">
                <div>
                    <Title>Estado</Title>
                    <BudgetStatusBadge status={mockBudget.status} />
                </div>

                <div>
                    <Title>Empresa</Title>
                    <p className="mb-1">{mockBudget.company}</p>
                </div>

                <div>
                    <Title>Cliente</Title>
                    <p className="mb-1">{mockBudget.client}</p>
                </div>

                <div>
                    <Title>Sucursal</Title>
                    <p className="mb-1">{mockBudget.branch}</p>
                </div>

                <div>
                    <Title>Precio</Title>
                    <p className="mb-1">
                        {mockBudget.price.toLocaleString('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                        })}
                    </p>
                </div>

                <div>
                    <Title>Fecha de creación</Title>
                    <p className="mb-1">{mockBudget.createdAt}</p>
                </div>
            </div>
        </main>
    );
};
