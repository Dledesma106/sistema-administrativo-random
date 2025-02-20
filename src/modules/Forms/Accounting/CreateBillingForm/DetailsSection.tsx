import { useFieldArray, useFormContext } from 'react-hook-form';
import { BsPlus, BsTrash } from 'react-icons/bs';

import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const IVA_RATES = [
    {
        value: '21',
        label: '21%',
    },
    {
        value: '10.5',
        label: '10.5%',
    },
    {
        value: '27',
        label: '27%',
    },
    {
        value: '0',
        label: '0%',
    },
];

export const DetailsSection = () => {
    const form = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'details',
    });

    const calculateSubtotal = (quantity: number, unitPrice: number) => {
        return quantity * unitPrice;
    };

    const calculateSubtotalWithIva = (subtotal: number, ivaRate: number) => {
        return subtotal * (1 + ivaRate / 100);
    };

    const handleDetailChange = (index: number, field: string, value: any) => {
        const currentDetail = form.getValues(`details.${index}`);
        let updates: any = { [field]: value };

        // Recalcular subtotales cuando cambia cantidad, precio o IVA
        if (['quantity', 'unitPrice', 'ivaRate'].includes(field)) {
            const quantity = field === 'quantity' ? value : currentDetail.quantity;
            const unitPrice = field === 'unitPrice' ? value : currentDetail.unitPrice;
            const ivaRate = field === 'ivaRate' ? value : currentDetail.ivaRate;

            const subtotal = calculateSubtotal(quantity, unitPrice);
            const subtotalWithIva = calculateSubtotalWithIva(subtotal, ivaRate);

            updates = {
                ...updates,
                subtotal,
                subtotalWithIva,
            };
        }

        Object.entries(updates).forEach(([key, value]) => {
            form.setValue(`details.${index}.${key}`, value, {
                shouldValidate: true,
            });
        });
    };

    return (
        <section className="space-y-4 rounded-lg border border-accent p-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Detalles</h3>
                <Button
                    type="button"
                    onClick={() =>
                        append({
                            description: '',
                            quantity: 1,
                            unitPrice: 0,
                            ivaRate: 21,
                            subtotal: 0,
                            subtotalWithIva: 0,
                        })
                    }
                    className="flex items-center gap-1"
                >
                    <BsPlus size={20} />
                    Agregar detalle
                </Button>
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="grid grid-cols-12 gap-4 rounded-lg border border-accent p-4"
                    >
                        <FormField
                            control={form.control}
                            name={`details.${index}.description`}
                            render={({ field }) => (
                                <FormItem className="col-span-12">
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) =>
                                                handleDetailChange(
                                                    index,
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`details.${index}.quantity`}
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Cantidad</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={1}
                                            onChange={(e) =>
                                                handleDetailChange(
                                                    index,
                                                    'quantity',
                                                    parseInt(e.target.value),
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`details.${index}.unitPrice`}
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Precio unitario</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            onChange={(e) =>
                                                handleDetailChange(
                                                    index,
                                                    'unitPrice',
                                                    parseFloat(e.target.value),
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`details.${index}.ivaRate`}
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Alícuota IVA</FormLabel>
                                    <Select
                                        value={field.value.toString()}
                                        onValueChange={(value) =>
                                            handleDetailChange(
                                                index,
                                                'ivaRate',
                                                parseFloat(value),
                                            )
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {IVA_RATES.map((rate) => (
                                                <SelectItem
                                                    key={rate.value}
                                                    value={rate.value}
                                                >
                                                    {rate.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`details.${index}.subtotal`}
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Subtotal</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`details.${index}.subtotalWithIva`}
                            render={({ field }) => (
                                <FormItem className="col-span-3">
                                    <FormLabel>Subtotal con IVA</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="col-span-1 mt-8"
                            onClick={() => remove(index)}
                        >
                            <BsTrash size={16} />
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
};
