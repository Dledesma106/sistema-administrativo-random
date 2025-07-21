import React from 'react';
import type { EmailThread } from './index';

interface Props {
    thread: EmailThread;
    selected: boolean;
    onSelect: (thread: EmailThread) => void;
}

export default function EmailThreadItem({ thread, selected, onSelect }: Props) {
    return (
        <div
            className={
                `mb-2 cursor-pointer rounded-md border p-3` +
                (selected ? ' bg-accent' : '')
            }
            onClick={() => onSelect(thread)}
        >
            <div className="flex items-center justify-between">
                <div className="truncate font-semibold">{thread.subject}</div>
                <div className="truncate text-xs text-muted-foreground">
                    {thread.messages.length} mensajes
                </div>
            </div>
        </div>
    );
} 