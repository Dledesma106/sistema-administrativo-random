import React from 'react';

import EmailThreadItem from './EmailThreadItem';
import type { EmailThread } from './index';

interface Props {
    threads: EmailThread[];
    onSelect: (thread: EmailThread) => void;
    selectedId?: string | null;
}

export default function EmailThreadList({ threads, onSelect, selectedId }: Props) {
    const [search, setSearch] = React.useState('');
    const filteredThreads = threads.filter(
        (t) =>
            t.subject.toLowerCase().includes(search.toLowerCase()) ||
            t.messages.some((m) =>
                m.content.toLowerCase().includes(search.toLowerCase()),
            ),
    );

    return (
        <div>
            <input
                className="mb-2 w-full rounded border px-2 py-1 text-xs"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto">
                {filteredThreads.length === 0 ? (
                    <div className="text-xs text-muted-foreground">Sin resultados</div>
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
