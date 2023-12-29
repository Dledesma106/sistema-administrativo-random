import { useRouter } from 'next/navigation';

import { Label, Select, TextInput } from 'flowbite-react';
import { type ChangeEvent, useEffect, useState } from 'react';
import { BsFillXCircleFill } from 'react-icons/bs';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import useAlert from '@/hooks/useAlert';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { CityWithProvince } from '@/types';
import {
    type IProvince,
    type IBusiness,
    type ICity,
    type IClient,
} from 'backend/models/interfaces';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { TypographyH1 } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import DataTableComboboxFilter from '@/components/DataTableComboboxFilter';
import Link from 'next/link';

export interface IClientBranchForm {
    _id: string;
    number: string;
    client: IClient;
    city: string;
    businesses: string[];
}

export interface IClientBranchFormErrors {
    number: string;
    city: string;
    businesses: string;
}

interface Props {
    branchForm: IClientBranchForm;
    newBranch?: boolean;
    cities: CityWithProvince[];
    businesses: IBusiness[];
}

export default function ClientBranchForm({
    branchForm,
    newBranch = true,
    cities,
    businesses,
}: Props): JSX.Element {
    const router = useRouter();
    const { stopLoading, startLoading } = useLoading();
    const form = useForm<IClientBranchForm>({ defaultValues: branchForm });
    const { triggerAlert } = useAlert();

    const mutation = useMutation({
        mutationFn: async (form: IClientBranchForm) => {
            if (newBranch) {
                await fetcher.post(form, api.techAdmin.branches);
            } else {
                await fetcher.put(form, api.techAdmin.branches);
            }
        },
        onSuccess: () => {
            router.push('/tech-admin/cities');
            triggerAlert({
                type: 'Success',
                message: `Se ${newBranch ? 'creó' : 'actualizó'} la ciudad correctamente`,
            });
            stopLoading();
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo ${newBranch ? 'crear' : 'actualizar'} la ciudad`,
            }),
                stopLoading();
        },
    });

    const onSubmit: SubmitHandler<IClientBranchForm> = (data) => {
        startLoading();
        mutation.mutate(data);
    };

    return (
        <main>
            <TypographyH1 className="mb-8">
                {newBranch ? 'Agregar Sucursal' : 'Editar Sucursal'}
            </TypographyH1>
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="number"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Sucursal</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Numero de Sucursal"
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
                        name="city"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ciudad</FormLabel>
                                <FormControl>
                                    <DataTableComboboxFilter
                                        searchPlaceholder="Buscar ciudad"
                                        selectPlaceholder="Seleccione una ciudad"
                                        items={cities.map((city) => {
                                            return {
                                                value: city._id.toString(),
                                                label: `${city.name}, ${city.province.name}`,
                                            };
                                        })}
                                        {...field}
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
                                    <DataTableComboboxFilter
                                        searchPlaceholder="Buscar Empresa"
                                        selectPlaceholder="Empresas contratadas"
                                        items={businesses.map((business) => {
                                            return {
                                                value: business._id.toString(),
                                                label: `${business.name},`,
                                            };
                                        })}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-row justify-between">
                        <Button variant="secondary" type="button">
                            <Link href={'/tech-admin/clients/Patagonia/branches'}>
                                Cancelar
                            </Link>
                        </Button>
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </Form>
        </main>
    );
}
