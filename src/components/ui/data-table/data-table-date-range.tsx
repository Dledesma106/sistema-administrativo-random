import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateRange {
    from?: Date;
    to?: Date;
}

interface DataTableDateRangeProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
    title: string;
}

export function DataTableDateRange({ value, onChange, title }: DataTableDateRangeProps) {
    // Estado interno para manejar las fechas temporales
    const [tempRange, setTempRange] = useState<DateRange>({
        from: value.from,
        to: value.to,
    });

    // Estado para controlar si el popover está abierto
    const [isOpen, setIsOpen] = useState(false);

    // Actualizar el estado temporal cuando cambian las props
    useEffect(() => {
        setTempRange({
            from: value.from,
            to: value.to,
        });
    }, [value.from, value.to]);

    const handleFromDateSelect = (date: Date | undefined) => {
        if (!date) {
            setTempRange({ ...tempRange, from: undefined });
            return;
        }

        if (tempRange.to && date > tempRange.to) {
            setTempRange({ from: date, to: date });
            return;
        }

        setTempRange({ ...tempRange, from: date });
    };

    const handleToDateSelect = (date: Date | undefined) => {
        if (!date) {
            setTempRange({ ...tempRange, to: undefined });
            return;
        }

        if (tempRange.from && date < tempRange.from) {
            setTempRange({ from: date, to: date });
            return;
        }

        setTempRange({ ...tempRange, to: date });
    };

    // Función para aplicar el rango cuando se cierra el popover
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);

        // Si se está cerrando el popover y ambas fechas están seleccionadas
        if (!open && tempRange.from && tempRange.to) {
            onChange(tempRange);
        } else if (!open) {
            // Si se cierra sin ambas fechas, restauramos al valor original
            setTempRange({
                from: value.from,
                to: value.to,
            });
        }
    };

    // Función para aplicar el rango manualmente
    const applyRange = () => {
        if (tempRange.from && tempRange.to) {
            onChange(tempRange);
            setIsOpen(false);
        }
    };

    // Función para limpiar el rango
    const clearRange = () => {
        setTempRange({ from: undefined, to: undefined });
        onChange({ from: undefined, to: undefined });
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        'h-8 border-dashed',
                        value.from && value.to && 'border-solid',
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value.from && value.to ? (
                        <>
                            {format(value.from, 'dd/MM/yy', { locale: es })} -{' '}
                            {format(value.to, 'dd/MM/yy', { locale: es })}
                        </>
                    ) : (
                        title
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto bg-background p-3"
                align="start"
                sideOffset={4}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4">
                        <div>
                            <p className="mb-2 text-sm font-medium">Desde</p>
                            <Calendar
                                mode="single"
                                selected={tempRange.from}
                                onSelect={handleFromDateSelect}
                                defaultMonth={tempRange.from}
                                locale={es}
                            />
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium">Hasta</p>
                            <Calendar
                                mode="single"
                                selected={tempRange.to}
                                onSelect={handleToDateSelect}
                                defaultMonth={tempRange.to || tempRange.from}
                                locale={es}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={clearRange}>
                            Limpiar
                        </Button>
                        <Button
                            size="sm"
                            onClick={applyRange}
                            disabled={!tempRange.from || !tempRange.to}
                        >
                            Aplicar
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
