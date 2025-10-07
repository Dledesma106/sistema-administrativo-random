import { useState } from 'react';

import EmailThreadDetail from './EmailThreadDetail';
import EmailThreadList from './EmailThreadList';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSearchGmailThreads } from '@/hooks/api/budget';

// Tipos adaptados a la respuesta real de GraphQL
export type EmailMessage = {
    id: string;
    threadId: string;
    labelIds: string[];
    snippet: string;
};

export type EmailThread = {
    id: string;
    subject: string | null;
    snippet: string;
    historyId: string;
    messages: EmailMessage[];
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (thread: EmailThread) => void;
    selectedThread?: EmailThread | null;
};

export default function EmailSearchModal({
    open,
    onClose,
    onSelect,
    selectedThread,
}: Props) {
    const [selected, setSelected] = useState<EmailThread | null>(selectedThread || null);
    const [searchQuery, setSearchQuery] = useState('');

    // Hook real de Gmail
    const {
        data: gmailData,
        isLoading,
        error,
    } = useSearchGmailThreads({
        query:
            searchQuery ||
            'subject:(presupuesto OR cotización OR presupuestar) OR subject:(budget OR quote)',
    });

    const threads = gmailData?.searchBudgetThreads?.threads || [];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // La búsqueda se ejecuta automáticamente cuando cambia searchQuery
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="flex h-[80vh] min-w-[900px] max-w-4xl flex-col">
                <DialogHeader className="px-8 pb-2 pt-8">
                    <DialogTitle>Buscar cadenas de mails</DialogTitle>
                </DialogHeader>

                {/* Barra de búsqueda */}
                <div className="px-8 pb-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1">
                            <Label htmlFor="search" className="sr-only">
                                Buscar en Gmail
                            </Label>
                            <Input
                                id="search"
                                placeholder="Buscar en Gmail (ej: from:cliente@email.com subject:presupuesto)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Buscando...' : 'Buscar'}
                        </Button>
                    </form>
                </div>

                <div className="flex flex-1 gap-6 overflow-hidden px-8 pb-2">
                    <div className="flex h-full w-96 flex-col border-r border-accent pr-4">
                        {error ? (
                            <div className="text-sm text-destructive">
                                Error: {error.message}
                            </div>
                        ) : (
                            <EmailThreadList
                                threads={threads}
                                onSelect={setSelected}
                                selectedId={selected?.id}
                                isLoading={isLoading}
                            />
                        )}
                    </div>
                    <div className="h-full flex-1 overflow-y-auto pl-4">
                        {selected ? (
                            <EmailThreadDetail thread={selected} />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                Selecciona una cadena para ver el detalle
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-accent px-8 pb-8 pt-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            if (selected) {
                                onSelect(selected);
                            }
                            onClose();
                        }}
                        disabled={!selected}
                    >
                        Seleccionar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
