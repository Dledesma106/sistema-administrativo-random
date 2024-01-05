import { useRouter } from 'next/router';

import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { fetchClient } from '@/api/fetch-client';
import { LoginDocument, LoginMutation, LoginMutationVariables } from '@/api/graphql';
import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useAlert from '@/context/alertContext/useAlert';
import { useUserContext } from '@/context/userContext/UserProvider';
import { getCleanErrorMessage } from '@/lib/utils';

type FormValues = {
    email: string;
    password: string;
};

export function UserAuthForm() {
    const form = useForm<FormValues>();
    const router = useRouter();
    const { isLoggedIn, loginUser } = useUserContext();
    const { triggerAlert } = useAlert();

    const searchParams = router.query;

    useEffect(() => {
        const next = searchParams?.next;
        if (!isLoggedIn) {
            return;
        }

        if (typeof next === 'undefined') {
            router.replace('/');
        }

        if (typeof next === 'string') {
            router.replace(next);
        }
    }, [searchParams, isLoggedIn, router]);

    const loginMutation = useMutation<LoginMutation, Error, LoginMutationVariables>({
        mutationFn: (form: FormValues) => {
            return fetchClient(LoginDocument, {
                email: form.email,
                password: form.password,
            });
        },
        onSuccess: (data) => {
            if (!data) {
                return;
            }

            if (data.login.message) {
                throw new Error(data.login.message);
            }

            if (!data.login.user) {
                throw new Error('No se pudo iniciar sesión');
            }

            loginUser(data.login.user);
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: getCleanErrorMessage(error),
            });
        },
    });

    return (
        <div>
            <Form {...form}>
                <form
                    className="space-y-2"
                    onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))}
                >
                    <FormField
                        control={form.control}
                        name="email"
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel htmlFor="email">Email</FormLabel>

                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="email"
                                            placeholder="bruce@wayne.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={loginMutation.isPending}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel htmlFor="password">Contraseña</FormLabel>

                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="password"
                                            placeholder="********"
                                            type="password"
                                            autoComplete="current-password"
                                            disabled={loginMutation.isPending}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <div className="pt-4">
                        <ButtonWithSpinner
                            className="block w-full"
                            type="submit"
                            showSpinner={loginMutation.isPending}
                        >
                            Continuar
                        </ButtonWithSpinner>
                    </div>
                </form>
            </Form>
        </div>
    );
}
