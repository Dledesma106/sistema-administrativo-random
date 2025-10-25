import { useRouter } from 'next/router';

import { billColumns } from './columns';

import { Button } from '@/components/ui/button';
import { DataList } from '@/components/ui/data-list';
import { TypographyH1 } from '@/components/ui/typography';
import { useGetBillingProfileById } from '@/hooks/api/billingProfile';
import { routesBuilder } from '@/lib/routes';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold">{children}</h2>
);

export const BillingProfileDetail = ({ id }: { id: string }) => {
    const router = useRouter();
    const { data: billingProfileData, isLoading } = useGetBillingProfileById(id);

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    const billingProfile = billingProfileData?.billingProfileById;

    if (!billingProfile) {
        return <div>Perfil de facturación no encontrado</div>;
    }

    return (
        <div className="rounded-lg border border-accent bg-background-primary p-4">
            <div className="flex justify-between">
                <TypographyH1 className="mb-2">
                    Perfil de Facturación - {billingProfile.business?.name}
                </TypographyH1>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.push(routesBuilder.accounting.billingProfiles.list())
                        }
                    >
                        Volver
                    </Button>
                    <Button
                        onClick={() =>
                            router.push(routesBuilder.accounting.billingProfiles.edit(id))
                        }
                    >
                        Editar
                    </Button>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <div>
                    <Title>{billingProfile.tipoDocumento || 'Documento'}</Title>
                    <p className="mb-1">{billingProfile.numeroDocumento}</p>
                </div>

                <div>
                    <Title>Razón Social</Title>
                    <p className="mb-1">{billingProfile.legalName}</p>
                </div>

                <div>
                    <Title>Condición frente al IVA</Title>
                    <p className="mb-1">
                        {capitalizeFirstLetter(
                            pascalCaseToSpaces(billingProfile.IVACondition),
                        )}
                    </p>
                </div>

                <div>
                    <Title>Domicilio Comercial</Title>
                    <p className="mb-1">{billingProfile.comercialAddress}</p>
                </div>

                <div>
                    <Title>Emails de Facturación</Title>
                    <div className="space-y-1">
                        {billingProfile.billingEmails &&
                        billingProfile.billingEmails.length > 0 ? (
                            billingProfile.billingEmails.map((email, index) => (
                                <div key={index}>
                                    <a
                                        href={`mailto:${email}`}
                                        className="text-blue-600 underline hover:text-blue-800"
                                    >
                                        {email}
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground">No especificado</p>
                        )}
                    </div>
                </div>

                <div>
                    <Title>Contactos</Title>
                    <div className="space-y-4">
                        {billingProfile.contacts?.map((contact, index) => (
                            <div
                                key={index}
                                className="rounded-md border border-accent bg-background-primary p-4"
                            >
                                <p className="font-semibold">{contact.fullName}</p>
                                <p className="text-sm text-muted-foreground">
                                    {contact.email}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {contact.phone}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {contact.notes}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <Title>Facturas emitidas</Title>
                    <DataList
                        data={billingProfile.bills || []}
                        columns={billColumns}
                        onRowClick={(bill) =>
                            router.push(routesBuilder.accounting.billing.details(bill.id))
                        }
                        emptyMessage="No hay facturas emitidas"
                    />
                </div>
            </div>
        </div>
    );
};
