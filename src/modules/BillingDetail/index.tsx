import { useRouter } from 'next/router';

import { RiDownloadLine } from 'react-icons/ri';

import { Button } from '@/components/ui/button';
import { TypographyH1 } from '@/components/ui/typography';
import { routesBuilder } from '@/lib/routes';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold text-primary-foreground">{children}</h2>
);

// Mock data - Reemplazar con datos reales de la API
const mockBill = {
    id: '1',
    business: {
        name: 'Empresa A',
        cuit: '30-12345678-9',
        legalName: 'Empresa A S.A.',
        ivaCondition: 'Responsable Inscripto',
        billingAddress: 'Av. Siempreviva 742, Springfield',
    },
    details: [
        {
            id: '1',
            description: 'Servicios de mantenimiento preventivo - Marzo 2024',
            amount: 150000,
        },
        {
            id: '2',
            description: 'Instalación de equipos nuevos',
            amount: 280000,
        },
    ],
    contactName: 'Juan Pérez',
    contactEmail: 'juan.perez@empresaa.com',
    billingEmail: 'facturacion@empresaa.com',
    description: 'Facturación servicios técnicos Marzo 2024',
    totalAmount: 430000,
    pdfUrl: '/facturas/factura-1.pdf', // Mock URL
};

const calculateIVA = (amount: number) => amount * 0.21;
const calculateTotal = (amount: number) => amount + calculateIVA(amount);

export const BillingDetail = ({ id }: { id: string }) => {
    const router = useRouter();

    const handleDownloadPDF = () => {
        // TODO: Implementar descarga real del PDF
        console.log('Descargando PDF de factura:', id);
    };

    return (
        <main className="rounded-lg border border-accent bg-background-primary p-4">
            <div className="flex justify-between">
                <TypographyH1 className="mb-2">Factura #{id}</TypographyH1>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.push(routesBuilder.accounting.billing.list())
                        }
                    >
                        Volver
                    </Button>
                    <Button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2"
                    >
                        <RiDownloadLine />
                        Descargar PDF
                    </Button>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <section>
                    <Title>Datos de la empresa</Title>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">Empresa</p>
                            <p className="text-muted-foreground">
                                {mockBill.business.name}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold">CUIT</p>
                            <p className="text-muted-foreground">
                                {mockBill.business.cuit}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold">Razón Social</p>
                            <p className="text-muted-foreground">
                                {mockBill.business.legalName}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold">Condición IVA</p>
                            <p className="text-muted-foreground">
                                {mockBill.business.ivaCondition}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="font-semibold">Dirección de facturación</p>
                            <p className="text-muted-foreground">
                                {mockBill.business.billingAddress}
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <Title>Descripción</Title>
                    <p className="text-muted-foreground">{mockBill.description}</p>
                </section>

                <section>
                    <Title>Detalles de facturación</Title>
                    <div className="space-y-2">
                        {mockBill.details.map((detail) => (
                            <div
                                key={detail.id}
                                className="flex flex-col rounded-lg border border-accent p-3"
                            >
                                <div className="flex justify-between">
                                    <p>{detail.description}</p>
                                </div>
                                <div className="mt-2 flex flex-col items-end text-sm">
                                    <p className="text-muted-foreground">
                                        Subtotal:{' '}
                                        {detail.amount.toLocaleString('es-AR', {
                                            style: 'currency',
                                            currency: 'ARS',
                                        })}
                                    </p>
                                    <p className="text-muted-foreground">
                                        IVA (21%):{' '}
                                        {calculateIVA(detail.amount).toLocaleString(
                                            'es-AR',
                                            {
                                                style: 'currency',
                                                currency: 'ARS',
                                            },
                                        )}
                                    </p>
                                    <p className="font-semibold">
                                        Total:{' '}
                                        {calculateTotal(detail.amount).toLocaleString(
                                            'es-AR',
                                            {
                                                style: 'currency',
                                                currency: 'ARS',
                                            },
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-lg bg-muted p-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-sm">
                            <p>Subtotal</p>
                            <p>
                                {mockBill.totalAmount.toLocaleString('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                })}
                            </p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p>IVA (21%)</p>
                            <p>
                                {calculateIVA(mockBill.totalAmount).toLocaleString(
                                    'es-AR',
                                    {
                                        style: 'currency',
                                        currency: 'ARS',
                                    },
                                )}
                            </p>
                        </div>
                        <div className="flex justify-between border-t border-border pt-1">
                            <Title>Total</Title>
                            <p className="text-xl font-bold">
                                {calculateTotal(mockBill.totalAmount).toLocaleString(
                                    'es-AR',
                                    {
                                        style: 'currency',
                                        currency: 'ARS',
                                    },
                                )}
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <Title>Datos de contacto</Title>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">Nombre de contacto</p>
                            <p className="text-muted-foreground">
                                {mockBill.contactName}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold">Email de contacto</p>
                            <a
                                href={`mailto:${mockBill.contactEmail}`}
                                className="text-primary hover:underline"
                            >
                                {mockBill.contactEmail}
                            </a>
                        </div>
                        <div>
                            <p className="font-semibold">Email de facturación</p>
                            <a
                                href={`mailto:${mockBill.billingEmail}`}
                                className="text-primary hover:underline"
                            >
                                {mockBill.billingEmail}
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};
