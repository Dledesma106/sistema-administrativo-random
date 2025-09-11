import { EmailThread } from './index';

interface Props {
    thread: EmailThread;
    selected: boolean;
    onSelect: (thread: EmailThread) => void;
}

export default function EmailThreadItem({ thread, selected, onSelect }: Props) {
    return (
        <div
            className={
                `mb-2 cursor-pointer rounded-md border p-3 transition-colors` +
                (selected ? ' border-accent-foreground bg-accent' : ' hover:bg-accent/50')
            }
            onClick={() => onSelect(thread)}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">
                        {thread.subject || 'Sin asunto'}
                    </div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">
                        {thread.snippet}
                    </div>
                </div>
                <div className="shrink-0 text-xs text-muted-foreground">
                    {thread.messages.length} mensaje
                    {thread.messages.length !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
}
