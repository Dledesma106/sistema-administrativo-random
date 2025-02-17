import { useRouter } from 'next/navigation';

import { SubmitHandler, useForm } from 'react-hook-form';

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
import { useCreateProvince } from '@/hooks/api/province/useCreateProvince';
import { useUpdateProvince } from '@/hooks/api/province/useUpdateProvince';
import useLoading from '@/hooks/useLoading';
import { routesBuilder } from '@/lib/routes';

interface IProvinceForm {
    id: string;
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

    const createProvince = useCreateProvince();
    const updateProvince = useUpdateProvince();

    const onSubmit: SubmitHandler<IProvinceForm> = async (data) => {
        startLoading();
        try {
            if (newProvince) {
                const result = await createProvince.mutateAsync({
                    data: { name: data.name },
                });
                if (result.createProvince.success) {
                    router.push(routesBuilder.provinces.list());
                    triggerAlert({
                        type: 'Success',
                        message: 'Se creó la provincia correctamente',
                    });
                } else {
                    triggerAlert({
                        type: 'Failure',
                        message:
                            result.createProvince.message ||
                            'No se pudo crear la provincia',
                    });
                }
            } else {
                const result = await updateProvince.mutateAsync({
                    id: data.id,
                    data: { name: data.name },
                });
                if (result.updateProvince.success) {
                    router.push('/tech-admin/provinces');
                    triggerAlert({
                        type: 'Success',
                        message: 'Se actualizó la provincia correctamente',
                    });
                } else {
                    triggerAlert({
                        type: 'Failure',
                        message:
                            result.updateProvince.message ||
                            'No se pudo actualizar la provincia',
                    });
                }
            }
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo ${
                    newProvince ? 'crear' : 'actualizar'
                } la provincia`,
            });
        } finally {
            stopLoading();
        }
    };

    return (
        <main className="rounded-md border border-accent bg-background-primary p-4">
            <TypographyH1 className="mb-8">
                {newProvince ? 'Agregar Provincia' : 'Editar Provincia'}
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
                                        placeholder="Nombre de la Provincia"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        control={form.control}
                        rules={{ required: 'Este campo es requerido' }}
                    />

                    <div className="flex flex-row justify-end gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.push(routesBuilder.provinces.list())}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                createProvince.isPending || updateProvince.isPending
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
