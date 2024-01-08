import { useRouter } from 'next/router';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
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
import useAlert from '@/context/alertContext/useAlert';
import * as api from '@/lib/apiEndpoints';
import { axiosInstance } from '@/lib/fetcher';

import { ButtonWithSpinner } from '../ButtonWithSpinner';

interface IEditProfileForm {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export default function EditProfileForm() {
    const formMethods = useForm<IEditProfileForm>();
    const { triggerAlert } = useAlert();
    const router = useRouter();

    const changePasswordMutation = useMutation<unknown, AxiosError, IEditProfileForm>({
        mutationFn: (passwordData) => {
            return axiosInstance.post(api.changePassword, {
                currentPassword: passwordData.currentPassword,
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
        onError: (error) => {
            if (error.response?.status === 403) {
                formMethods.setError('currentPassword', {
                    type: 'custom',
                    message: 'Contraseña incorrecta',
                });
            } else {
                triggerAlert({
                    type: 'Failure',
                    message: 'Error al actualizar contraseña',
                });
            }
        },
    });

    const onSubmit: SubmitHandler<IEditProfileForm> = async (data) => {
        changePasswordMutation.mutate(data);
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
                    rules={{ required: true }}
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
                    rules={{ required: true }}
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
                    rules={{
                        validate: (value) =>
                            value === formMethods.getValues('newPassword') ||
                            'Las contraseñas no coinciden',
                        required: true,
                    }}
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
                    <Button
                        type="button"
                        onClick={() => router.push('/')}
                        variant="secondary"
                    >
                        Cancelar
                    </Button>
                    <ButtonWithSpinner
                        showSpinner={changePasswordMutation.isPending}
                        type="submit"
                    >
                        Guardar
                    </ButtonWithSpinner>
                </div>
            </form>
        </Form>
    );
}
