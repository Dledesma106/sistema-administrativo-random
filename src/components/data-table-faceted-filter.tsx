import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';
import * as React from 'react';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/Badges/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {localSelectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {localSelectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {localSelectedValues.size} seleccionados
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) =>
                                            localSelectedValues.has(option.value),
                                        )
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="rounded-sm px-1 font-normal"
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
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = localSelectedValues.has(option.value);
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            const newSelectedValues = new Set(
                                                localSelectedValues,
                                            );
                                            if (isSelected) {
                                                newSelectedValues.delete(option.value);
                                            } else {
                                                newSelectedValues.add(option.value);
                                            }
                                            setLocalSelectedValues(newSelectedValues);
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50 [&_svg]:invisible',
                                            )}
                                        >
                                            <CheckIcon className={cn('h-4 w-4')} />
                                        </div>
                                        {option.icon && (
                                            <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span>{option.label}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {localSelectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => {
                                            setLocalSelectedValues(new Set());
                                        }}
                                        className="justify-center text-center"
                                    >
                                        Limpiar filtros
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
