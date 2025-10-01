import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';

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
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const paymentConditions = [
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

const invoiceTypes = [
    {
        value: 'A',
        label: 'Factura A',
    },
    {
        value: 'B',
        label: 'Factura B',
    },
    {
        value: 'C',
        label: 'Factura C',
    },
];

export const InvoiceSection = () => {
    const form = useFormContext();
    const isSingleService = form.watch('isSingleService');

    return (
        <section className="space-y-4 rounded-lg border border-accent p-4">
            <h3 className="text-lg font-semibold">Datos de la Factura</h3>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="invoiceType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Comprobante</FormLabel>
                            <FormControl>
                                <Combobox
                                    items={invoiceTypes}
                                    value={field.value}
                                    onChange={field.onChange}
                                    selectPlaceholder="Seleccione tipo"
                                    searchPlaceholder="Buscar tipo"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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

                <FormField
                    control={form.control}
                    name="isSingleService"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Servicio puntual</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="col-span-2 grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="dateFrom"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Fecha {isSingleService ? 'de servicio' : 'desde'}
                                </FormLabel>
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
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
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

                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Fecha de vencimiento</FormLabel>
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
                </div>
            </div>
        </section>
    );
};
