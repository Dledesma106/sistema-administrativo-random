import { useRouter } from 'next/router';

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
import { useChangePassword } from '@/hooks/api/auth/useChangePassword';

interface IEditProfileForm {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export default function EditProfileForm() {
    const formMethods = useForm<IEditProfileForm>();
    const { triggerAlert } = useAlert();
    const router = useRouter();
    const changePasswordMutation = useChangePassword();

    const onSubmit: SubmitHandler<IEditProfileForm> = async (data) => {
        try {
            const result = await changePasswordMutation.mutateAsync({
                data: {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                },
            });

            if (result.changePassword.success) {
                triggerAlert({
                    type: 'Success',
                    message: 'Su contraseña fue actualizada correctamente',
                });
                router.push('/');
            } else {
                if (result.changePassword.message?.includes('actual incorrecta')) {
                    formMethods.setError('currentPassword', {
                        type: 'custom',
                        message: 'Contraseña incorrecta',
                    });
                } else {
                    triggerAlert({
                        type: 'Failure',
                        message:
                            result.changePassword.message ||
                            'Error al actualizar contraseña',
                    });
                }
            }
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: 'Error al actualizar contraseña',
            });
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
                    rules={{ required: 'Este campo es requerido' }}
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
                    rules={{ required: 'Este campo es requerido' }}
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
                        required: 'Este campo es requerido',
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
                    <Button type="submit" disabled={changePasswordMutation.isPending}>
                        Guardar
                    </Button>
                </div>
            </form>
        </Form>
    );
}
