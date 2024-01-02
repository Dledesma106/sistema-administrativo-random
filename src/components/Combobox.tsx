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
                            const item = items.find(
                                (item) => item.value.toLowerCase() === value,
                            );

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
                                    className={
                                        item.description
                                            ? 'flex flex-col items-start space-y-1 px-4 py-2'
                                            : ''
                                    }
                                    key={item.value}
                                    value={item.value}
                                    onSelect={(_lowercasedValue) => {
                                        const nextValue =
                                            item.value === value ? '' : item.value;

                                        if (onChange) {
                                            onChange(nextValue);
                                        }

                                        setOpen(false);
                                    }}
                                >
                                    {item.description ? (
                                        <>
                                            <p className="flex w-full justify-between space-x-1">
                                                <span>{item.label}</span>
                                                {item.value === value ? (
                                                    <Check className="h-4 w-4" />
                                                ) : null}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="flex w-full justify-between space-x-1">
                                            <span>{item.label}</span>
                                            {item.value === value ? (
                                                <Check className="h-4 w-4" />
                                            ) : null}
                                        </p>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default Combobox;
