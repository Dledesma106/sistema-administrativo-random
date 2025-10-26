import { useRouter } from 'next/navigation';

import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { ContactForm, ContactFormValues } from './ContactForm';
import { ContactItem } from './ContactItem';

import {
    GetBusinessesWithoutBillingProfileQuery,
    IvaCondition,
    TipoDocumento,
} from '@/api/graphql';
import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import Combobox from '@/components/Combobox';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TypographyH2 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import {
    useCreateBillingProfile,
    useUpdateBillingProfile,
} from '@/hooks/api/billingProfile';
import {
    capitalizeFirstLetter,
    pascalCaseToSpaces,
    getCleanErrorMessage,
} from '@/lib/utils';

export type FormValues = {
    business: string;
    businessName?: string;
    legalName: string;
    numeroDocumento: string;
    tipoDocumento: TipoDocumento;
    contacts: ContactFormValues[];
    billingEmails: string[];
    billingAddress: string;
    taxCondition: IvaCondition;
};

interface Props {
    defaultValues?: FormValues;
    profileIdToUpdate?: string;
    isEmbedded?: boolean;
    onSubmit?: (data: FormValues) => void;
    businessesWithoutProfile?: NonNullable<
        GetBusinessesWithoutBillingProfileQuery['businesses']
    >;
    businessId?: string;
    selectedBusiness?: string;
}

const CreateOrUpdateBillingProfileForm = ({
    defaultValues,
    profileIdToUpdate,
    isEmbedded = false,
    onSubmit,
    businessesWithoutProfile,
    businessId,
    selectedBusiness,
}: Props): JSX.Element => {
    const router = useRouter();
    const { triggerAlert } = useAlert();
    const createBillingProfile = useCreateBillingProfile();
    const updateBillingProfile = useUpdateBillingProfile();

    const [contacts, setContacts] = useState<ContactFormValues[]>(
        defaultValues?.contacts || [],
    );
    const [billingEmails, setBillingEmails] = useState<string[]>(
        defaultValues?.billingEmails || [],
    );
    const [emailInput, setEmailInput] = useState('');
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<ContactFormValues | null>(null);

    const form = useForm<FormValues>({
        defaultValues: defaultValues || {
            numeroDocumento: '',
            legalName: '',
            tipoDocumento: undefined,
            billingEmails: [],
            billingAddress: '',
            taxCondition: '' as FormValues['taxCondition'],
            contacts: [],
        },
    });

    useEffect(() => {
        if (isEmbedded && onSubmit) {
            const subscription = form.watch((value) => {
                const formData = value as FormValues;
                onSubmit({
                    ...formData,
                    contacts,
                    billingEmails,
                });
            });
            return () => subscription.unsubscribe();
        }
    }, [form, isEmbedded, onSubmit, contacts, billingEmails]);

    // Sincronizar estados cuando cambien los contactos o emails
    useEffect(() => {
        if (isEmbedded && onSubmit) {
            const formData = form.getValues();
            onSubmit({
                ...formData,
                contacts,
                billingEmails,
            });
        }
    }, [contacts, billingEmails, isEmbedded, onSubmit, form]);

    // Actualizar formulario cuando se obtenga el perfil de facturación existente
    useEffect(() => {
        if (businessId && !profileIdToUpdate) {
            form.setValue('legalName', defaultValues?.legalName || '');
            form.setValue('numeroDocumento', defaultValues?.numeroDocumento || '');
            form.setValue(
                'tipoDocumento',
                defaultValues?.tipoDocumento || TipoDocumento.Cuit,
            );
            form.setValue('billingAddress', defaultValues?.billingAddress || '');
            form.setValue(
                'taxCondition',
                (defaultValues?.taxCondition as FormValues['taxCondition']) || '',
            );

            // Actualizar contactos si existen
            if (defaultValues?.contacts && defaultValues.contacts.length > 0) {
                const formattedContacts = defaultValues.contacts.map((contact) => ({
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone,
                    notes: contact.notes,
                }));
                setContacts(formattedContacts);
            }

            // Actualizar emails de facturación si existen
            if (defaultValues?.billingEmails && defaultValues.billingEmails.length > 0) {
                setBillingEmails(defaultValues.billingEmails);
            }
        }
    }, [defaultValues, businessId, profileIdToUpdate, form]);

    const handleSubmit = async (formData: FormValues): Promise<void> => {
        if (isEmbedded) {
            if (onSubmit) {
                onSubmit(formData);
            }
            return;
        }

        try {
            if (profileIdToUpdate) {
                // Actualizar perfil existente
                if (!formData.business) {
                    throw new Error('Debe seleccionar una empresa');
                }

                console.log('Submitting with billingEmails:', billingEmails);
                console.log('Submitting with contacts:', contacts);
                const input = {
                    numeroDocumento: formData.numeroDocumento,
                    tipoDocumento: formData.tipoDocumento!,
                    legalName: formData.legalName,
                    IVACondition: formData.taxCondition,
                    comercialAddress: formData.billingAddress,
                    billingEmails: billingEmails,
                    contacts: contacts.map((contact) => ({
                        email: contact.email,
                        fullName: contact.name,
                        phone: contact.phone,
                        notes: contact.notes,
                    })),
                };

                await updateBillingProfile.mutateAsync({
                    id: profileIdToUpdate,
                    input,
                });
                triggerAlert({
                    type: 'Success',
                    message: 'El perfil de facturación fue actualizado correctamente',
                });
            } else {
                // Crear nuevo perfil
                if (!formData.business) {
                    throw new Error('Debe seleccionar una empresa');
                }

                console.log('Creating with billingEmails:', billingEmails);
                console.log('Creating with contacts:', contacts);
                const input = {
                    numeroDocumento: formData.numeroDocumento,
                    tipoDocumento: formData.tipoDocumento,
                    legalName: formData.legalName,
                    IVACondition: formData.taxCondition,
                    comercialAddress: formData.billingAddress,
                    billingEmails: billingEmails,
                    businessId: formData.business === 'other' ? null : formData.business,
                    businessName: formData.businessName ?? null,
                    contacts: contacts.map((contact) => ({
                        email: contact.email,
                        fullName: contact.name,
                        phone: contact.phone,
                        notes: contact.notes,
                    })),
                };

                await createBillingProfile.mutateAsync({ input });
                triggerAlert({
                    type: 'Success',
                    message: 'El perfil de facturación fue creado correctamente',
                });
            }
            router.back();
        } catch (error: any) {
            triggerAlert({
                type: 'Failure',
                message: getCleanErrorMessage(error),
            });
        }
    };

    const handleAddContact = (contact: ContactFormValues) => {
        setContacts((prev) => [...prev, contact]);
        setIsContactDialogOpen(false);
    };

    const handleEditContact = (contact: ContactFormValues) => {
        setEditingContact(contact);
        setIsContactDialogOpen(true);
    };

    const handleUpdateContact = (updatedContact: ContactFormValues) => {
        setContacts((prev) =>
            prev.map((contact) =>
                contact === editingContact ? updatedContact : contact,
            ),
        );
        setEditingContact(null);
        setIsContactDialogOpen(false);
    };

    const handleDeleteContact = (contactToDelete: ContactFormValues) => {
        setContacts((prev) => prev.filter((contact) => contact !== contactToDelete));
    };

    const handleAddEmail = () => {
        if (emailInput.trim() && !billingEmails.includes(emailInput.trim())) {
            console.log('Adding email:', emailInput.trim());
            console.log('Current emails before:', billingEmails);
            setBillingEmails((prev) => {
                const newEmails = [...prev, emailInput.trim()];
                console.log('New emails after:', newEmails);
                return newEmails;
            });
            setEmailInput('');
        }
    };

    const handleRemoveEmail = (emailToRemove: string) => {
        setBillingEmails((prev) => prev.filter((email) => email !== emailToRemove));
    };

    const formContent = (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                {!isEmbedded && !profileIdToUpdate && (
                    <FormField
                        name="business"
                        control={form.control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Empresa</FormLabel>
                                <FormControl>
                                    <Combobox
                                        selectPlaceholder="Seleccione una empresa"
                                        searchPlaceholder="Buscar empresa"
                                        value={field.value ?? ''}
                                        onChange={field.onChange}
                                        items={[
                                            {
                                                label: 'Otro',
                                                value: 'other',
                                            },
                                            ...(businessesWithoutProfile || []).map(
                                                (business) => ({
                                                    label: business.name,
                                                    value: business.id,
                                                }),
                                            ),
                                        ]}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {(profileIdToUpdate || defaultValues?.businessName) && (
                    <FormItem>
                        <FormLabel>Empresa</FormLabel>
                        <p className="text-sm">
                            {defaultValues?.businessName || 'Empresa asociada'}
                        </p>
                    </FormItem>
                )}

                {/* Campo nombre de empresa - solo visible cuando es nueva empresa */}
                {(form.watch('business') === 'other' || selectedBusiness === 'other') && (
                    <FormField
                        name="businessName"
                        control={form.control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de la Empresa</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre comercial" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Solo mostrar otros campos si no es showOnlyName */}
                <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                            name="tipoDocumento"
                            control={form.control}
                            rules={{ required: 'Este campo es requerido' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Documento</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            selectPlaceholder="Seleccione tipo de documento"
                                            searchPlaceholder="Buscar tipo"
                                            value={field.value ?? ''}
                                            onChange={field.onChange}
                                            items={Object.values(TipoDocumento).map(
                                                (value) => ({
                                                    label: pascalCaseToSpaces(value),
                                                    value,
                                                }),
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="numeroDocumento"
                            control={form.control}
                            rules={{
                                required: 'Este campo es requerido',
                                pattern: {
                                    value: /^[0-9]{7,11}$/,
                                    message:
                                        'El número de documento debe tener entre 7 y 11 dígitos',
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de Documento</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Número sin guiones"
                                            type="number"
                                            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        name="legalName"
                        control={form.control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Razón Social</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Razón social como figura en AFIP"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="taxCondition"
                        control={form.control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Condición frente al IVA</FormLabel>
                                <FormControl>
                                    <Combobox
                                        selectPlaceholder="Seleccione condición IVA"
                                        searchPlaceholder="Buscar condición"
                                        value={field.value ?? ''}
                                        onChange={field.onChange}
                                        items={Object.values(IvaCondition).map(
                                            (condition) => ({
                                                label: capitalizeFirstLetter(
                                                    pascalCaseToSpaces(condition),
                                                ),
                                                value: condition,
                                            }),
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="billingAddress"
                        control={form.control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Domicilio comercial</FormLabel>
                                <FormControl>
                                    <Input placeholder="Domicilio comercial" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Emails de Facturación</h3>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Email de facturación"
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddEmail();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddEmail}
                                disabled={
                                    !emailInput.trim() ||
                                    billingEmails.includes(emailInput.trim())
                                }
                            >
                                <Plus className="size-4" />
                            </Button>
                        </div>

                        {billingEmails.length > 0 && (
                            <div className="space-y-2">
                                {billingEmails.map((email, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-md border p-2"
                                    >
                                        <span className="text-sm">{email}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveEmail(email)}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Contactos</h3>
                            <Dialog
                                open={isContactDialogOpen}
                                onOpenChange={setIsContactDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingContact(null)}
                                    >
                                        <Plus className="mr-2 size-4" />
                                        Agregar contacto
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingContact
                                                ? 'Editar contacto'
                                                : 'Agregar contacto'}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <ContactForm
                                        defaultValues={editingContact || undefined}
                                        onSubmit={
                                            editingContact
                                                ? handleUpdateContact
                                                : handleAddContact
                                        }
                                        onCancel={() => setIsContactDialogOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-4">
                            {contacts.map((contact, index) => (
                                <ContactItem
                                    key={index}
                                    contact={contact}
                                    onEdit={handleEditContact}
                                    onDelete={handleDeleteContact}
                                />
                            ))}
                        </div>
                    </div>
                </>

                {!isEmbedded && (
                    <div className="flex flex-row justify-end gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.back()}
                        >
                            Cancelar
                        </Button>
                        <ButtonWithSpinner
                            showSpinner={
                                createBillingProfile.isPending ||
                                updateBillingProfile.isPending
                            }
                        >
                            Guardar
                        </ButtonWithSpinner>
                    </div>
                )}
            </form>
        </Form>
    );

    if (isEmbedded) {
        return formContent;
    }

    return (
        <main className="rounded-md border border-accent bg-background-primary p-4">
            <TypographyH2 asChild className="mb-4">
                <h1>
                    {profileIdToUpdate
                        ? 'Editar Perfil de Facturación'
                        : 'Crear Perfil de Facturación'}
                </h1>
            </TypographyH2>
            {formContent}
        </main>
    );
};

export default CreateOrUpdateBillingProfileForm;
