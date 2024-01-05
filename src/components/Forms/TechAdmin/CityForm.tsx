import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';

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
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { type IProvince } from 'backend/models/interfaces';

export interface ICityForm {
    _id: string;
    name: string;
    province: string;
}

export interface ICityFormErrors {
    name: string;
    province: string;
}

interface Props {
    cityForm: ICityForm;
    newCity?: boolean;
    provinces: IProvince[];
}

export default function CityForm({
    cityForm,
    newCity = true,
    provinces,
}: Props): JSX.Element {
    const router = useRouter();
    const { stopLoading, startLoading } = useLoading();
    const form = useForm<ICityForm>({ defaultValues: cityForm });
    const { triggerAlert } = useAlert();

    const mutation = useMutation({
        mutationFn: async (form: ICityForm) => {
            if (newCity) {
                await fetcher.post(form, api.techAdmin.cities);
            } else {
                await fetcher.put(form, api.techAdmin.cities);
            }
        },
        onSuccess: () => {
            router.push('/tech-admin/cities');
            triggerAlert({
                type: 'Success',
                message: `Se ${newCity ? 'creó' : 'actualizó'} la ciudad correctamente`,
            });
            stopLoading();
        },
        onError: () => {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo ${newCity ? 'crear' : 'actualizar'} la ciudad`,
            }),
                stopLoading();
        },
    });

    const onSubmit: SubmitHandler<ICityForm> = (data) => {
        startLoading();
        mutation.mutate(data);
    };

    return (
        <main>
            <TypographyH1 className="mb-8">
                {newCity ? 'Agregar Ciudad' : 'Editar Ciudad'}
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
                        name="province"
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
                                                value: province._id.toString(),
                                                label: `${province.name}`,
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
                            <Link href={'/tech-admin/cities'}>Cancelar</Link>
                        </Button>
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </Form>
        </main>
    );
}
