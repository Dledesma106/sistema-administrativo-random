import { builder } from '../../builder';

// Tipo para un mensaje de Gmail
export const GmailMessagePothosRef = builder.objectRef<{
    id: string;
    threadId: string;
    labelIds: string[];
    snippet: string;
    historyId: string;
    internalDate: string;
    payload: any;
    sizeEstimate: number;
}>('GmailMessage');

GmailMessagePothosRef.implement({
    fields: (t) => ({
        id: t.string({
            resolve: (message) => message.id,
        }),
        threadId: t.string({
            resolve: (message) => message.threadId,
        }),
        labelIds: t.stringList({
            resolve: (message) => message.labelIds,
        }),
        snippet: t.string({
            resolve: (message) => message.snippet,
        }),
        historyId: t.string({
            resolve: (message) => message.historyId,
        }),
        internalDate: t.string({
            resolve: (message) => message.internalDate,
        }),
        payload: t.field({
            type: 'JSON',
            resolve: (message) => message.payload,
        }),
        sizeEstimate: t.int({
            resolve: (message) => message.sizeEstimate,
        }),
    }),
});

// Tipo para un thread de Gmail
export const GmailThreadPothosRef = builder.objectRef<{
    id: string;
    historyId: string;
    messages: any[];
    snippet: string;
}>('GmailThread');

GmailThreadPothosRef.implement({
    fields: (t) => ({
        id: t.string({
            resolve: (thread) => thread.id,
        }),
        historyId: t.string({
            resolve: (thread) => thread.historyId,
        }),
        messages: t.field({
            type: [GmailMessagePothosRef],
            resolve: (thread) => thread.messages,
        }),
        snippet: t.string({
            resolve: (thread) => thread.snippet,
        }),
        subject: t.string({
            nullable: true,
            resolve: (thread) => {
                // Obtener el subject del primer mensaje del thread
                if (thread.messages && thread.messages.length > 0) {
                    const firstMessage = thread.messages[0];
                    if (firstMessage.payload && firstMessage.payload.headers) {
                        const subjectHeader = firstMessage.payload.headers.find(
                            (header: any) => header.name === 'Subject',
                        );
                        return subjectHeader ? subjectHeader.value : null;
                    }
                }
                return null;
            },
        }),
    }),
});

// Input para buscar threads
export const SearchGmailThreadsInputPothosRef = builder.inputType(
    'SearchGmailThreadsInput',
    {
        fields: (t) => ({
            query: t.string({
                required: true,
                description:
                    'Query de búsqueda de Gmail (ej: "from:example@gmail.com subject:presupuesto")',
            }),
            maxResults: t.int({
                required: false,
                description: 'Número máximo de resultados (default: 20)',
            }),
        }),
    },
);

// Resultado de operaciones de Gmail
export const GmailResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        data?: any;
    }>('GmailResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
            data: t.field({
                type: 'JSON',
                nullable: true,
                resolve: (result) => result.data,
            }),
        }),
    });

// Resultado para threads de Gmail
export const GmailThreadsResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        threads?: any[];
    }>('GmailThreadsResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
            threads: t.field({
                type: [GmailThreadPothosRef],
                nullable: true,
                resolve: (result) => result.threads,
            }),
        }),
    });

// Resultado para un thread específico
export const GmailThreadResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        thread?: any;
    }>('GmailThreadResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
            thread: t.field({
                type: GmailThreadPothosRef,
                nullable: true,
                resolve: (result) => result.thread,
            }),
        }),
    });
