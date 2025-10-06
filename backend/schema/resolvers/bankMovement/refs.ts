import { builder } from '../../builder';

export const BankMovementPothosRef = builder.prismaObject('BankMovement', {
    fields: (t) => ({
        id: t.exposeID('id'),
        createdAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.createdAt,
        }),
        updatedAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.updatedAt,
        }),
        deleted: t.exposeBoolean('deleted'),
        deletedAt: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.deletedAt,
        }),
        amount: t.exposeFloat('amount'),
        date: t.field({
            type: 'DateTime',
            resolve: (root) => root.date,
        }),
        sourceAccount: t.relation('sourceAccount'),
        destinationAccount: t.relation('destinationAccount', { nullable: true }),
    }),
});

export const BankMovementCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        bankMovement?: any;
    }>('BankMovementCrudResult')
    .implement({
        fields: (t) => ({
            success: t.exposeBoolean('success'),
            message: t.exposeString('message', { nullable: true }),
            bankMovement: t.field({
                type: BankMovementPothosRef,
                nullable: true,
                resolve: (parent) => parent.bankMovement || null,
            }),
        }),
    }); 