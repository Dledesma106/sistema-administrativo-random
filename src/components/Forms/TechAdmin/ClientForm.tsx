import Link from 'next/link';
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
import { TypographyH1 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import { useCreateClient } from '@/hooks/api/client/useCreateClient';
import { useUpdateClient } from '@/hooks/api/client/useUpdateClient';

export interface IClientForm {
    id: string;
    name: string;
}

interface Props {
    clientForm: IClientForm;
    newClient?: boolean;
}

export default function ClientForm({ clientForm, newClient = true }: Props): JSX.Element {
    const router = useRouter();
    const form = useForm<IClientForm>({ defaultValues: clientForm });
    const { triggerAlert } = useAlert();

    const createClient = useCreateClient();
    const updateClient = useUpdateClient();

    const onSubmit: SubmitHandler<IClientForm> = async (data) => {
        try {
            if (newClient) {
                const result = await createClient.mutateAsync({
                    data: { name: data.name },
                });
                if (result.createClient.success) {
                    triggerAlert({
                        type: 'Success',
                        message: 'Se creó el cliente correctamente',
                    });
                    router.push('/tech-admin/clients');
                } else {
                    triggerAlert({
                        type: 'Failure',
                        message:
                            result.createClient.message || 'Error al crear el cliente',
                    });
                }
            } else {
                const result = await updateClient.mutateAsync({
                    id: data.id,
                    data: { name: data.name },
                });
                if (result.updateClient.success) {
                    triggerAlert({
                        type: 'Success',
                        message: 'Se actualizó el cliente correctamente',
                    });
                    router.push('/tech-admin/clients');
                } else {
                    triggerAlert({
                        type: 'Failure',
                        message:
                            result.updateClient.message ||
                            'Error al actualizar el cliente',
                    });
                }
            }
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo ${newClient ? 'crear' : 'actualizar'} el cliente`,
            });
        }
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
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Nombre del Cliente" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        control={form.control}
                        rules={{ required: 'Este campo es requerido' }}
                    />

                    <div className="flex flex-row justify-between">
                        <Button variant="secondary" type="button" asChild>
                            <Link href="/tech-admin/clients">Cancelar</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={createClient.isPending || updateClient.isPending}
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </Form>
        </main>
    );
}
