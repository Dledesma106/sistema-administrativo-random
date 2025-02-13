import { Search } from 'lucide-react';
import { useEffect, useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';

interface DataTableSearchProps {
    searchTerm: string;
    onSearch: (term: string) => void;
    placeholder?: string;
}

export function DataTableSearch({ 
    searchTerm, 
    onSearch, 
    placeholder = "Buscar..." 
}: DataTableSearchProps) {
    const [inputValue, setInputValue] = useState(searchTerm);

    useEffect(() => {
        setInputValue(searchTerm);
    }, [searchTerm]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch(inputValue);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 w-[150px] lg:w-[250px]"
            />
        </div>
    );
} 