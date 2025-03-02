import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-sm font-semibold text-muted-foreground">{children}</h2>
);

export const TotalsSection = () => {
    const form = useFormContext();
    const details = useWatch({
        control: form.control,
        name: 'details',
    });
    const invoiceType = useWatch({
        control: form.control,
        name: 'invoiceType',
    });

    const totals = useMemo(() => {
        const initialTotals = {
            netAmount: 0,
            ivaAmount: 0,
            otherTaxes: 0,
            total: 0,
        };

        if (!details?.length) {
            return initialTotals;
        }

        return details.reduce(
            (acc: typeof initialTotals, detail: (typeof details)[0]) => {
                const subtotal = detail.subtotal || 0;
                const subtotalWithIva = detail.subtotalWithIva || 0;
                const ivaAmount = subtotalWithIva - subtotal;

                return {
                    netAmount: acc.netAmount + subtotal,
                    ivaAmount: acc.ivaAmount + ivaAmount,
                    otherTaxes: acc.otherTaxes, // Por ahora en 0
                    total: acc.total + subtotalWithIva,
                };
            },
            { ...initialTotals },
        );
    }, [details]);

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
        });
    };

    return (
        <section className="space-y-4 rounded-lg border border-accent bg-muted p-4">
            <h3 className="text-lg font-semibold">Totales</h3>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <Title>Importe neto gravado</Title>
                    <p>{formatCurrency(totals.netAmount)}</p>
                </div>

                {invoiceType === 'A' && (
                    <div className="flex justify-between">
                        <Title>IVA discriminado</Title>
                        <p>{formatCurrency(totals.ivaAmount)}</p>
                    </div>
                )}

                {totals.otherTaxes > 0 && (
                    <div className="flex justify-between">
                        <Title>Otros impuestos</Title>
                        <p>{formatCurrency(totals.otherTaxes)}</p>
                    </div>
                )}

                <div className="flex justify-between border-t border-border pt-2">
                    <h3 className="text-lg font-bold">Total</h3>
                    <p className="text-lg font-bold">{formatCurrency(totals.total)}</p>
                </div>
            </div>
        </section>
    );
};
