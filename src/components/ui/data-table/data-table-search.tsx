import { Search } from 'lucide-react';
import { useEffect, useState, KeyboardEvent } from 'react';
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
    placeholder = "Buscar..." 
}: DataTableSearchProps) {
    const [inputValue, setInputValue] = useState(searchTerm);

    useEffect(() => {
        setInputValue(searchTerm);
    }, [searchTerm]);

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
                    className="h-8 w-[150px] lg:w-[250px] pr-8"
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