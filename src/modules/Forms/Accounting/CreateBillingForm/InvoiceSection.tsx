import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import {
    FormValues,
    PaymentCondition,
    calculateDueDate,
    PAYMENT_CONDITION_DAYS,
} from './types';

import { ComprobanteType } from '@/api/graphql';
import Combobox from '@/components/Combobox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGetAfipSalesPoints } from '@/hooks/api/bill';
import { cn } from '@/lib/utils';
import { AFIP_CBTE_TIPO, AFIP_CBTE_TIPO_LABELS } from 'backend/services/afip/types';

const paymentConditions: { value: PaymentCondition; label: string }[] = [
    {
        value: 'Contado',
        label: 'Contado',
    },
    {
        value: 'CuentaCorriente',
        label: 'Cuenta Corriente',
    },
    {
        value: 'Cheque',
        label: 'Cheque',
    },
    {
        value: 'Transferencia',
        label: 'Transferencia',
    },
    {
        value: '15dias',
        label: '15 días',
    },
    {
        value: '30dias',
        label: '30 días',
    },
    {
        value: '60dias',
        label: '60 días',
    },
    {
        value: '90dias',
        label: '90 días',
    },
    {
        value: 'TarjetaCredito',
        label: 'Tarjeta de Crédito',
    },
    {
        value: 'Otros',
        label: 'Otros',
    },
];

// Mapeo de AfipCbteTipo (número) a ComprobanteType (string)
const AFIP_TO_COMPROBANTE_TYPE: Record<number, ComprobanteType> = {
    [AFIP_CBTE_TIPO.FACTURA_A]: ComprobanteType.FacturaA,
    [AFIP_CBTE_TIPO.NOTA_DEBITO_A]: ComprobanteType.NotaDebitoA,
    [AFIP_CBTE_TIPO.NOTA_CREDITO_A]: ComprobanteType.NotaCreditoA,
    [AFIP_CBTE_TIPO.FACTURA_B]: ComprobanteType.FacturaB,
    [AFIP_CBTE_TIPO.NOTA_DEBITO_B]: ComprobanteType.NotaDebitoB,
    [AFIP_CBTE_TIPO.NOTA_CREDITO_B]: ComprobanteType.NotaCreditoB,
    [AFIP_CBTE_TIPO.FACTURA_C]: ComprobanteType.FacturaC,
    [AFIP_CBTE_TIPO.NOTA_DEBITO_C]: ComprobanteType.NotaDebitoC,
    [AFIP_CBTE_TIPO.NOTA_CREDITO_C]: ComprobanteType.NotaCreditoC,
    [AFIP_CBTE_TIPO.FACTURA_M]: ComprobanteType.FacturaM,
    [AFIP_CBTE_TIPO.NOTA_DEBITO_M]: ComprobanteType.NotaDebitoM,
    [AFIP_CBTE_TIPO.NOTA_CREDITO_M]: ComprobanteType.NotaCreditoM,
    [AFIP_CBTE_TIPO.FACTURA_E]: ComprobanteType.FacturaE,
    [AFIP_CBTE_TIPO.NOTA_DEBITO_E]: ComprobanteType.NotaDebitoE,
    [AFIP_CBTE_TIPO.NOTA_CREDITO_E]: ComprobanteType.NotaCreditoE,
};

// Tipos de comprobante más comunes - usando ComprobanteType (string) para el Combobox
const invoiceTypes: { value: string; label: string }[] = Object.entries(
    AFIP_CBTE_TIPO_LABELS,
).map(([afipCode, label]) => {
    const code = Number(afipCode);
    const comprobanteType = AFIP_TO_COMPROBANTE_TYPE[code];
    return {
        value: comprobanteType || '',
        label,
    };
});

export const InvoiceSection = () => {
    const form = useFormContext<FormValues>();
    const isSingleService = form.watch('isSingleService');
    const paymentCondition = form.watch('paymentCondition');
    const dateFrom = form.watch('dateFrom');

    // Obtener puntos de venta de AFIP
    const { data: salesPointsData } = useGetAfipSalesPoints();
    const salesPoints = salesPointsData?.afipSalesPoints || [];

    const salesPointOptions = salesPoints
        .filter((sp) => !sp.blocked)
        .map((sp) => ({
            value: sp.number.toString(),
            label: `${sp.number.toString().padStart(4, '0')} - ${sp.type}`,
        }));

    // Calcular automáticamente la fecha de vencimiento cuando cambia la condición de pago
    useEffect(() => {
        if (!paymentCondition) {
            return;
        }

        const days = PAYMENT_CONDITION_DAYS[paymentCondition];

        // Solo calcular si tiene días definidos (no es null)
        if (days !== null) {
            const baseDate = dateFrom || new Date();
            const calculatedDueDate = calculateDueDate(paymentCondition, baseDate);

            if (calculatedDueDate) {
                // Obtener la fecha actual del formulario
                const currentDueDate = form.getValues('dueDate');

                // Solo actualizar si la fecha calculada es diferente a la actual
                // Comparar fechas sin horas para evitar loops infinitos
                if (
                    !currentDueDate ||
                    currentDueDate.getTime() !== calculatedDueDate.getTime()
                ) {
                    form.setValue('dueDate', calculatedDueDate, {
                        shouldValidate: true,
                        shouldDirty: false, // No marcar como "dirty" porque es cálculo automático
                    });
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentCondition, dateFrom]); // Removido 'form' de las dependencias porque es estable

    // Verificar si la fecha de vencimiento es editable
    const isDueDateEditable = paymentCondition
        ? PAYMENT_CONDITION_DAYS[paymentCondition] === null
        : true;

    return (
        <section className="space-y-4 rounded-lg border border-accent p-4">
            <h3 className="text-lg font-semibold">Datos de la Factura</h3>

            <div className="grid grid-cols-3 gap-4">
                {/* Punto de venta */}
                <FormField
                    control={form.control}
                    name="pointOfSale"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Punto de Venta</FormLabel>
                            <FormControl>
                                <Combobox
                                    items={salesPointOptions}
                                    value={field.value?.toString() || ''}
                                    onChange={(value) =>
                                        field.onChange(value ? parseInt(value) : null)
                                    }
                                    selectPlaceholder="Seleccione punto de venta"
                                    searchPlaceholder="Buscar..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Tipo de comprobante */}
                <FormField
                    control={form.control}
                    name="comprobanteType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Comprobante</FormLabel>
                            <FormControl>
                                <Combobox
                                    items={invoiceTypes}
                                    value={field.value || ''}
                                    onChange={(value) =>
                                        field.onChange(value || undefined)
                                    }
                                    selectPlaceholder="Seleccione tipo"
                                    searchPlaceholder="Buscar tipo"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Condición de venta */}
                <FormField
                    control={form.control}
                    name="paymentCondition"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Condición de Venta</FormLabel>
                            <FormControl>
                                <Combobox
                                    items={paymentConditions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    selectPlaceholder="Seleccione condición"
                                    searchPlaceholder="Buscar condición"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Servicio puntual */}
                <FormField
                    control={form.control}
                    name="isSingleService"
                    render={({ field }) => (
                        <FormItem className="col-span-2 flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Servicio puntual</FormLabel>
                                <FormDescription>
                                    Marcar si el servicio se realizó en una única fecha
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                {/* Fecha desde / Fecha de servicio */}
                <FormField
                    control={form.control}
                    name="dateFrom"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>
                                {isSingleService ? 'Fecha de servicio' : 'Fecha desde'}
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'pl-3 text-left font-normal',
                                                !field.value && 'text-muted-foreground',
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, 'dd/MM/yyyy')
                                            ) : (
                                                <span>Seleccione fecha</span>
                                            )}
                                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() ||
                                            date < new Date('1900-01-01')
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Fecha hasta (solo si no es servicio puntual) */}
                {!isSingleService && (
                    <FormField
                        control={form.control}
                        name="dateTo"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Fecha hasta</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'pl-3 text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'dd/MM/yyyy')
                                                ) : (
                                                    <span>Seleccione fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() ||
                                                date < new Date('1900-01-01')
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Fecha de vencimiento */}
                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>
                                Fecha de vencimiento
                                {!isDueDateEditable && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        (calculada automáticamente)
                                    </span>
                                )}
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'pl-3 text-left font-normal',
                                                !field.value && 'text-muted-foreground',
                                                !isDueDateEditable && 'bg-muted',
                                            )}
                                            disabled={!isDueDateEditable}
                                        >
                                            {field.value ? (
                                                format(field.value, 'dd/MM/yyyy')
                                            ) : (
                                                <span>Seleccione fecha</span>
                                            )}
                                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date('1900-01-01')}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Observaciones */}
            <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Observaciones</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="Observaciones opcionales para la factura"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </section>
    );
};
