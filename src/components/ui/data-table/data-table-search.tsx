import { Search } from 'lucide-react';
import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataTableSearchProps {
    searchTerm: string;
    onSearch: (term: string) => void;
    placeholder?: string;
}

export function DataTableSearch({
    searchTerm,
    onSearch,
    placeholder = 'Buscar...',
}: DataTableSearchProps) {
    const [inputValue, setInputValue] = useState(searchTerm);
    const debouncedValue = useDebounce(inputValue, 400);
    const lastEmittedRef = useRef(searchTerm);

    useEffect(() => {
        setInputValue(searchTerm);
        lastEmittedRef.current = searchTerm;
    }, [searchTerm]);

    // Trigger search automatically after user stops typing
    useEffect(() => {
        if (debouncedValue !== lastEmittedRef.current) {
            lastEmittedRef.current = debouncedValue;
            onSearch(debouncedValue);
        }
    }, [debouncedValue, onSearch]);

    const handleSearch = () => {
        onSearch(inputValue);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex items-center space-x-2 self-end">
            <div className="relative flex items-center">
                <Input
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-8 w-[150px] pr-8 lg:w-[250px]"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 h-8 w-8 hover:bg-transparent"
                    onClick={handleSearch}
                >
                    <Search className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>
        </div>
    );
}
