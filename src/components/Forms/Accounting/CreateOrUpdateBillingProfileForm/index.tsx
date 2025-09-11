import { useRouter } from 'next/navigation';

import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { ContactForm, ContactFormValues } from './ContactForm';
import { ContactItem } from './ContactItem';

import { GetBusinessesWithoutBillingProfileQuery, IvaCondition } from '@/api/graphql';
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
    cuit: string;
    contacts: ContactFormValues[];
    billingEmail: string;
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
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<ContactFormValues | null>(null);

    const form = useForm<FormValues>({
        defaultValues: defaultValues || {
            cuit: '',
            legalName: '',
            billingEmail: '',
            billingAddress: '',
            taxCondition: '' as FormValues['taxCondition'],
        },
    });

    useEffect(() => {
        if (isEmbedded && onSubmit) {
            const subscription = form.watch((value) => onSubmit(value as FormValues));
            return () => subscription.unsubscribe();
        }
    }, [form, isEmbedded, onSubmit]);

    // Actualizar formulario cuando se obtenga el perfil de facturación existente
    useEffect(() => {
        if (businessId && !profileIdToUpdate) {
            form.setValue('legalName', defaultValues?.legalName || '');
            form.setValue('cuit', defaultValues?.cuit || '');
            form.setValue('billingEmail', defaultValues?.billingEmail || '');
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

                const input = {
                    CUIT: formData.cuit,
                    legalName: formData.legalName,
                    IVACondition: formData.taxCondition,
                    comercialAddress: formData.billingAddress,
                    billingEmail: formData.billingEmail,
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

                const input = {
                    CUIT: formData.cuit,
                    legalName: formData.legalName,
                    IVACondition: formData.taxCondition,
                    comercialAddress: formData.billingAddress,
                    billingEmail: formData.billingEmail,
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
                    <FormField
                        name="cuit"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                            pattern: {
                                value: /^[0-9]{11}$/,
                                message: 'El CUIT debe tener 11 dígitos',
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CUIT</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="CUIT sin guiones"
                                        type="number"
                                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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

                    <FormField
                        name="billingEmail"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email inválido',
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email de Facturación</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Email de facturación"
                                        type="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                        <Plus className="mr-2 h-4 w-4" />
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
