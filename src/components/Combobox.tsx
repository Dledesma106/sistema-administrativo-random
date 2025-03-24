import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SelectableList, SelectableOption } from '@/components/ui/SelectableList';

type Props = {
    value: string;
    onChange: undefined | ((value: string) => void);
    items: {
        label: string;
        value: string;
        description?: string;
    }[];
    selectPlaceholder: string;
    searchPlaceholder: string;
};

const Combobox = (props: Props) => {
    const { value, onChange, items, searchPlaceholder, selectPlaceholder } = props;
    const [open, setOpen] = useState(false);
    const label = value ? items.find((item) => item.value === value)?.label : null;

    const handleOptionSelect = (selectedValue: string) => {
        const nextValue = selectedValue === value ? '' : selectedValue;
        if (onChange) {
            onChange(nextValue);
        }
        setOpen(false);
    };

    // Renderizado personalizado para opciones con descripción
    const renderOption = (option: SelectableOption, isSelected: boolean) => {
        const item = items.find((i) => i.value === option.value);
        if (!item?.description) {
            return (
                <p className="flex w-full justify-between space-x-1">
                    <span>{option.label}</span>
                    {isSelected && <Check className="size-4" />}
                </p>
            );
        }

        return (
            <div className="flex flex-col items-start space-y-1">
                <p className="flex w-full justify-between space-x-1">
                    <span>{option.label}</span>
                    {isSelected && <Check className="size-4" />}
                </p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
        );
    };

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="min-w-[200px] justify-between"
                    >
                        {label || selectPlaceholder}
                        <ChevronsUpDown className="ml-2 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[200px] p-0">
                    <SelectableList
                        options={items}
                        selectedValues={new Set(value ? [value] : [])}
                        onOptionSelect={handleOptionSelect}
                        searchPlaceholder={searchPlaceholder}
                        emptyMessage="No hay resultados"
                        maxHeight="h-[400px]"
                        renderOption={renderOption}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default Combobox;
