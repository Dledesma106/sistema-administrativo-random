import { useRouter } from 'next/router';

import Combobox from '@/components/Combobox';
import BudgetStatusBadge, {
    BudgetStatus,
} from '@/components/ui/Badges/BudgetStatusBadge';
import { Button } from '@/components/ui/button';
import { TypographyH1 } from '@/components/ui/typography';
import { routesBuilder } from '@/lib/routes';
import { cn } from '@/lib/utils';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold">{children}</h2>
);

// Mock data - Reemplazar con datos reales de tu API
const mockBudget = {
    id: '1',
    company: 'Empresa A',
    description: 'Descripción detallada del presupuesto A',
    price: 150000,
    status: BudgetStatus.Recibido,
    client: 'Cliente A',
    branch: 'Sucursal #123 - Buenos Aires',
    createdAt: '2024-03-20',
    contactName: 'Juan Pérez',
    contactEmail: 'juan.perez@empresaa.com',
};

type EmailThread = {
    id: string;
    subject: string;
    messages: {
        id: string;
        from: string;
        to: string[];
        cc?: string[];
        timestamp: string;
        content: string;
        type: 'SENT' | 'RECEIVED' | 'FORWARDED';
    }[];
};

const mockEmailThread: EmailThread = {
    id: 'thread-1',
    subject: 'Re: Presupuesto #1 - Empresa A',
    messages: [
        {
            id: 'email-1',
            from: 'juan.perez@empresaa.com',
            to: ['ventas@miempresa.com'],
            timestamp: '2024-03-20T10:30:00Z',
            content:
                'Buenos días,\n\nNecesitaría un presupuesto para los servicios mencionados anteriormente.\n\nSaludos cordiales,\nJuan Pérez',
            type: 'RECEIVED',
        },
        {
            id: 'email-2',
            from: 'ventas@miempresa.com',
            to: ['juan.perez@empresaa.com'],
            cc: ['gerencia@miempresa.com'],
            timestamp: '2024-03-20T14:15:00Z',
            content:
                'Estimado Juan,\n\nAdjunto el presupuesto solicitado.\nQuedo a disposición por cualquier consulta.\n\nSaludos,\nDepartamento de Ventas',
            type: 'SENT',
        },
        {
            id: 'email-3',
            from: 'juan.perez@empresaa.com',
            to: ['ventas@miempresa.com'],
            timestamp: '2024-03-21T09:45:00Z',
            content:
                'Recibido, gracias.\nLo estaré revisando con el equipo.\n\nSaludos,\nJuan',
            type: 'RECEIVED',
        },
        {
            id: 'email-4',
            from: 'gerencia@empresaa.com',
            to: ['ventas@miempresa.com'],
            cc: ['juan.perez@empresaa.com'],
            timestamp: '2024-03-22T11:20:00Z',
            content:
                '---------- Forwarded message ---------\nFrom: Gerencia\n\nHola,\nRevisamos el presupuesto y necesitaríamos una reunión para discutir algunos puntos.\n¿Tienen disponibilidad esta semana?\n\nSaludos cordiales,\nGerencia',
            type: 'FORWARDED',
        },
    ],
};

export const BudgetDetail = ({ id }: { id: string }) => {
    const router = useRouter();

    const handleStatusChange = (newStatus: string) => {
        // TODO: Implementar la mutación para actualizar el estado
        console.log('Cambiar estado a:', newStatus);

        // Si el estado cambia a aprobado, crear orden de servicio
        if (newStatus === BudgetStatus.Aprobado) {
            console.log('Crear orden de servicio para el presupuesto:', id);
        }
    };

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
                    <div className="flex items-center gap-2">
                        <BudgetStatusBadge status={mockBudget.status} />
                        <Combobox
                            selectPlaceholder="Cambiar estado"
                            searchPlaceholder="Buscar estado"
                            value={mockBudget.status}
                            onChange={handleStatusChange}
                            items={Object.entries(BudgetStatus).map(([key, value]) => ({
                                label: key,
                                value: value,
                            }))}
                        />
                    </div>
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
                    <Title>Contacto</Title>
                    <p className="mb-1">{mockBudget.contactName}</p>
                    <p className="text-sm text-muted-foreground">
                        {mockBudget.contactEmail}
                    </p>
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

            <div className="mt-8">
                <Title>Comunicaciones</Title>
                <div className="space-y-4">
                    {mockEmailThread.messages.map((email) => (
                        <div
                            key={email.id}
                            className={cn(
                                'rounded-lg border border-accent p-4',
                                email.type === 'SENT' && 'bg-muted',
                            )}
                        >
                            <div className="mb-2 flex items-start justify-between">
                                <div>
                                    <p className="font-semibold">{email.from}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Para: {email.to.join(', ')}
                                    </p>
                                    {email.cc && (
                                        <p className="text-sm text-muted-foreground">
                                            CC: {email.cc.join(', ')}
                                        </p>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(email.timestamp).toLocaleString('es-AR')}
                                </p>
                            </div>
                            <div className="whitespace-pre-wrap text-sm">
                                {email.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};
