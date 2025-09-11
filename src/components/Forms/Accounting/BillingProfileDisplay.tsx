import { TypographyH3 } from '@/components/ui/typography';

interface BillingProfileDisplayProps {
    billingProfile: {
        legalName?: string | null;
        CUIT?: string | null;
        billingEmail?: string | null;
        comercialAddress?: string | null;
        IVACondition?: string | null;
        contacts?: Array<{
            fullName?: string | null;
            email?: string | null;
            phone?: string | null;
            notes?: string | null;
        }> | null;
    };
    businessName: string;
}

const BillingProfileDisplay = ({
    billingProfile,
    businessName,
}: BillingProfileDisplayProps): JSX.Element => {
    return (
        <div className="space-y-4 rounded-lg border border-accent p-4">
            <div className="flex items-center justify-between">
                <TypographyH3>Datos Fiscales</TypographyH3>
                <span className="text-sm text-muted-foreground">
                    Datos de {businessName}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="text-sm font-medium text-muted-foreground">
                        Razón Social
                    </label>
                    <p className="text-sm">
                        {billingProfile.legalName || 'No especificado'}
                    </p>
                </div>

                <div>
                    <label className="text-sm font-medium text-muted-foreground">
                        CUIT
                    </label>
                    <p className="text-sm">{billingProfile.CUIT || 'No especificado'}</p>
                </div>

                <div>
                    <label className="text-sm font-medium text-muted-foreground">
                        Condición IVA
                    </label>
                    <p className="text-sm">
                        {billingProfile.IVACondition || 'No especificado'}
                    </p>
                </div>

                <div>
                    <label className="text-sm font-medium text-muted-foreground">
                        Email de Facturación
                    </label>
                    <p className="text-sm">
                        {billingProfile.billingEmail || 'No especificado'}
                    </p>
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        Domicilio Comercial
                    </label>
                    <p className="text-sm">
                        {billingProfile.comercialAddress || 'No especificado'}
                    </p>
                </div>
            </div>

            {billingProfile.contacts && billingProfile.contacts.length > 0 && (
                <div>
                    <label className="text-sm font-medium text-muted-foreground">
                        Contactos
                    </label>
                    <div className="mt-2 space-y-2">
                        {billingProfile.contacts.map((contact, index) => (
                            <div key={index} className="rounded bg-muted p-2 text-sm">
                                <p>
                                    <strong>{contact.fullName}</strong>
                                </p>
                                <p className="text-muted-foreground">{contact.email}</p>
                                {contact.phone && (
                                    <p className="text-muted-foreground">
                                        Tel: {contact.phone}
                                    </p>
                                )}
                                {contact.notes && (
                                    <p className="text-muted-foreground">
                                        Notas: {contact.notes}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingProfileDisplay;
