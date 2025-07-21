import type { EmailThread } from './index';

export default function EmailThreadDetail({ thread }: { thread: EmailThread }) {
    return (
        <div className="flex-1 overflow-y-auto pl-4">
            <div className="font-bold mb-2">{thread.subject}</div>
            <div className="space-y-4">
                {thread.messages.map((email) => (
                    <div
                        key={email.id}
                        className={`rounded-lg border border-accent p-3 ${email.type === 'SENT' ? 'bg-muted' : ''}`}
                    >
                        <div className="mb-1 flex items-start justify-between">
                            <div>
                                <span className="font-semibold">{email.from}</span>
                                <span className="ml-2 text-xs text-muted-foreground">
                                    Para: {email.to.join(', ')}
                                </span>
                                {email.cc && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        CC: {email.cc.join(', ')}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {new Date(email.timestamp).toLocaleString('es-AR')}
                            </span>
                        </div>
                        <div className="whitespace-pre-wrap text-xs">{email.content}</div>
                    </div>
                ))}
            </div>
        </div>
    );
} 