import { useRouter } from 'next/router';

import { BillStatusBadge, BillStatus } from '@/components/ui/Badges/BillStatusBadge';
import { Button } from '@/components/ui/button';
import { DataList } from '@/components/ui/data-list';
import { TypographyH1 } from '@/components/ui/typography';
import { routesBuilder } from '@/lib/routes';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold">{children}</h2>
);

// Mock data - Reemplazar con datos reales de tu API
const mockBillingProfile = {
    id: '1',
    business: 'Empresa A',
    businessName: 'Empresa A S.R.L.',
    cuit: '30123456789',
    legalName: 'Empresa A S.R.L.',
    taxCondition: 'RESPONSABLE_INSCRIPTO',
    billingAddress: 'Av. Siempre Viva 123',
    billingEmail: 'facturacion@empresaa.com',
    contacts: [
        {
            name: 'Juan Pérez',
            email: 'juan.perez@empresaa.com',
            phone: '1234567890',
            notes: 'Gerente de Finanzas',
        },
        {
            name: 'María García',
            email: 'maria.garcia@empresaa.com',
            phone: '9876543210',
            notes: 'Contadora',
        },
    ],
    bills: [
        {
            id: '1',
            number: '0001-00000001',
            amount: 150000,
            status: 'Vencida' as BillStatus,
            dueDate: '2024-03-15',
            issueDate: '2024-03-01',
            description: 'Servicios de mantenimiento preventivo - Marzo 2024',
        },
        {
            id: '2',
            number: '0001-00000002',
            amount: 280000,
            status: 'Pendiente' as BillStatus,
            dueDate: '2024-04-15',
            issueDate: '2024-04-01',
            description: 'Instalación de equipos nuevos',
        },
        {
            id: '3',
            number: '0001-00000003',
            amount: 75000,
            status: 'Pagada' as BillStatus,
            dueDate: '2024-02-15',
            issueDate: '2024-02-01',
            description: 'Servicios de mantenimiento preventivo - Febrero 2024',
        },
        {
            id: '4',
            number: '0001-00000004',
            amount: 120000,
            status: 'Borrador' as BillStatus,
            dueDate: '2024-05-15',
            issueDate: '2024-05-01',
            description: 'Servicios de mantenimiento preventivo - Abril 2024',
        },
    ],
};

type Bill = (typeof mockBillingProfile.bills)[0];

const billColumns = [
    {
        header: 'Número',
        cell: (bill: Bill) => <span className="font-medium">#{bill.number}</span>,
        accessorKey: 'number' as const,
    },
    {
        header: 'Monto',
        cell: (bill: Bill) => `$${bill.amount.toLocaleString('es-AR')}`,
        accessorKey: 'amount' as const,
    },
    {
        header: 'Estado',
        cell: (bill: Bill) => <BillStatusBadge status={bill.status} />,
        accessorKey: 'status' as const,
    },
    {
        header: 'Fecha de emisión',
        cell: (bill: Bill) => bill.issueDate,
        accessorKey: 'issueDate' as const,
    },
    {
        header: 'Fecha de vencimiento',
        cell: (bill: Bill) => bill.dueDate,
        accessorKey: 'dueDate' as const,
    },
    {
        header: 'Descripción',
        cell: (bill: Bill) => bill.description,
        accessorKey: 'description' as const,
    },
];

export const BillingProfileDetail = ({ id }: { id: string }) => {
    const router = useRouter();

    return (
        <main className="rounded-lg border border-accent bg-background-primary p-4">
            <div className="flex justify-between">
                <TypographyH1 className="mb-2">Perfil de Facturación #{id}</TypographyH1>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.push(routesBuilder.accounting.billingProfiles.list())
                        }
                    >
                        Volver
                    </Button>
                    <Button
                        onClick={() =>
                            router.push(routesBuilder.accounting.billingProfiles.edit(id))
                        }
                    >
                        Editar
                    </Button>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <div>
                    <Title>Empresa</Title>
                    <p className="mb-1">{mockBillingProfile.business}</p>
                </div>

                <div>
                    <Title>Nombre Comercial</Title>
                    <p className="mb-1">{mockBillingProfile.businessName}</p>
                </div>

                <div>
                    <Title>CUIT</Title>
                    <p className="mb-1">{mockBillingProfile.cuit}</p>
                </div>

                <div>
                    <Title>Razón Social</Title>
                    <p className="mb-1">{mockBillingProfile.legalName}</p>
                </div>

                <div>
                    <Title>Condición frente al IVA</Title>
                    <p className="mb-1">{mockBillingProfile.taxCondition}</p>
                </div>

                <div>
                    <Title>Domicilio Comercial</Title>
                    <p className="mb-1">{mockBillingProfile.billingAddress}</p>
                </div>

                <div>
                    <Title>Email de Facturación</Title>
                    <p className="mb-1">{mockBillingProfile.billingEmail}</p>
                </div>

                <div>
                    <Title>Contactos</Title>
                    <div className="space-y-4">
                        {mockBillingProfile.contacts.map((contact, index) => (
                            <div
                                key={index}
                                className="rounded-md border border-accent bg-background-primary p-4"
                            >
                                <p className="font-semibold">{contact.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {contact.email}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {contact.phone}
                                </p>
                                {contact.notes && (
                                    <p className="text-sm text-muted-foreground">
                                        {contact.notes}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <Title>Facturas emitidas</Title>
                    <DataList
                        data={[...mockBillingProfile.bills].sort((a, b) =>
                            a.status === 'Vencida' ? -1 : b.status === 'Vencida' ? 1 : 0,
                        )}
                        columns={billColumns}
                        onRowClick={(bill) =>
                            router.push(routesBuilder.accounting.billing.details(bill.id))
                        }
                        emptyMessage="No hay facturas emitidas"
                    />
                </div>
            </div>
        </main>
    );
};
