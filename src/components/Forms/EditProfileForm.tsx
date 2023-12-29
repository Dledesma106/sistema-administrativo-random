import { useRouter } from 'next/router';

import { useMutation } from '@tanstack/react-query';
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
import { TypographyH2 } from '@/components/ui/typography';
import useAlert from '@/hooks/useAlert';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';
import { axiosInstance } from '@/lib/fetcher';

interface IEditProfileForm {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export default function EditProfileForm() {
    const formMethods = useForm<IEditProfileForm>();
    const { triggerAlert } = useAlert();
    const { stopLoading, startLoading } = useLoading();
    const router = useRouter();

    const checkPasswordMutation = useMutation<unknown, unknown, IEditProfileForm>({
        mutationFn: (passwordData) => {
            return axiosInstance.post(api.checkPassword, {
                currentPassword: passwordData.currentPassword,
            });
        },
        onSuccess: () => {
            triggerAlert({
                type: 'Success',
                message: 'Contraseña verificada correctamente',
            });
        },
        onError: () => {
            triggerAlert({
                type: 'Failure',
                message: 'Contraseña incorrecta',
            });
        },
    });

    const changePasswordMutation = useMutation<unknown, unknown, IEditProfileForm>({
        mutationFn: (passwordData) => {
            return axiosInstance.post(api.changePassword, {
                newPassword: passwordData.newPassword,
            });
        },
        onSuccess: () => {
            triggerAlert({
                type: 'Success',
                message: 'Su contraseña fue actualizada correctamente',
            });
            router.push('/');
        },
        onError: () => {
            triggerAlert({
                type: 'Failure',
                message: 'Error al actualizar contraseña',
            });
        },
        onSettled: () => {
            stopLoading();
        },
    });

    const onSubmit: SubmitHandler<IEditProfileForm> = async (data) => {
        if (data.newPassword !== data.confirmNewPassword) {
            triggerAlert({
                type: 'Failure',
                message: 'Las contraseñas no coinciden',
            });
            return;
        }

        startLoading();
        await checkPasswordMutation.mutateAsync(data);

        if (checkPasswordMutation.isSuccess) {
            await changePasswordMutation.mutateAsync(data);
        }
    };

    return (
        <Form {...formMethods}>
            <TypographyH2 asChild className="mb-4">
                <h1>Ajustes</h1>
            </TypographyH2>

            <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={formMethods.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Introduzca su contraseña actual</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="********"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={formMethods.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nueva contraseña</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="********"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={formMethods.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirmar nueva contraseña</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="********"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between">
                    <Button onClick={() => router.push('/')} variant="secondary">
                        Cancelar
                    </Button>
                    <Button type="submit">Guardar</Button>
                </div>
            </form>
        </Form>
    );
}
