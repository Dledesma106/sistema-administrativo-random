import { BillingProfile, IVACondition } from '@prisma/client';

import { builder } from '../../builder';

export const IVAConditionPothosRef = builder.enumType('IVACondition', {
    values: Object.values(IVACondition),
});

export const ContactPothosRef = builder
    .objectRef<{
        email: string;
        fullName: string;
    }>('Contact')
    .implement({
        fields: (t) => ({
            email: t.string({
                resolve: (contact) => contact.email,
            }),
            fullName: t.string({
                resolve: (contact) => contact.fullName,
            }),
        }),
    });

export const BillingProfilePothosRef = builder.prismaObject('BillingProfile', {
    fields: (t) => ({
        id: t.exposeID('id'),
        CUIT: t.exposeString('CUIT'),
        legalName: t.exposeString('legalName'),
        IVACondition: t.field({
            type: IVAConditionPothosRef,
            resolve: (root) => root.IVACondition as IVACondition,
        }),
        comercialAddress: t.exposeString('comercialAddress'),
        billingEmail: t.exposeString('billingEmail'),
        createdAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.createdAt,
        }),
        updatedAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.updatedAt,
        }),
        deleted: t.boolean({
            resolve: (root) => root.deleted,
        }),
        deletedAt: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.deletedAt,
        }),
        business: t.relation('business'),
        contacts: t.field({
            type: [ContactPothosRef],
            resolve: (root) => root.contacts || [],
        }),
    }),
});

export const ContactInputPothosRef = builder.inputType('ContactInput', {
    fields: (t) => ({
        email: t.string({
            required: true,
        }),
        fullName: t.string({
            required: true,
        }),
    }),
});

export const BillingProfileInputPothosRef = builder.inputType('BillingProfileInput', {
    fields: (t) => ({
        CUIT: t.string({
            required: true,
        }),
        legalName: t.string({
            required: true,
        }),
        IVACondition: t.field({
            type: IVAConditionPothosRef,
            required: true,
        }),
        comercialAddress: t.string({
            required: true,
        }),
        billingEmail: t.string({
            required: true,
        }),
        businessId: t.string({
            required: false,
        }),
        businessName: t.string({
            required: false,
        }),
        contacts: t.field({
            type: [ContactInputPothosRef],
            required: false,
        }),
    }),
});

export const UpdateBillingProfileInputPothosRef = builder.inputType(
    'UpdateBillingProfileInput',
    {
        fields: (t) => ({
            CUIT: t.string({
                required: false,
            }),
            legalName: t.string({
                required: false,
            }),
            IVACondition: t.field({
                type: IVAConditionPothosRef,
                required: false,
            }),
            comercialAddress: t.string({
                required: false,
            }),
            billingEmail: t.string({
                required: false,
            }),
            contacts: t.field({
                type: [ContactInputPothosRef],
                required: false,
            }),
        }),
    },
);

export const BillingProfileCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        billingProfile?: BillingProfile;
    }>('BillingProfileCrudResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            billingProfile: t.field({
                type: BillingProfilePothosRef,
                nullable: true,
                resolve: (result) => result.billingProfile,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
        }),
    });
