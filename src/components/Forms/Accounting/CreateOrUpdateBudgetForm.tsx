import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import BillingProfileDisplay from './BillingProfileDisplay';
import CreateOrUpdateBillingProfileForm, {
    FormValues as BillingProfileFormValues,
} from './CreateOrUpdateBillingProfileForm';

import { GetBranchesQuery, GetClientsQuery, GetBusinessesQuery } from '@/api/graphql';
import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import Combobox from '@/components/Combobox';
import EmailSearchModal from '@/components/EmailSearchModal';
import type { EmailThread } from '@/components/EmailSearchModal';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TypographyH2, TypographyH3 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import { useGetBillingProfileByBusinessId } from '@/hooks/api/billingProfile';
import { useCreateBudget } from '@/hooks/api/budget/useCreateBudget';
import { useCreateBudgetWithBillingProfile } from '@/hooks/api/budget/useCreateBudgetWithBillingProfile';
import { useUpdateBudget } from '@/hooks/api/budget/useUpdateBudget';
import { useGetClientsByBusiness } from '@/hooks/api/client/useGetClientsByBusiness';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';

type FormValues = {
    client?: string | null;
    clientName?: string;
    branch?: string | null;
    business?: string;
    description?: string;
    subject?: string;
    price?: number;
    billingProfile?: BillingProfileFormValues;
};

type Props = {
    defaultValues?: FormValues;
    budgetIdToUpdate?: string;
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
    clients: NonNullable<GetClientsQuery['clients']>;
    branches: NonNullable<GetBranchesQuery['branches']>;
};

const CreateOrUpdateBudgetForm = ({
    defaultValues,
    budgetIdToUpdate,
    businesses,
    clients,
    branches,
}: Props): JSX.Element => {
    const router = useRouter();
    const { triggerAlert } = useAlert();

    const form = useForm<FormValues>({
        defaultValues: defaultValues || {
            business: '',
            client: null,
            branch: null,
            subject: '',
            description: '',
            price: 0,
            billingProfile: {
                businessName: '',
                cuit: '',
                legalName: '',
                taxCondition: undefined,
                billingAddress: '',
                billingEmail: '',
                contacts: [],
            },
        },
    });

    const watchBusiness = form.watch('business');
    const isNewBusiness = watchBusiness === 'other';

    // Obtener perfil de facturación si se selecciona una empresa existente
    const { data: existingBillingProfile } = useGetBillingProfileByBusinessId(
        !isNewBusiness && watchBusiness ? watchBusiness : '',
    );

    // Obtener clientes de la empresa seleccionada
    const { data: clientsByBusinessData } = useGetClientsByBusiness({
        businessId: !isNewBusiness && watchBusiness ? watchBusiness : '',
        search: null,
    });

    // Usar clientes filtrados por empresa si hay una empresa seleccionada, sino usar todos los clientes
    const availableClients = clientsByBusinessData?.clientsByBusiness || clients;

    // Establecer valores por defecto cuando se carguen los datos
    useEffect(() => {
        if (defaultValues) {
            form.reset(defaultValues);
        }
    }, [defaultValues, form]);

    // Limpiar cliente seleccionado cuando cambie la empresa (solo si no estamos en modo edición)
    useEffect(() => {
        if (!budgetIdToUpdate && watchBusiness) {
            form.setValue('client', null);
            form.setValue('branch', null);
        }
    }, [watchBusiness, form, budgetIdToUpdate]);

    const createBudget = useCreateBudget();
    const createBudgetWithBillingProfile = useCreateBudgetWithBillingProfile();
    const updateBudget = useUpdateBudget();

    const onSubmit = async (formData: FormValues): Promise<void> => {
        try {
            if (!formData.business) {
                throw new Error('Debe seleccionar una empresa');
            }

            if (budgetIdToUpdate) {
                // Para actualizar, usar la mutación normal
                const billingProfileId =
                    existingBillingProfile?.billingProfileByBusinessId?.id;
                if (!billingProfileId) {
                    throw new Error('No se encontró el perfil de facturación');
                }

                const input = {
                    subject: formData.subject || '',
                    description: formData.description || '',
                    price: formData.price || 0,
                    clientId:
                        formData.client === 'other' ? null : formData.client || null,
                    branchId: formData.branch || null,
                };

                const result = await updateBudget.mutateAsync({
                    id: budgetIdToUpdate,
                    input,
                });

                // Verificar si la operación fue exitosa
                if (!result.updateBudget?.success) {
                    throw new Error(
                        result.updateBudget?.message ||
                            'Error al actualizar el presupuesto',
                    );
                }

                triggerAlert({
                    type: 'Success',
                    message: 'El presupuesto fue actualizado correctamente',
                });
            } else {
                // Para crear, decidir qué mutación usar
                const billingProfileId =
                    existingBillingProfile?.billingProfileByBusinessId?.id;

                if (billingProfileId) {
                    // Usar mutación normal si ya existe el perfil
                    const input = {
                        subject: formData.subject || '',
                        description: formData.description || '',
                        price: formData.price || 0,
                        billingProfileId,
                        clientId:
                            formData.client === 'other' ? null : formData.client || null,
                        branchId: formData.branch || null,
                        gmailThreadId: selectedEmailThread?.id || null,
                    };

                    const result = await createBudget.mutateAsync({ input });

                    // Verificar si la operación fue exitosa
                    if (!result.createBudget?.success) {
                        throw new Error(
                            result.createBudget?.message ||
                                'Error al crear el presupuesto',
                        );
                    }

                    triggerAlert({
                        type: 'Success',
                        message: 'El presupuesto fue creado correctamente',
                    });
                } else {
                    // Usar mutación combinada si hay que crear el perfil
                    if (!formData.billingProfile) {
                        throw new Error('Datos del perfil de facturación requeridos');
                    }

                    const input = {
                        subject: formData.subject || '',
                        description: formData.description || '',
                        price: formData.price || 0,
                        billingProfileId: null, // No existe, se creará
                        businessId: formData.business!,
                        businessName: formData.billingProfile.businessName!,
                        businessCUIT: formData.billingProfile.cuit!,
                        businessBillingEmail: formData.billingProfile.billingEmail!,
                        businessComercialAddress: formData.billingProfile.billingAddress!,
                        businessLegalName: formData.billingProfile.legalName!,
                        businessIVACondition: formData.billingProfile.taxCondition!,
                        contacts:
                            formData.billingProfile.contacts?.map((contact) => ({
                                fullName: contact.name,
                                email: contact.email,
                                phone: contact.phone,
                                notes: contact.notes,
                            })) || [],
                        clientId:
                            formData.client === 'other' ? null : formData.client || null,
                        branchId: formData.branch || null,
                        gmailThreadId: selectedEmailThread?.id || null,
                    };

                    const result = await createBudgetWithBillingProfile.mutateAsync({
                        input,
                    });

                    // Verificar si la operación fue exitosa
                    if (!result.createBudgetWithBillingProfile?.success) {
                        throw new Error(
                            result.createBudgetWithBillingProfile?.message ||
                                'Error al crear el presupuesto con perfil de facturación',
                        );
                    }

                    triggerAlert({
                        type: 'Success',
                        message: 'El presupuesto fue creado correctamente',
                    });
                }
            }
            router.back();
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: getCleanErrorMessage(error as Error),
            });
        }
    };

    const [isMailModalOpen, setMailModalOpen] = useState(false);
    const [selectedEmailThread, setSelectedEmailThread] = useState<EmailThread | null>(
        null,
    );

    return (
        <main className="rounded-md border border-accent bg-background-primary p-4">
            <TypographyH2 asChild className="mb-4">
                <h1>{budgetIdToUpdate ? 'Editar Presupuesto' : 'Crear Presupuesto'}</h1>
            </TypographyH2>

            {/* Botón para buscar cadenas de mails */}
            <div className="mb-4 flex flex-row items-center gap-2">
                <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setMailModalOpen(true)}
                >
                    Buscar cadenas de mails
                </Button>
                {selectedEmailThread && (
                    <span className="text-xs text-muted-foreground">
                        Asunto seleccionado: {selectedEmailThread?.subject}
                    </span>
                )}
            </div>

            <EmailSearchModal
                open={isMailModalOpen}
                onClose={() => setMailModalOpen(false)}
                onSelect={(thread: EmailThread) => {
                    setSelectedEmailThread(thread);
                    form.setValue('subject', thread.subject || '');
                }}
                selectedThread={selectedEmailThread}
            />

            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="business"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
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
                                            ...businesses.map((business) => ({
                                                label: business.name,
                                                value: business.id,
                                            })),
                                        ]}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Formulario de Perfil de Facturación - Siempre visible */}
                    <div className="space-y-4 rounded-lg border border-accent p-4">
                        <div className="flex items-center justify-between">
                            <TypographyH3>Perfil de Facturación</TypographyH3>
                            {existingBillingProfile?.billingProfileByBusinessId && (
                                <span className="text-sm text-muted-foreground">
                                    Datos de la empresa seleccionada
                                </span>
                            )}
                        </div>

                        {existingBillingProfile?.billingProfileByBusinessId ? (
                            <BillingProfileDisplay
                                billingProfile={
                                    existingBillingProfile.billingProfileByBusinessId
                                }
                                businessName={
                                    businesses.find((b) => b.id === watchBusiness)
                                        ?.name || 'Empresa'
                                }
                            />
                        ) : (
                            <CreateOrUpdateBillingProfileForm
                                isEmbedded={true}
                                businessId={!isNewBusiness ? watchBusiness : undefined}
                                selectedBusiness={watchBusiness}
                                onSubmit={(billingData) => {
                                    form.setValue(
                                        'billingProfile.businessName',
                                        billingData.businessName,
                                    );
                                    form.setValue(
                                        'billingProfile.cuit',
                                        billingData.cuit,
                                    );
                                    form.setValue(
                                        'billingProfile.contacts',
                                        billingData.contacts?.map((contact) => ({
                                            name: contact.name,
                                            email: contact.email,
                                            phone: contact.phone,
                                            notes: contact.notes,
                                        })),
                                    );
                                    form.setValue(
                                        'billingProfile.legalName',
                                        billingData.legalName,
                                    );
                                    form.setValue(
                                        'billingProfile.taxCondition',
                                        billingData.taxCondition,
                                    );
                                    form.setValue(
                                        'billingProfile.billingAddress',
                                        billingData.billingAddress,
                                    );
                                    form.setValue(
                                        'billingProfile.billingEmail',
                                        billingData.billingEmail,
                                    );
                                }}
                            />
                        )}
                    </div>

                    <FormField
                        name="client"
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                <FormControl>
                                    <Combobox
                                        selectPlaceholder="Seleccione un cliente"
                                        searchPlaceholder="Buscar cliente"
                                        value={field.value ?? ''}
                                        onChange={field.onChange}
                                        items={[
                                            {
                                                label: 'Otro',
                                                value: 'other',
                                            },
                                            ...availableClients.map((client) => ({
                                                label: client.name,
                                                value: client.id,
                                            })),
                                        ]}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {form.watch('client') === 'other' && (
                        <FormField
                            name="clientName"
                            control={form.control}
                            rules={{
                                required: 'Este campo es requerido',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del cliente</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nombre del cliente"
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {form.watch('client') !== 'other' && form.watch('client') && (
                        <FormField
                            name="branch"
                            control={form.control}
                            rules={{
                                required: 'Este campo es requerido',
                            }}
                            disabled={!form.watch('client')}
                            render={({ field }) => (
                                <FormItem
                                    className={
                                        field.disabled
                                            ? 'pointer-events-none opacity-30'
                                            : ''
                                    }
                                >
                                    <FormLabel>Sucursal</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            selectPlaceholder="Seleccione una sucursal"
                                            searchPlaceholder="Buscar sucursal"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            items={branches
                                                .filter(
                                                    (branch) =>
                                                        branch.client.id ===
                                                        form.watch('client'),
                                                )
                                                .map((branch) => ({
                                                    label: `${branch.number}, ${branch.city.name}`,
                                                    value: branch.id,
                                                }))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        name="subject"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Asunto</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Asunto del presupuesto"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="description"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                            minLength: {
                                value: 3,
                                message:
                                    'La descripción debe tener al menos 3 caracteres',
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Descripción del presupuesto"
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="price"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                            min: {
                                value: 0,
                                message: 'El precio debe ser mayor a 0',
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Precio"
                                        type="number"
                                        {...field}
                                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            field.onChange(value);
                                        }}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-row justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.push(routesBuilder.accounting.budgets.list())
                            }
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <ButtonWithSpinner
                            showSpinner={
                                createBudget.isPending ||
                                createBudgetWithBillingProfile.isPending ||
                                updateBudget.isPending
                            }
                        >
                            Guardar
                        </ButtonWithSpinner>
                    </div>
                </form>
            </Form>
        </main>
    );
};

export default CreateOrUpdateBudgetForm;
