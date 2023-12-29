import { useRouter } from 'next/navigation';

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
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { TypographyH1 } from '@/components/ui/typography';
import Link from 'next/link';
export interface IProvinceForm {
    _id: string;
    name: string;
}

export interface IProvinceFormErrors {
    name: string;
}

interface Props {
    provinceForm: IProvinceForm;
    newProvince?: boolean;
}

export default function ProvinceForm({
    provinceForm,
    newProvince = true,
}: Props): JSX.Element {
    const router = useRouter();
    const { stopLoading, startLoading } = useLoading();
    const form = useForm<IProvinceForm>({ defaultValues: provinceForm });
    const { triggerAlert } = useAlert();

    const mutation = useMutation({
        mutationFn: async (form: IProvinceForm) => {
            if (newProvince) {
                await fetcher.post(form, api.techAdmin.provinces);
            } else {
                await fetcher.put(form, api.techAdmin.provinces);
            }
        },
        onSuccess: () => {
            router.push('/tech-admin/provinces');
            triggerAlert({
                type: 'Success',
                message: `Se ${
                    newProvince ? 'creó' : 'actualizó'
                } la provincia correctamente`,
            });
            stopLoading();
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo ${
                    newProvince ? 'crear' : 'actualizar'
                } la provincia`,
            }),
                stopLoading();
        },
    });

    const onSubmit: SubmitHandler<IProvinceForm> = (data) => {
        startLoading();
        mutation.mutate(data);
    };

    return (
        <main>
            <TypographyH1 className="mb-8">
                {newProvince ? 'Agregar Provincia' : 'Editar Provincia'}
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
                                            placeholder="Nombre de la Provincia"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                        control={form.control}
                        rules={{ required: 'Este campo es requerido' }}
                    />

                    <div className="flex flex-row justify-between">
                        <Button variant="secondary" type="button">
                            <Link href={'/tech-admin/provinces'}>Cancelar</Link>
                        </Button>
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </Form>
        </main>
    );
}
