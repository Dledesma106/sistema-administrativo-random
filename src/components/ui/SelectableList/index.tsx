import { CheckIcon } from '@radix-ui/react-icons';
import { ReactNode, useMemo } from 'react';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import { CustomScrollArea } from '@/components/ui/custom-scroll-area/index';
import { cn } from '@/lib/utils';

export interface SelectableOption {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface SelectableListProps {
    options: SelectableOption[];
    selectedValues: Set<string>;
    onOptionSelect: (value: string) => void;
    onClearAll?: () => void;
    searchPlaceholder?: string;
    emptyMessage?: string;
    maxHeight?: string;
    className?: string;
    renderOption?: (option: SelectableOption, isSelected: boolean) => ReactNode;
}

export function SelectableList({
    options,
    selectedValues,
    onOptionSelect,
    onClearAll,
    searchPlaceholder = 'Buscar...',
    emptyMessage = 'No se encontraron resultados.',
    maxHeight = 'h-[300px]',
    className,
    renderOption,
}: SelectableListProps) {
    const dynamicHeight = useMemo(() => {
        const ITEM_HEIGHT = 36;
        const PADDING = 32;
        const INPUT_HEIGHT = 40;
        const CLEAR_BUTTON_HEIGHT = selectedValues.size > 0 ? 36 : 0;

        const contentHeight =
            options.length * ITEM_HEIGHT + PADDING + INPUT_HEIGHT + CLEAR_BUTTON_HEIGHT;
        const maxHeightValue = parseInt(maxHeight.match(/\d+/)?.[0] || '300');

        return `h-[${Math.min(contentHeight, maxHeightValue)}px]`;
    }, [options.length, maxHeight, selectedValues.size]);

    const defaultRenderOption = (option: SelectableOption, isSelected: boolean) => (
        <>
            <div
                className={cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity [&_svg]:invisible',
                )}
            >
                <CheckIcon className={cn('h-4 w-4')} />
            </div>
            {option.icon && (
                <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{option.label}</span>
        </>
    );

    return (
        <Command
            className={cn('overflow-hidden bg-background text-foreground', className)}
        >
            <CommandInput placeholder={searchPlaceholder} />
            <CustomScrollArea height={dynamicHeight} className="border-0">
                <div className="py-2">
                    <CommandEmpty className="py-2">{emptyMessage}</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => {
                            const isSelected = selectedValues.has(option.value);
                            return (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => onOptionSelect(option.value)}
                                >
                                    {renderOption
                                        ? renderOption(option, isSelected)
                                        : defaultRenderOption(option, isSelected)}
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                    {selectedValues.size > 0 && onClearAll && (
                        <>
                            <CommandGroup>
                                <CommandItem
                                    onSelect={onClearAll}
                                    className="justify-center text-center"
                                >
                                    Limpiar filtros
                                </CommandItem>
                            </CommandGroup>
                        </>
                    )}
                </div>
            </CustomScrollArea>
        </Command>
    );
}
