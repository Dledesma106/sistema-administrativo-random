import { useRouter } from 'next/navigation';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm, SubmitHandler } from 'react-hook-form'; 
import { Button } from '@/components/ui/button';
import useAlert from '@/hooks/useAlert';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { useMutation } from '@tanstack/react-query';
import { TypographyH1 } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export interface IClientForm {
    _id: string;
    name: string;
}

export interface IClientFormErrors {
    name: string;
}

interface Props {
    clientForm: IClientForm;
    newClient?: boolean;
}

export default function ClientForm({ clientForm, newClient = true }: Props): JSX.Element {
    const router = useRouter();
    const form = useForm<IClientForm>({ defaultValues: clientForm });
    const { stopLoading, startLoading } = useLoading();
    const { triggerAlert } = useAlert();

    const mutation = useMutation({
        mutationFn: async (form: IClientForm) => {
            if (newClient) {
                await fetcher.post(form, api.techAdmin.clients);
            } else {
                await fetcher.put(form, api.techAdmin.clients);
            }
        },
        onSuccess: () => {
            router.push('/tech-admin/clients');
            triggerAlert({
                type: 'Success',
                message: `Se ${
                    newClient ? 'creó' : 'actualizó'
                } el cliente correctamente`,
            });
            stopLoading();
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo ${newClient ? 'crear' : 'actualizar'} el cliente`,
            }),
                stopLoading();
        },
    });

    const onSubmit: SubmitHandler<IClientForm> = (data) => {
        startLoading();
        mutation.mutate(data);
    };

    return (
        <main>
            <TypographyH1 className="mb-8">
                {newClient ? 'Agregar Cliente' : 'Editar Cliente'}
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
                                            placeholder="Nombre del Cliente"
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
                            <Link href="/tech-admin/clients"> Cancelar</Link>
                        </Button>
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </Form>
        </main>
    );
}
