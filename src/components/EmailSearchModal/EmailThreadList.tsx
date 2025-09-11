import React from 'react';

import EmailThreadItem from './EmailThreadItem';
import { EmailThread } from './index';

interface Props {
    threads: EmailThread[];
    onSelect: (thread: EmailThread) => void;
    selectedId?: string | null;
    isLoading?: boolean;
}

export default function EmailThreadList({
    threads,
    onSelect,
    selectedId,
    isLoading,
}: Props) {
    const [search, setSearch] = React.useState('');

    const filteredThreads = threads.filter(
        (t) =>
            t.subject?.toLowerCase().includes(search.toLowerCase()) ||
            false ||
            t.snippet.toLowerCase().includes(search.toLowerCase()),
    );

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-sm text-muted-foreground">Buscando...</div>
            </div>
        );
    }

    return (
        <div>
            <input
                className="mb-2 w-full rounded border px-2 py-1 text-xs"
                placeholder="Filtrar resultados..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto">
                {filteredThreads.length === 0 ? (
                    <div className="text-xs text-muted-foreground">
                        {threads.length === 0
                            ? 'Sin resultados'
                            : 'Sin coincidencias en el filtro'}
                    </div>
                ) : (
                    filteredThreads.map((thread) => (
                        <EmailThreadItem
                            key={thread.id}
                            thread={thread}
                            selected={selectedId === thread.id}
                            onSelect={onSelect}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
