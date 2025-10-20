import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import BillingProfileDisplay from './BillingProfileDisplay';
import CreateOrUpdateBillingProfileForm, {
    FormValues as BillingProfileFormValues,
} from './CreateOrUpdateBillingProfileForm';

import {
    GetBusinessesQuery,
    ExpectedExpense,
    Manpower,
    BudgetBranch,
    ExpenseType,
} from '@/api/graphql';
import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import Combobox from '@/components/Combobox';
import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
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
// import { useGetCities } from '@/hooks/api/city/useGetCities';
import { useGetClientsByBusiness } from '@/hooks/api/client/useGetClientsByBusiness';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';
import { getCleanErrorMessage, pascalCaseToSpaces } from '@/lib/utils';

type FormValues = {
    client?: string | null;
    clientName?: string;
    branch?: string | null;
    business?: string;
    description?: string;
    subject?: string;
    price?: number;
    billingProfile?: BillingProfileFormValues;
    expectedExpenses?: ExpectedExpense[];
    manpower?: Manpower[];
    markup?: number;
    budgetBranch?: BudgetBranch;
    createBranch?: boolean;
    createClient?: boolean;
    branchCityId?: string;
    // Campos dinámicos para field arrays
    [key: string]: any;
};

type Props = {
    defaultValues?: FormValues;
    budgetIdToUpdate?: string;
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
};

const CreateOrUpdateBudgetForm = ({
    defaultValues,
    budgetIdToUpdate,
    businesses,
}: Props): JSX.Element => {
    const router = useRouter();
    const { triggerAlert } = useAlert();

    const form = useForm<FormValues>({
        defaultValues: defaultValues || {
            business: '',
            client: null,
            branch: null,
            clientName: '',
            subject: '',
            description: '',
            price: undefined,
            expectedExpenses: [],
            manpower: [],
            markup: undefined,
            budgetBranch: {
                name: '',
                number: undefined,
            },
            createBranch: false,
            createClient: false,
            branchCityId: '',
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
    const clientBranches = clientsByBusinessData?.clientsByBusiness?.find(
        (client) => client.id === form.watch('client'),
    )?.branches;

    // Usar clientes filtrados por empresa si hay una empresa seleccionada, sino usar todos los clientes
    const availableClients = clientsByBusinessData?.clientsByBusiness;

    // Obtener técnicos y ciudades
    const { data: techniciansData } = useGetTechnicians({});
    // const { data: citiesData } = useGetCities({});

    // Configurar field arrays para gastos estimados y mano de obra
    const {
        fields: expectedExpensesFields,
        append: appendExpectedExpense,
        remove: removeExpectedExpense,
    } = useFieldArray({
        control: form.control,
        name: 'expectedExpenses',
    });

    const {
        fields: manpowerFields,
        append: appendManpower,
        remove: removeManpower,
    } = useFieldArray({
        control: form.control,
        name: 'manpower',
    });

    // Tipos de gastos disponibles
    const expenseTypes: { value: string; label: string }[] = Object.values(
        ExpenseType,
    ).map((type) => ({
        value: type,
        label: pascalCaseToSpaces(type),
    }));

    // Calcular totales
    const expectedExpenses = form.watch('expectedExpenses') || [];
    const manpower = form.watch('manpower') || [];
    const markup = form.watch('markup') || 0;

    const totalExpectedExpenses = expectedExpenses.reduce(
        (sum, expense) => sum + (expense.amount || 0),
        0,
    );
    const totalManpower = manpower.reduce(
        (sum, worker) => sum + (worker.payAmount || 0),
        0,
    );
    const subtotal = totalExpectedExpenses + totalManpower;
    const finalPrice = subtotal * (1 + (markup || 0) / 100);

    // Función para calcular el monto de un gasto estimado
    const calculateExpenseAmount = (
        unitPrice: number,
        quantity: number,
        type: string,
    ) => {
        if (type === 'Combustible') {
            return unitPrice; // Para combustible no se multiplica por cantidad
        }
        return unitPrice * quantity;
    };

    // Función para agregar un gasto estimado
    const addExpectedExpense = () => {
        appendExpectedExpense({
            type: 'Combustible',
            unitPrice: 0,
            quantity: 1,
            amount: 0,
        });
    };

    // Función para agregar mano de obra
    const addManpower = () => {
        appendManpower({
            technician: 'other',
            payAmount: 0,
        });
    };

    // Actualizar precio automáticamente
    useEffect(() => {
        form.setValue('price', finalPrice);
    }, [finalPrice, form]);

    // Flag para evitar múltiples ejecuciones
    const [hasInitialized, setHasInitialized] = useState(false);

    // Establecer valores por defecto cuando se carguen los datos
    useEffect(() => {
        if (defaultValues && !hasInitialized && techniciansData) {
            // Usar setTimeout para evitar problemas de focus
            setTimeout(() => {
                form.reset(defaultValues);

                // Si hay un clientName, significa que es un cliente externo
                // Establecer automáticamente "Otro" en el dropdown de cliente
                if (defaultValues.clientName && !defaultValues.client) {
                    form.setValue('client', 'other');
                }

                // Cargar gastos estimados si existen
                if (
                    defaultValues.expectedExpenses &&
                    defaultValues.expectedExpenses.length > 0
                ) {
                    // Limpiar los field arrays existentes primero
                    const currentExpensesLength = expectedExpensesFields.length;
                    for (let i = currentExpensesLength - 1; i >= 0; i--) {
                        removeExpectedExpense(i);
                    }
                    // Agregar los gastos estimados
                    defaultValues.expectedExpenses.forEach((expense) => {
                        appendExpectedExpense(expense);
                    });
                }

                // Cargar mano de obra si existe
                if (defaultValues.manpower && defaultValues.manpower.length > 0) {
                    // Limpiar los field arrays existentes primero
                    const currentManpowerLength = manpowerFields.length;
                    for (let i = currentManpowerLength - 1; i >= 0; i--) {
                        removeManpower(i);
                    }
                    // Agregar la mano de obra con lógica de selección de técnico
                    defaultValues.manpower.forEach((worker) => {
                        // Buscar si el técnico existe en la lista de técnicos
                        const technicianInList = techniciansData?.technicians?.find(
                            (tech) => tech.fullName === worker.technician,
                        );

                        if (technicianInList) {
                            // Si se encuentra, usar el ID del técnico
                            appendManpower({
                                technician: technicianInList.id,
                                payAmount: worker.payAmount,
                            });
                        } else {
                            // Si no se encuentra, usar "Otro" y poner el nombre
                            appendManpower({
                                technician: 'other',
                                payAmount: worker.payAmount,
                                technicianName: worker.technician, // Campo adicional para el nombre
                            } as any);
                        }
                    });
                }

                setHasInitialized(true);
            }, 0);
        }
    }, [
        defaultValues,
        hasInitialized,
        form,
        appendExpectedExpense,
        appendManpower,
        removeExpectedExpense,
        removeManpower,
        techniciansData,
    ]);

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

            // Procesar gastos estimados - filtrar los que tienen valor 0
            const processedExpectedExpenses = (formData.expectedExpenses || [])
                .filter((expense) => expense.amount && expense.amount > 0)
                .map((expense) => ({
                    type: expense.type,
                    unitPrice: expense.unitPrice || 0,
                    quantity: expense.quantity || 1,
                    amount: expense.amount || 0,
                }));

            // Procesar mano de obra para manejar técnicos "Otro"
            const processedManpower = (formData.manpower || [])
                .filter((worker) => worker.payAmount && worker.payAmount > 0)
                .map((worker) => {
                    if (worker.technician === 'other') {
                        // Si es "Otro", usar el nombre del técnico ingresado
                        const technicianName = (worker as any).technicianName;
                        return {
                            technician: technicianName || 'Técnico no especificado',
                            payAmount: worker.payAmount || 0,
                        };
                    }
                    // Si es un técnico de la base de datos, buscar su nombre
                    const technician = techniciansData?.technicians?.find(
                        (tech) => tech.id === worker.technician,
                    );
                    return {
                        technician: technician?.fullName || worker.technician,
                        payAmount: worker.payAmount || 0,
                    };
                });

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
                    clientName: formData.clientName || '',
                    clientId:
                        formData.client === 'other' ? null : formData.client || null,
                    branchId: formData.branch || null,
                    markup: formData.markup || 0,
                    expectedExpenses: processedExpectedExpenses,
                    manpower: processedManpower,
                    budgetBranch: formData.budgetBranch || null,
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
                        clientName: formData.clientName || '',
                        billingProfileId,
                        clientId:
                            formData.client === 'other' ? null : formData.client || null,
                        branchId: formData.branch || null,
                        markup: formData.markup || 0,
                        expectedExpenses: processedExpectedExpenses,
                        manpower: processedManpower,
                        budgetBranch: formData.budgetBranch || null,
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
                        clientName: formData.clientName || '',
                        businessId:
                            formData.business !== 'other' ? formData.business : null,
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
                        markup: formData.markup || 0,
                        expectedExpenses: processedExpectedExpenses,
                        manpower: processedManpower,
                        budgetBranch: formData.budgetBranch || null,
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

    return (
        <main className="rounded-md border border-accent bg-background-primary p-4">
            <TypographyH2 asChild className="mb-4">
                <h1>{budgetIdToUpdate ? 'Editar Presupuesto' : 'Crear Presupuesto'}</h1>
            </TypographyH2>

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
                    {watchBusiness && (
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
                                    businessId={
                                        !isNewBusiness ? watchBusiness : undefined
                                    }
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
                    )}

                    {watchBusiness && (
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
                                                ...(availableClients || []).map(
                                                    (client) => ({
                                                        label: client.name,
                                                        value: client.id,
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

                    {form.watch('client') !== 'other' &&
                        form.watch('client') &&
                        clientBranches && (
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
                                                items={[
                                                    {
                                                        label: 'Otro',
                                                        value: 'other',
                                                    },
                                                    ...(clientBranches?.map((branch) => ({
                                                        label: `${branch.number ? `#${branch.number}, ` : ''}${branch.name ? `${branch.name} - ` : ''}${branch.city.name}`,
                                                        value: branch.id,
                                                    })) || []),
                                                ]}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                    {/* Campos para sucursal "Otro" */}
                    {form.watch('branch') === 'other' && (
                        <div className="space-y-4 rounded-lg border border-accent p-4">
                            <TypographyH3>Información de Sucursal</TypographyH3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                    name="budgetBranch.name"
                                    control={form.control}
                                    rules={{
                                        validate: (value) => {
                                            const number =
                                                form.getValues('budgetBranch.number');
                                            if (!value && !number) {
                                                return 'Debe proporcionar al menos un nombre o número';
                                            }
                                            return true;
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre de la Sucursal</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nombre de la sucursal"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="budgetBranch.number"
                                    control={form.control}
                                    rules={{
                                        validate: (value) => {
                                            const name =
                                                form.getValues('budgetBranch.name');
                                            if (!value && !name) {
                                                return 'Debe proporcionar al menos un nombre o número';
                                            }
                                            return true;
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número de la Sucursal</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Número de la sucursal"
                                                    {...field}
                                                    value={field.value || ''}
                                                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                    onChange={(e) => {
                                                        const value =
                                                            parseInt(e.target.value) ||
                                                            undefined;
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* <FormField
                                name="createBranch"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Crear sucursal en la base de datos
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            /> */}

                            {/* {form.watch('createBranch') && (
                                <FormField
                                    name="branchCityId"
                                    control={form.control}
                                    rules={{
                                        required: form.watch('createBranch')
                                            ? 'Este campo es requerido'
                                            : false,
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ciudad</FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    selectPlaceholder="Seleccionar ciudad"
                                                    searchPlaceholder="Buscar ciudad"
                                                    value={field.value || ''}
                                                    onChange={field.onChange}
                                                    items={
                                                        citiesData?.cities?.map(
                                                            (city) => ({
                                                                label: `${city.name} - ${city.province.name}`,
                                                                value: city.id,
                                                            }),
                                                        ) || []
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )} */}
                        </div>
                    )}

                    {/* Checkbox para crear cliente - solo si se selecciona "Otro" */}
                    {/* {form.watch('client') === 'other' && (
                        <FormField
                            name="createClient"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Crear cliente en la base de datos
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                    )} */}

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

                    {/* Gastos Estimados */}
                    <div className="space-y-4 rounded-lg border border-accent p-4">
                        <div className="flex items-center justify-between">
                            <TypographyH3>Gastos Estimados</TypographyH3>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addExpectedExpense}
                            >
                                Agregar Gasto
                            </Button>
                        </div>

                        {expectedExpensesFields.map((field, index) => (
                            <div
                                key={field.id}
                                className="grid grid-cols-1 items-end gap-4 md:grid-cols-5"
                            >
                                <FormField
                                    name={`expectedExpenses.${index}.type`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo</FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    selectPlaceholder="Seleccionar tipo"
                                                    searchPlaceholder="Buscar tipo"
                                                    value={field.value || ''}
                                                    onChange={field.onChange}
                                                    items={expenseTypes}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name={`expectedExpenses.${index}.unitPrice`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Precio Unitario</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    {...field}
                                                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                    onChange={(e) => {
                                                        const value =
                                                            parseFloat(e.target.value) ||
                                                            undefined;
                                                        field.onChange(value);
                                                        const quantity =
                                                            form.getValues(
                                                                `expectedExpenses.${index}.quantity`,
                                                            ) || 1;
                                                        const type =
                                                            form.getValues(
                                                                `expectedExpenses.${index}.type`,
                                                            ) || '';
                                                        const amount =
                                                            calculateExpenseAmount(
                                                                value || 0,
                                                                quantity || 1,
                                                                type,
                                                            );
                                                        form.setValue(
                                                            `expectedExpenses.${index}.amount`,
                                                            amount,
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name={`expectedExpenses.${index}.quantity`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cantidad</FormLabel>
                                            <FormControl>
                                                {form.watch(
                                                    `expectedExpenses.${index}.type`,
                                                ) === 'Combustible' ? (
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="N/A"
                                                        value=""
                                                        disabled
                                                        className="opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                    />
                                                ) : (
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="1"
                                                        {...field}
                                                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                        onChange={(e) => {
                                                            const value =
                                                                parseInt(
                                                                    e.target.value,
                                                                ) || undefined;
                                                            field.onChange(value);
                                                            const unitPrice =
                                                                form.getValues(
                                                                    `expectedExpenses.${index}.unitPrice`,
                                                                ) || 0;
                                                            const type =
                                                                form.getValues(
                                                                    `expectedExpenses.${index}.type`,
                                                                ) || '';
                                                            const amount =
                                                                calculateExpenseAmount(
                                                                    unitPrice || 0,
                                                                    value || 1,
                                                                    type,
                                                                );
                                                            form.setValue(
                                                                `expectedExpenses.${index}.amount`,
                                                                amount,
                                                            );
                                                        }}
                                                    />
                                                )}
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex items-center justify-center rounded-md bg-muted p-2">
                                    <span className="font-medium">
                                        $
                                        {form.watch(`expectedExpenses.${index}.amount`) ||
                                            0}
                                    </span>
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => removeExpectedExpense(index)}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Mano de Obra */}
                    <div className="space-y-4 rounded-lg border border-accent p-4">
                        <div className="flex items-center justify-between">
                            <TypographyH3>Mano de Obra</TypographyH3>
                            <Button type="button" variant="outline" onClick={addManpower}>
                                Agregar Técnico
                            </Button>
                        </div>

                        {manpowerFields.map((field, index) => (
                            <div
                                key={field.id}
                                className="space-y-4 rounded-lg border border-accent p-4"
                            >
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormField
                                        name={`manpower.${index}.technician`}
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Técnico</FormLabel>
                                                <FormControl>
                                                    <Combobox
                                                        selectPlaceholder="Seleccionar técnico"
                                                        searchPlaceholder="Buscar técnico"
                                                        value={field.value || ''}
                                                        onChange={field.onChange}
                                                        items={[
                                                            {
                                                                label: 'Otro',
                                                                value: 'other',
                                                            },
                                                            ...(techniciansData?.technicians?.map(
                                                                (tech) => ({
                                                                    label: tech.fullName,
                                                                    value: tech.id,
                                                                }),
                                                            ) || []),
                                                        ]}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name={`manpower.${index}.payAmount`}
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Paga</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        {...field}
                                                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                        onChange={(e) => {
                                                            const value =
                                                                parseFloat(
                                                                    e.target.value,
                                                                ) || undefined;
                                                            field.onChange(value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {form.watch(`manpower.${index}.technician`) ===
                                    'other' && (
                                    <FormField
                                        name={`manpower.${index}.technicianName` as any}
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre del Técnico</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nombre del técnico"
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeManpower(index)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Markup y Cálculos */}
                    <div className="space-y-4 rounded-lg border border-accent p-4">
                        <TypographyH3>Configuración de Precio</TypographyH3>

                        <FormField
                            name="markup"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Markup (%)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0"
                                            {...field}
                                            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                            onChange={(e) => {
                                                const value =
                                                    parseFloat(e.target.value) ||
                                                    undefined;
                                                field.onChange(value);
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Total Gastos Estimados:</span>
                                    <span>${totalExpectedExpenses.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Mano de Obra:</span>
                                    <span>${totalManpower.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Markup ({markup || 0}%):</span>
                                    <span>
                                        ${(subtotal * ((markup || 0) / 100)).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Precio Final:</span>
                                    <span>${finalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
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
