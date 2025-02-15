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
import { useCreateBusiness } from '@/hooks/api/business/useCreateBusiness';
import { useUpdateBusiness } from '@/hooks/api/business/useUpdateBusiness';

export interface IBusinessForm {
    id: string;
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
    const form = useForm<IBusinessForm>({ defaultValues: businessForm });
    const { triggerAlert } = useAlert();

    const createBusiness = useCreateBusiness();
    const updateBusiness = useUpdateBusiness();

    const onSubmit: SubmitHandler<IBusinessForm> = async (data) => {
        try {
            if (newBusiness) {
                await createBusiness.mutateAsync({
                    data: { name: data.name },
                });
                triggerAlert({
                    type: 'Success',
                    message: 'Se creó la empresa correctamente',
                });
            } else {
                await updateBusiness.mutateAsync({
                    id: data.id,
                    data: { name: data.name },
                });
                triggerAlert({
                    type: 'Success',
                    message: 'Se actualizó la empresa correctamente',
                });
            }
            router.push('/tech-admin/businesses');
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo ${newBusiness ? 'crear' : 'actualizar'} la empresa`,
            });
        }
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
                        render={({ field }) => (
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
                        )}
                        control={form.control}
                        rules={{ required: 'Este campo es requerido' }}
                    />

                    <div className="flex flex-row justify-end gap-4">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/tech-admin/businesses">Cancelar</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                createBusiness.isPending || updateBusiness.isPending
                            }
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </Form>
        </main>
    );
}
