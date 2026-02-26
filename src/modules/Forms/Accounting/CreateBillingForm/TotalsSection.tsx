import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { FormValues, calculateBillTotals } from './types';

import { AlicuotaIva } from '@/api/graphql';

const Title = ({ children }: { children: React.ReactNode }) => (
    <span className="text-sm font-medium text-muted-foreground">{children}</span>
);

const AlicuotaLabels: Record<AlicuotaIva, string> = {
    NoGravado: 'No Gravado',
    Exento: 'Exento',
    IVA_0: '0%',
    IVA_2_5: '2.5%',
    IVA_5: '5%',
    IVA_10_5: '10.5%',
    IVA_21: '21%',
    IVA_27: '27%',
};

export const TotalsSection = () => {
    const form = useFormContext<FormValues>();
    const details = useWatch({
        control: form.control,
        name: 'details',
    });
    const comprobanteType = useWatch({
        control: form.control,
        name: 'comprobanteType',
    });
    const withholdingAmount = useWatch({
        control: form.control,
        name: 'withholdingAmount',
    });

    const totals = useMemo(() => {
        if (!details?.length) {
            return {
                taxableNetAmount: 0,
                nonTaxableNetAmount: 0,
                exemptAmount: 0,
                ivaAmount: 0,
                tributesAmount: 0,
                totalAmount: 0,
                ivaBreakdown: [],
            };
        }

        return calculateBillTotals(details);
    }, [details]);

    // Determinar si mostrar IVA discriminado (Factura A muestra IVA discriminado)
    const showIvaBreakdown =
        comprobanteType?.includes('A') || comprobanteType?.includes('M');

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
        });
    };

    // Calcular el total a pagar (menos retenciones si aplica)
    const totalToPay = totals.totalAmount - (withholdingAmount || 0);

    return (
        <section className="space-y-4 rounded-lg border border-accent bg-muted p-4">
            <h3 className="text-lg font-semibold">Resumen de Importes</h3>

            <div className="space-y-3">
                {/* Desglose de importes */}
                {/* Importe neto gravado */}
                {totals.taxableNetAmount > 0 && (
                    <div className="flex items-center justify-between">
                        <Title>Importe Neto Gravado</Title>
                        <span className="text-right">
                            {formatCurrency(totals.taxableNetAmount)}
                        </span>
                    </div>
                )}

                {/* Importe neto no gravado */}
                {totals.nonTaxableNetAmount > 0 && (
                    <div className="flex items-center justify-between">
                        <Title>Importe Neto No Gravado</Title>
                        <span className="text-right">
                            {formatCurrency(totals.nonTaxableNetAmount)}
                        </span>
                    </div>
                )}

                {/* Importe exento */}
                {totals.exemptAmount > 0 && (
                    <div className="flex items-center justify-between">
                        <Title>Importe Exento</Title>
                        <span className="text-right">
                            {formatCurrency(totals.exemptAmount)}
                        </span>
                    </div>
                )}

                {/* Desglose de IVA por alícuota (solo Factura A) */}
                {showIvaBreakdown && totals.ivaBreakdown.length > 0 && (
                    <div className="space-y-2 border-t border-accent pt-2">
                        <span className="text-sm font-medium">IVA Discriminado:</span>
                        {totals.ivaBreakdown.map((item) => (
                            <div
                                key={item.alicuota}
                                className="flex items-center justify-between pl-4 text-sm"
                            >
                                <span className="text-muted-foreground">
                                    IVA {AlicuotaLabels[item.alicuota]} sobre{' '}
                                    {formatCurrency(item.baseAmount)}
                                </span>
                                <span className="text-right">
                                    {formatCurrency(item.ivaAmount)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* IVA total (solo si no se muestra desglose) */}
                {!showIvaBreakdown && totals.ivaAmount > 0 && (
                    <div className="flex items-center justify-between">
                        <Title>IVA</Title>
                        <span className="text-right">
                            {formatCurrency(totals.ivaAmount)}
                        </span>
                    </div>
                )}

                {/* Tributos */}
                {totals.tributesAmount > 0 && (
                    <div className="flex items-center justify-between">
                        <Title>Otros Tributos</Title>
                        <span className="text-right">
                            {formatCurrency(totals.tributesAmount)}
                        </span>
                    </div>
                )}

                {/* Línea separadora */}
                <div className="border-t border-accent"></div>

                {/* Totales */}
                {/* Subtotal antes de retenciones */}
                <div className="flex items-center justify-between">
                    <span className="font-semibold">Importe Total</span>
                    <span className="text-right text-lg font-semibold">
                        {formatCurrency(totals.totalAmount)}
                    </span>
                </div>

                {/* Retenciones (si aplica) */}
                {withholdingAmount && withholdingAmount > 0 && (
                    <>
                        <div className="flex items-center justify-between text-red-600">
                            <Title>Retenciones</Title>
                            <span className="text-right">
                                - {formatCurrency(withholdingAmount)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-lg font-bold">Total a Pagar</span>
                            <span className="text-right text-lg font-bold text-primary">
                                {formatCurrency(totalToPay)}
                            </span>
                        </div>
                    </>
                )}

                {/* Si no hay retenciones, mostrar el total principal más destacado */}
                {(!withholdingAmount || withholdingAmount === 0) && (
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">Total a Pagar</span>
                        <span className="text-right text-xl font-bold text-primary">
                            {formatCurrency(totals.totalAmount)}
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
};
