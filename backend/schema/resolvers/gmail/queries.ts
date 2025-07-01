import {
    GmailResultPothosRef,
    GmailThreadResultPothosRef,
    GmailThreadsResultPothosRef,
    SearchGmailThreadsInputPothosRef,
} from './refs';

import { GmailService } from '../../../services/gmailService';
import { builder } from '../../builder';

builder.queryFields((t) => ({
    // Verificar si Gmail está configurado
    isGmailConfigured: t.field({
        type: GmailResultPothosRef,
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (_root, _args, _context, _info) => {
            try {
                const isConfigured = await GmailService.isGmailConfigured();

                return {
                    success: true,
                    data: { isConfigured },
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al verificar configuración de Gmail: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),

    // Buscar threads de Gmail
    searchGmailThreads: t.field({
        type: GmailThreadsResultPothosRef,
        args: {
            input: t.arg({
                type: SearchGmailThreadsInputPothosRef,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (_root, args, _context, _info) => {
            try {
                const { input } = args;

                // Verificar que Gmail esté configurado
                const isConfigured = await GmailService.isGmailConfigured();
                if (!isConfigured) {
                    return {
                        success: false,
                        message: 'Gmail no está configurado. Contacte al administrador.',
                    };
                }

                const threads = await GmailService.searchThreads(
                    input.query,
                    input.maxResults || 20,
                );

                return {
                    success: true,
                    threads,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al buscar threads de Gmail: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),

    // Buscar threads de presupuestos
    searchBudgetThreads: t.field({
        type: GmailThreadsResultPothosRef,
        args: {
            query: t.arg.string({
                required: false,
                description: 'Query adicional para filtrar threads de presupuestos',
            }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (_root, args, _context, _info) => {
            try {
                const { query } = args;

                // Verificar que Gmail esté configurado
                const isConfigured = await GmailService.isGmailConfigured();
                if (!isConfigured) {
                    return {
                        success: false,
                        message: 'Gmail no está configurado. Contacte al administrador.',
                    };
                }

                const threads = await GmailService.searchBudgetThreads(
                    query || undefined,
                );

                return {
                    success: true,
                    threads,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al buscar threads de presupuestos: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),

    // Buscar threads por cliente
    searchThreadsByClient: t.field({
        type: GmailThreadsResultPothosRef,
        args: {
            clientEmail: t.arg.string({
                required: true,
                description: 'Email del cliente para buscar threads',
            }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (_root, args, _context, _info) => {
            try {
                const { clientEmail } = args;

                // Verificar que Gmail esté configurado
                const isConfigured = await GmailService.isGmailConfigured();
                if (!isConfigured) {
                    return {
                        success: false,
                        message: 'Gmail no está configurado. Contacte al administrador.',
                    };
                }

                const threads = await GmailService.searchThreadsByClient(clientEmail);

                return {
                    success: true,
                    threads,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al buscar threads del cliente: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),

    // Obtener threads recientes
    getRecentGmailThreads: t.field({
        type: GmailThreadsResultPothosRef,
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (_root, _args, _context, _info) => {
            try {
                // Verificar que Gmail esté configurado
                const isConfigured = await GmailService.isGmailConfigured();
                if (!isConfigured) {
                    return {
                        success: false,
                        message: 'Gmail no está configurado. Contacte al administrador.',
                    };
                }

                const threads = await GmailService.getRecentThreads();

                return {
                    success: true,
                    threads,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al obtener threads recientes: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),

    // Obtener un thread específico de Gmail
    getGmailThread: t.field({
        type: GmailThreadResultPothosRef,
        args: {
            threadId: t.arg.string({
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (_root, args, _context, _info) => {
            try {
                const { threadId } = args;

                // Verificar que Gmail esté configurado
                const isConfigured = await GmailService.isGmailConfigured();
                if (!isConfigured) {
                    return {
                        success: false,
                        message: 'Gmail no está configurado. Contacte al administrador.',
                    };
                }

                const thread = await GmailService.getThread(threadId);

                return {
                    success: true,
                    thread,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al obtener thread de Gmail: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),

    // Obtener información básica de un thread
    getGmailThreadInfo: t.field({
        type: GmailThreadResultPothosRef,
        args: {
            threadId: t.arg.string({
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (_root, args, _context, _info) => {
            try {
                const { threadId } = args;

                // Verificar que Gmail esté configurado
                const isConfigured = await GmailService.isGmailConfigured();
                if (!isConfigured) {
                    return {
                        success: false,
                        message: 'Gmail no está configurado. Contacte al administrador.',
                    };
                }

                const thread = await GmailService.getThreadInfo(threadId);

                return {
                    success: true,
                    thread,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al obtener información del thread: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),

    // Verificar si un thread de Gmail existe
    gmailThreadExists: t.field({
        type: 'Boolean',
        args: {
            threadId: t.arg.string({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _context, _info) => {
            try {
                // Verificar que Gmail esté configurado
                const isConfigured = await GmailService.isGmailConfigured();
                if (!isConfigured) {
                    throw new Error(
                        'Gmail no está configurado. Contacte al administrador.',
                    );
                }
                return await GmailService.threadExists(args.threadId);
            } catch (error) {
                return false;
            }
        },
    }),
}));
