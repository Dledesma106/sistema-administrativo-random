import { useRouter } from 'next/router';

import RSA from 'node-rsa';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';

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
import { useUserContext } from '@/context/userContext/UserProvider';
import useAlert from '@/hooks/useAlert';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';

interface IEditProfileForm {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export default function EditProfileForm() {
    const formMethods = useForm<IEditProfileForm>();
    const { user } = useUserContext();
    const { triggerAlert } = useAlert();
    const { stopLoading, startLoading } = useLoading();
    const router = useRouter();

    const checkPasswordMutation = useMutation<unknown, unknown, IEditProfileForm>(
        (passwordData) => {
            return fetch(api.checkPassword, {
                method: 'POST',
                body: JSON.stringify({
                    currentPassword: encryptPassword(passwordData.currentPassword),
                }),
                headers: { 'Content-Type': 'application/json' },
            });
        },
        {
            onSuccess: () => {
                triggerAlert({
                    type: 'Success',
                    message: 'Contraseña verificada correctamente',
                });
            },
            onError: () => {
                triggerAlert({ type: 'Failure', message: 'Contraseña incorrecta' });
            },
        },
    );

    const changePasswordMutation = useMutation<unknown, unknown, IEditProfileForm>(
        (passwordData) => {
            return fetch(api.changePassword, {
                method: 'POST',
                body: JSON.stringify({
                    newPassword: encryptPassword(passwordData.newPassword),
                }),
                headers: { 'Content-Type': 'application/json' },
            });
        },
        {
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
        },
    );

    const encryptPassword = (password: string): string => {
        const key = new RSA();
        key.importKey(user.publicKey, 'public');
        return key.encrypt(password, 'base64');
    };

    const onSubmit: SubmitHandler<IEditProfileForm> = async (data) => {
        if (data.newPassword !== data.confirmNewPassword) {
            triggerAlert({ type: 'Failure', message: 'Las contraseñas no coinciden' });
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
            <TypographyH1>Ajustes</TypographyH1>

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
