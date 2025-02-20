export type BillingDetail = {
    description: string;
    quantity: number;
    unitPrice: number;
    ivaRate: number;
    subtotal: number;
    subtotalWithIva: number;
};

export type FormValues = {
    billingProfileId: string;
    legalName: string;
    cuit: string;
    businessAddress: string;
    ivaCondition: string;
    invoiceType: 'A' | 'B' | 'C';
    paymentCondition: string;
    dateFrom: Date;
    dateTo?: Date;
    isSingleService: boolean;
    dueDate: Date;
    details: BillingDetail[];
};
