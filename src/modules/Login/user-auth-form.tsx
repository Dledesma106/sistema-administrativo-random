import { useRouter } from 'next/router';

import { useMutation } from '@tanstack/react-query';
import * as React from 'react';
import { useForm } from 'react-hook-form';

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
import { useUserContext } from '@/context/userContext/UserProvider';
import { authUrl } from '@/lib/apiEndpoints';
import { axiosInstance } from '@/lib/fetcher';

type FormValues = {
    email: string;
    password: string;
};

export function UserAuthForm() {
    const form = useForm<FormValues>();
    const router = useRouter();
    const { loginUser } = useUserContext();

    const loginMutation = useMutation({
        mutationFn: (form: FormValues) => {
            return axiosInstance.post(authUrl, form);
        },
        onSuccess: (data) => {
            loginUser(data.data.user);
            router.push('/');
        },
        onError: () => {
            alert('Email o contraseña incorrectos');
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
