import { useRouter } from 'next/router';

import { BillStatus } from '@prisma/client';
import { useState } from 'react';
import { RiDownloadLine } from 'react-icons/ri';

import { billDetailColumns } from './columns';

import { BillStatusBadge } from '@/components/ui/Badges/BillStatusBadge';
import { Button } from '@/components/ui/button';
import { DataList } from '@/components/ui/data-list';
import { TypographyH1 } from '@/components/ui/typography';
import { useGetBillById, useEmitBill } from '@/hooks/api/bill';
import { routesBuilder } from '@/lib/routes';
import { pascalCaseToSpaces } from '@/lib/utils';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold text-primary-foreground">{children}</h2>
);

export const BillingDetail = ({ id }: { id: string }) => {
    const router = useRouter();
    const emitBillMutation = useEmitBill();
    const [isEmitting, setIsEmitting] = useState(false);

    const { data: billData } = useGetBillById(id);

    if (!billData?.bill) {
        return <div>Factura no encontrada</div>;
    }

    const handleDownloadPDF = () => {
        // TODO: Implementar descarga real del PDF
        console.log('Descargando PDF de factura:', id);
    };

    // Emitir factura

    const handleEmit = async () => {
        const confirm = window.confirm(
            '¿Estás seguro que deseas emitir esta factura? Esta acción enviará la factura a AFIP y no se puede deshacer.',
        );
        if (!confirm) {
            return;
        }

        try {
            setIsEmitting(true);
            await emitBillMutation.mutateAsync({ id });
        } catch (error) {
            console.error('Error emitiendo factura:', error);
        } finally {
            setIsEmitting(false);
        }
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
                    {billData?.bill?.status === BillStatus.Pendiente && (
                        <Button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2"
                        >
                            <RiDownloadLine />
                            Descargar PDF
                        </Button>
                    )}
                    <Button
                        onClick={() =>
                            router.push(routesBuilder.accounting.billing.edit(id))
                        }
                    >
                        Editar
                    </Button>

                    {billData?.bill?.status === 'Borrador' && (
                        <Button
                            onClick={handleEmit}
                            disabled={isEmitting}
                            className="bg-primary text-primary-foreground"
                        >
                            {isEmitting ? 'Emitiendo...' : 'Emitir factura'}
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <section className="rounded-lg border border-accent p-4">
                    <Title>Datos de la empresa</Title>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">Empresa</p>
                            <p className="text-muted-foreground">
                                {billData.bill.business.name}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold">
                                {billData.bill.billingProfile.tipoDocumento ||
                                    'Numero de documento'}
                            </p>
                            <p className="text-muted-foreground">
                                {billData.bill.billingProfile.numeroDocumento}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold">Razón Social</p>
                            <p className="text-muted-foreground">
                                {billData.bill.billingProfile.legalName}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold">Condición IVA</p>
                            <p className="text-muted-foreground">
                                {pascalCaseToSpaces(billData.bill.IVACondition)}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="font-semibold">Dirección de facturación</p>
                            <p className="text-muted-foreground">
                                {billData.bill.billingProfile.comercialAddress}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <div>
                        <Title>Descripción</Title>
                        <p className="text-muted-foreground">
                            {billData.bill.description}
                        </p>
                    </div>

                    <div>
                        <Title>Estado</Title>
                        <BillStatusBadge status={billData.bill.status} />
                    </div>
                </section>

                <section>
                    <Title>Detalles de facturación</Title>
                    <div className="space-y-2">
                        <DataList
                            data={billData.bill.details || []}
                            columns={billDetailColumns}
                            emptyMessage="No hay detalles"
                        />
                    </div>
                </section>

                <section className="rounded-lg bg-muted p-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-sm">
                            <p>Subtotal</p>
                            <p>
                                {billData.bill.taxableNetAmount?.toLocaleString('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                })}
                            </p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p>IVA (21%)</p>
                            <p>
                                {billData.bill.ivaAmount?.toLocaleString('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                })}
                            </p>
                        </div>
                        <div className="flex justify-between border-t border-border pt-1">
                            <Title>Total</Title>
                            <p className="text-xl font-bold">
                                {billData.bill.totalAmount?.toLocaleString('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                })}
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
                                {billData.bill.billingProfile.firstContact?.fullName}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold">Email de contacto</p>
                            <a
                                href={`mailto:${billData.bill.billingProfile.firstContact?.email}`}
                                className="text-primary hover:underline"
                            >
                                {billData.bill.billingProfile.firstContact?.email}
                            </a>
                        </div>
                        <div>
                            <p className="font-semibold">Emails de facturación</p>
                            <div className="flex flex-col gap-0">
                                {billData.bill.billingProfile.billingEmails.map(
                                    (email) => (
                                        <a
                                            key={email}
                                            href={`mailto:${email}`}
                                            className="text-primary hover:underline"
                                        >
                                            {email}
                                        </a>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};
