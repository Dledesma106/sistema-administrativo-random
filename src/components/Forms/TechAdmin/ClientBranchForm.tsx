import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateBranchDocument,
    CreateBranchMutationVariables,
    UpdateBranchDocument,
    UpdateBranchMutationVariables,
    GetBusinessesQuery,
    GetCitiesQuery,
} from '@/api/graphql';
import Combobox from '@/components/Combobox';
import { FancyMultiSelect } from '@/components/MultiSelect';
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
import { TypographyH1 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import useLoading from '@/hooks/useLoading';
import { routesBuilder } from '@/lib/routes';

export interface BranchFormValues {
    number?: number;
    cityId?: string;
    businesses?: {
        value: string;
        label: string;
    }[];
}

type Props = {
    branchForm?: BranchFormValues;
    client: {
        id: string;
        name: string;
    };
    idToUpdate?: string;
    cities: NonNullable<GetCitiesQuery['cities']>;
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
};

export default function ClientBranchForm({
    branchForm,
    client,
    cities,
    businesses,
    idToUpdate,
}: Props): JSX.Element {
    const router = useRouter();
    const { stopLoading, startLoading } = useLoading();
    const form = useForm<BranchFormValues>({ defaultValues: branchForm });
    const { triggerAlert } = useAlert();

    const createMutation = useMutation({
        mutationFn: async (data: CreateBranchMutationVariables) => {
            return fetchClient(CreateBranchDocument, data);
        },
        onSuccess: () => {
            router.push('/tech-admin/cities');
            triggerAlert({
                type: 'Success',
                message: `Se creó la sucursal correctamente`,
            });
            stopLoading();
        },
        onError: () => {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo crear la sucursal`,
            }),
                stopLoading();
        },
    });
    const updateMutation = useMutation({
        mutationFn: async (data: UpdateBranchMutationVariables) => {
            return fetchClient(UpdateBranchDocument, data);
        },
        onSuccess: () => {
            router.push(`/tech-admin/clients/${client.id}/branches`);
            triggerAlert({
                type: 'Success',
                message: `Se actualizó la sucursal correctamente`,
            });
            stopLoading();
        },
        onError: () => {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo actualizar la sucursal`,
            }),
                stopLoading();
        },
    });

    const onSubmit: SubmitHandler<BranchFormValues> = (data) => {
        if (!data.cityId || !data.businesses || !client || !data.number) {
            return;
        }

        startLoading();

        if (idToUpdate) {
            updateMutation.mutate({
                id: idToUpdate,
                input: {
                    cityId: data.cityId,
                    businessesIds: data.businesses.map((business) => business.value),
                    clientId: client.id,
                    number: data.number,
                },
            });
            return;
        } else {
            createMutation.mutate({
                input: {
                    cityId: data.cityId,
                    businessesIds: data.businesses.map((business) => business.value),
                    clientId: client.id,
                    number: data.number,
                },
            });
        }
    };

    return (
        <main>
            <div className="mb-8 space-y-2">
                <TypographyH1>
                    {!idToUpdate ? 'Agregar Sucursal' : 'Editar Sucursal'}
                </TypographyH1>

                <p className="text-muted-foreground">
                    Estás {!idToUpdate ? 'agregando' : 'editando'} una sucursal{' '}
                    {!idToUpdate ? 'para el' : 'del'} cliente{' '}
                    <strong>{client.name}</strong>
                </p>
            </div>

            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="number"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Sucursal N°</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Número de Sucursal"
                                            onChange={(e) => {
                                                const value = e.target.value.replace(
                                                    /[^0-9]/g,
                                                    '',
                                                );

                                                if (!value) {
                                                    field.onChange('');
                                                    return;
                                                }

                                                const asInt = parseInt(value, 10);

                                                if (asInt > 2147483647) {
                                                    return;
                                                }

                                                if (isNaN(Number(asInt))) {
                                                    return;
                                                }

                                                field.onChange(asInt);
                                            }}
                                            value={
                                                typeof field.value === 'number'
                                                    ? field.value
                                                    : ''
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                        control={form.control}
                        rules={{ required: 'Este campo es requerido' }}
                    />

                    <FormField
                        name="cityId"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ciudad</FormLabel>
                                <FormControl>
                                    <Combobox
                                        {...field}
                                        value={field.value || ''}
                                        searchPlaceholder="Buscar ciudad"
                                        selectPlaceholder="Seleccione una ciudad"
                                        items={cities.map((city) => {
                                            return {
                                                value: city.id,
                                                label: `${city.name}, ${city.province.name}`,
                                            };
                                        })}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="businesses"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Empresas</FormLabel>
                                <FormControl>
                                    <FancyMultiSelect
                                        {...field}
                                        value={field.value || []}
                                        placeholder="Seleccione empresas"
                                        options={businesses.map((business) => {
                                            return {
                                                value: business.id,
                                                label: business.name,
                                            };
                                        })}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-row justify-end gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() =>
                                router.push(routesBuilder.branches.list(client.id))
                            }
                        >
                            Cancelar
                        </Button>
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </Form>
        </main>
    );
}
