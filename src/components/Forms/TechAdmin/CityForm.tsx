import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateCityDocument,
    CreateCityMutationVariables,
    UpdateCityDocument,
    UpdateCityMutationVariables,
    GetProvincesQuery,
} from '@/api/graphql';
import Combobox from '@/components/Combobox';
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

export interface CityFormValues {
    name: string;
    provinceId: string;
}

interface Props {
    cityForm?: CityFormValues;
    provinces: NonNullable<GetProvincesQuery['provinces']>;
    idToUpdate?: string;
}

export default function CityForm({
    cityForm,
    provinces,
    idToUpdate,
}: Props): JSX.Element {
    const router = useRouter();
    const { stopLoading, startLoading } = useLoading();
    const form = useForm<CityFormValues>({ defaultValues: cityForm });
    const { triggerAlert } = useAlert();

    const createMutation = useMutation({
        mutationFn: async (data: CreateCityMutationVariables) => {
            return fetchClient(CreateCityDocument, data);
        },
        onSuccess: () => {
            router.push('/tech-admin/cities');
            triggerAlert({
                type: 'Success',
                message: `Se creó la ciudad correctamente`,
            });
            stopLoading();
        },
        onError: () => {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo crear la ciudad`,
            }),
                stopLoading();
        },
    });
    const updateMutation = useMutation({
        mutationFn: async (data: UpdateCityMutationVariables) => {
            return fetchClient(UpdateCityDocument, data);
        },
        onSuccess: () => {
            router.push('/tech-admin/cities');
            triggerAlert({
                type: 'Success',
                message: `Se actualizó la ciudad correctamente`,
            });
            stopLoading();
        },
        onError: () => {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo actualizar la ciudad`,
            }),
                stopLoading();
        },
    });

    const onSubmit: SubmitHandler<CityFormValues> = (data) => {
        if (!data.provinceId || !data.name) {
            return;
        }

        startLoading();

        if (idToUpdate) {
            updateMutation.mutate({
                id: idToUpdate,
                input: {
                    name: data.name,
                    provinceId: data.provinceId,
                },
            });
            return;
        } else {
            createMutation.mutate({
                input: {
                    name: data.name,
                    provinceId: data.provinceId,
                },
            });
        }
    };

    return (
        <main className="rounded-md border border-accent bg-background-primary p-4">
            <TypographyH1 className="mb-8">
                {!idToUpdate ? 'Agregar Ciudad' : 'Editar Ciudad'}
            </TypographyH1>
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="name"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Nombre de la Ciudad"
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
                        name="provinceId"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Provincia:</FormLabel>
                                <FormControl>
                                    <Combobox
                                        searchPlaceholder="Buscar provincia"
                                        selectPlaceholder="Seleccione una provincia"
                                        items={provinces.map((province) => {
                                            return {
                                                value: province.id,
                                                label: province.name,
                                            };
                                        })}
                                        {...field}
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
                            onClick={() => router.push(routesBuilder.cities.list())}
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
