import { EmailThread } from './index';

export default function EmailThreadDetail({ thread }: { thread: EmailThread }) {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold">
                    {thread.subject || 'Sin asunto'}
                </h3>
                <div className="text-sm text-muted-foreground">
                    {thread.messages.length} mensaje
                    {thread.messages.length !== 1 ? 's' : ''} • ID del thread: {thread.id}
                </div>
            </div>

            <div className="space-y-4">
                {thread.messages.map((email) => (
                    <div
                        key={email.id}
                        className="rounded-lg border border-accent bg-background p-4"
                    >
                        <div className="mb-3 flex items-start justify-between">
                            <div className="text-sm">
                                <span className="font-medium">
                                    Mensaje ID: {email.id}
                                </span>
                                <span className="ml-2 text-xs text-muted-foreground">
                                    Thread ID: {email.threadId}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Labels: {email.labelIds.join(', ') || 'Sin etiquetas'}
                            </div>
                        </div>
                        <div className="text-sm leading-relaxed">{email.snippet}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
