import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';

import { FormValues, PaymentCondition } from './types';

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
import { cn, paymentConditionLabel } from '@/lib/utils';
import { AFIP_CBTE_TIPO, AFIP_CBTE_TIPO_LABELS } from 'backend/services/afip/types';

const paymentConditions: { value: PaymentCondition; label: string }[] = Object.values(
    PaymentCondition,
).map((condition) => ({
    value: condition,
    label: paymentConditionLabel(condition),
}));

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

export interface InvoiceSectionProps {
    disabled?: boolean;
}

export const InvoiceSection = ({ disabled }: InvoiceSectionProps) => {
    const form = useFormContext<FormValues>();
    const isSingleService = form.watch('isSingleService');
    const paymentCondition = form.watch('paymentCondition');
    // Obtener puntos de venta de AFIP
    const { data: salesPointsData } = useGetAfipSalesPoints();
    const salesPoints = salesPointsData?.afipSalesPoints || [];

    const salesPointOptions = salesPoints
        .filter((sp) => !sp.blocked)
        .map((sp) => ({
            value: sp.number.toString(),
            label: `${sp.number.toString().padStart(4, '0')} - ${sp.type}`,
        }));

    return (
        <section className="space-y-4 rounded-lg border border-accent p-4">
            <h3 className="text-lg font-semibold">Datos de la Factura</h3>

            <div className="grid grid-cols-3 gap-4">
                {/* Punto de venta */}
                <FormField
                    control={form.control}
                    disabled={disabled}
                    name="pointOfSale"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Punto de Venta</FormLabel>
                            <FormControl>
                                <Combobox
                                    items={salesPointOptions}
                                    value={field.value?.toString() || ''}
                                    disabled={disabled}
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
                    disabled={disabled}
                    name="comprobanteType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Comprobante</FormLabel>
                            <FormControl>
                                <Combobox
                                    items={invoiceTypes}
                                    disabled={disabled}
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
                    disabled={disabled}
                    name="paymentCondition"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Condición de Venta</FormLabel>
                            <FormControl>
                                <Combobox
                                    items={paymentConditions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                    selectPlaceholder="Seleccione condición"
                                    searchPlaceholder="Buscar condición"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {!disabled && (
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
                                        Marcar si el servicio se realizó en una única
                                        fecha
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
            )}

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
                                            disabled={disabled}
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
                        disabled={disabled}
                        name="dateTo"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Fecha hasta</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                disabled={disabled}
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
                {!['15Dias', '30Dias', '60Dias', '90Dias'].includes(paymentCondition) ||
                disabled ? (
                    <FormField
                        control={form.control}
                        disabled={disabled}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Fecha de vencimiento</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                disabled={disabled}
                                                className={cn(
                                                    'pl-3 text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value!, 'dd/MM/yyyy')
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
                ) : (
                    <FormItem className="flex flex-col">
                        <FormLabel>Fecha de vencimiento</FormLabel>
                        <div className="h-10 text-ellipsis rounded-md border border-accent bg-muted px-3 py-2 text-sm">
                            {paymentConditionLabel(paymentCondition)} luego de que se
                            emita la factura
                        </div>
                    </FormItem>
                )}
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
