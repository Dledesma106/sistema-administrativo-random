import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useForm, SubmitHandler } from 'react-hook-form';

import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
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
import useAlert from '@/hooks/useAlert';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';

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
    const form = useForm<IBusinessForm>({
        defaultValues: businessForm,
    });
    const { triggerAlert } = useAlert();

    const postData = async (form: IBusinessForm): Promise<void> => {
        try {
            startLoading();
            await fetcher.post(form, api.techAdmin.businesses);
            router.push('/tech-admin/businesses');
            triggerAlert({
                type: 'Success',
                message: `Se creo la empresa "${form.name}" correctamente`,
            });
            stopLoading();
        } catch (error) {
            stopLoading();
            triggerAlert({
                type: 'Failure',
                message: `No se pudo crear la empresa "${form.name}"`,
            });
        }
    };

    const putData = async (form: IBusinessForm): Promise<void> => {
        try {
            startLoading();
            await fetcher.put(form, api.techAdmin.businesses);
            router.push('/tech-admin/businesses');
            triggerAlert({
                type: 'Success',
                message: `Se actualizo la empresa "${form.name}" correctamente`,
            });
            stopLoading();
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo actualizar la empresa "${form.name}"`,
            });
            stopLoading();
        }
    };

    const onSubmit: SubmitHandler<IBusinessForm> = (data) => {
        if (newBusiness) {
            postData(data);
        } else {
            putData(data);
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
                        rules={{
                            required: 'Este campo es requerido',
                        }}
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
