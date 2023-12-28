import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
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
import useAlert from '@/hooks/useAlert';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import Link from 'next/link';
import { TypographyH1 } from '@/components/ui/typography';
import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import { useMutation } from '@tanstack/react-query';

export interface IBusinessForm {
    _id: string;
    name: string;
}

export interface IBusinessFormErrors {
    name: string;
}

interface Props {
    businessForm: IBusinessForm;
    newBusiness?: boolean;
}

export default function BusinessForm({
    businessForm,
    newBusiness = true,
}: Props): JSX.Element {
    const router = useRouter();
    const { stopLoading, startLoading } = useLoading();
    const form = useForm<IBusinessForm>({ defaultValues: businessForm });
    const { triggerAlert } = useAlert();

    const mutation = useMutation({
        mutationFn: async (form: IBusinessForm) => {
            if (newBusiness) {
                await fetcher.post(form, api.techAdmin.businesses);
            } else {
                await fetcher.put(form, api.techAdmin.businesses);
            }
        },
        onSuccess: () => {
            router.push('/tech-admin/businesses');
            triggerAlert({
                type: 'Success',
                message: `Se ${
                    newBusiness ? 'creó' : 'actualizó'
                } la empresa correctamente`,
            });
            stopLoading();
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo ${newBusiness ? 'crear' : 'actualizar'} la empresa`,
            }),
                stopLoading();
        },
    });

    const onSubmit: SubmitHandler<IBusinessForm> = (data) => {
        startLoading();
        mutation.mutate(data);
    };

    return (
        <main>
            <TypographyH1 className="mb-8">
                {newBusiness ? 'Agregar Empresa' : 'Editar Empresa'}
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
                                            placeholder="Nombre de la Empresa"
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
                        <Button variant="secondary" type="button" asChild>
                            <Link href="/tech-admin/businesses">Cancelar</Link>
                        </Button>
                        <ButtonWithSpinner type="submit">Guardar</ButtonWithSpinner>
                    </div>
                </form>
            </Form>
        </main>
    );
}
