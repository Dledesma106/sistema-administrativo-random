import { BillingProfile, IVACondition, TipoDocumento } from '@prisma/client';

import { builder } from '../../builder';

export const IVAConditionPothosRef = builder.enumType('IVACondition', {
    values: Object.values(IVACondition),
});

export const TipoDocumentoPothosRef = builder.enumType('TipoDocumento', {
    values: Object.values(TipoDocumento),
});

export const ContactPothosRef = builder
    .objectRef<{
        email: string;
        fullName: string;
        phone: string;
        notes: string;
    }>('Contact')
    .implement({
        fields: (t) => ({
            email: t.string({
                resolve: (contact) => contact.email,
            }),
            fullName: t.string({
                resolve: (contact) => contact.fullName,
            }),
            phone: t.string({
                resolve: (contact) => contact.phone,
            }),
            notes: t.string({
                resolve: (contact) => contact.notes,
            }),
        }),
    });

export const BillingProfilePothosRef = builder.prismaObject('BillingProfile', {
    fields: (t) => ({
        id: t.exposeID('id'),
        numeroDocumento: t.exposeString('numeroDocumento'),
        tipoDocumento: t.field({
            type: TipoDocumentoPothosRef,
            resolve: (root) => root.tipoDocumento as TipoDocumento,
        }),
        legalName: t.exposeString('legalName'),
        IVACondition: t.field({
            type: IVAConditionPothosRef,
            resolve: (root) => root.IVACondition as IVACondition,
        }),
        comercialAddress: t.exposeString('comercialAddress'),
        billingEmails: t.exposeStringList('billingEmails'),
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
        firstContact: t.field({
            type: ContactPothosRef,
            nullable: true,
            resolve: (root) => (root as any).firstContact || root.contacts?.[0] || null,
        }),
        bills: t.relation('Bill'),
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
        phone: t.string({
            required: true,
        }),
        notes: t.string({
            required: true,
        }),
    }),
});

export const BillingProfileInputPothosRef = builder.inputType('BillingProfileInput', {
    fields: (t) => ({
        numeroDocumento: t.string({
            required: true,
        }),
        tipoDocumento: t.field({
            type: TipoDocumentoPothosRef,
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
        billingEmails: t.stringList({
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
            numeroDocumento: t.string({
                required: false,
            }),
            tipoDocumento: t.field({
                type: TipoDocumentoPothosRef,
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
            billingEmails: t.stringList({
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
