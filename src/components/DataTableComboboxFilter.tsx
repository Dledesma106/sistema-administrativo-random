import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Props = {
    value: string;
    onChange: undefined | ((value: string) => void);
    items: {
        label: string;
        value: string;
    }[];
    selectPlaceholder: string;
    searchPlaceholder: string;
};

const DataTableComboboxFilter = (props: Props) => {
    const { value, onChange, items, searchPlaceholder, selectPlaceholder } = props;
    const [open, setOpen] = useState(false);
    const label = value ? items.find((item) => item.value === value)?.label : null;

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
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[200px] p-0">
                    <Command
                        filter={(value, search) => {
                            const item = items.find((item) => item.value === value);

                            if (item === undefined) {
                                return 0;
                            }
                            const matches = item.label
                                .toLowerCase()
                                .includes(search?.toLowerCase());

                            if (matches) {
                                return 1;
                            }

                            return 0;
                        }}
                    >
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandEmpty>No hay resultados</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={(currentValue) => {
                                        const nextValue =
                                            currentValue === value ? '' : currentValue;

                                        if (onChange) {
                                            onChange(nextValue);
                                        }

                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === item.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />

                                    <span>{item.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default DataTableComboboxFilter;
