import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';
import * as React from 'react';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/Badges/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { SelectableList } from '@/components/ui/SelectableList';

interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>;
    title?: string;
    options: {
        label: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
}

export function DataTableFacetedFilter<TData, TValue>({
    column,
    title,
    options,
}: DataTableFacetedFilterProps<TData, TValue>) {
    const [open, setOpen] = useState(false);
    const [localSelectedValues, setLocalSelectedValues] = useState<Set<string>>(
        new Set((column?.getFilterValue() as string[]) || []),
    );

    // Sincronizar valores locales cuando cambian los filtros externos
    useEffect(() => {
        setLocalSelectedValues(new Set((column?.getFilterValue() as string[]) || []));
    }, [column?.getFilterValue()]);

    // Aplicar filtros cuando se cierra el popover
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            const filterValues = Array.from(localSelectedValues);
            column?.setFilterValue(filterValues.length ? filterValues : undefined);
        }
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    {title}
                    {localSelectedValues?.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <div className="hidden space-x-1 lg:flex">
                                {localSelectedValues.size > 2 ? (
                                    <Badge variant="outline" className="rounded-sm">
                                        {localSelectedValues.size} seleccionados
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) =>
                                            localSelectedValues.has(option.value),
                                        )
                                        .map((option) => (
                                            <Badge
                                                variant="outline"
                                                className="rounded-sm"
                                                key={option.value}
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <SelectableList
                    options={options}
                    selectedValues={localSelectedValues}
                    onOptionSelect={(value) => {
                        const newSelectedValues = new Set(localSelectedValues);
                        if (localSelectedValues.has(value)) {
                            newSelectedValues.delete(value);
                        } else {
                            newSelectedValues.add(value);
                        }
                        setLocalSelectedValues(newSelectedValues);
                    }}
                    onClearAll={() => setLocalSelectedValues(new Set())}
                    searchPlaceholder={title}
                />
            </PopoverContent>
        </Popover>
    );
}
