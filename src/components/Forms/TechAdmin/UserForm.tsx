import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import DataTableComboboxFilter from '@/components/DataTableComboboxFilter';
import { FancyMultiSelect } from '@/components/MultiSelect';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
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
import { type IProvince, type ICity } from 'backend/models/interfaces';
import { roles, type Role } from 'backend/models/types';

interface Props {
    cities: ICity[];
    newUser?: boolean;
    userForm?: UserFormValues;
}

export type UserFormValues = {
    _id: string;
    firstName: string;
    lastName: string;
    city: string;
    roles: {
        value: Role;
        label: Role;
    }[];
    email: string;
    password: string;
};

type PostOrPutUserMutationVariables = {
    firstName: string;
    lastName: string;
    city: string;
    roles: Role[];
    email: string;
    password: string;
};

export default function UserForm({
    userForm,
    newUser = true,
    cities,
}: Props): JSX.Element {
    const router = useRouter();
    const form = useForm<UserFormValues>({
        defaultValues: userForm || {},
    });
    const { stopLoading, startLoading } = useLoading();
    const { triggerAlert } = useAlert();

    const postUserMutation = useMutation({
        mutationFn: (form: PostOrPutUserMutationVariables) =>
            fetcher.post(form, api.techAdmin.users),
        onSuccess: (data, variables) => {
            startLoading();
            triggerAlert({
                type: 'Success',
                message: `El usuario ${variables.firstName} ${variables.lastName} fue creado correctamente`,
            });
            router.push('/tech-admin/users');
            stopLoading();
        },
        onError: (error, variables) => {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo crear el usuario ${variables.firstName} ${variables.lastName}`,
            });
        },
    });

    const putUserMutation = useMutation({
        mutationFn: (form: PostOrPutUserMutationVariables) =>
            fetcher.put(form, api.techAdmin.users),
        onSuccess: (data, variables) => {
            startLoading();
            triggerAlert({
                type: 'Success',
                message: `El usuario ${variables.firstName} ${variables.lastName} fue actualizado correctamente`,
            });
            router.push('/tech-admin/users');
            stopLoading();
        },
        onError: (error, variables) => {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo actualizar el usuario ${variables.firstName} ${variables.lastName}`,
            });
        },
    });

    const onSubmit: SubmitHandler<UserFormValues> = (data) => {
        const form: PostOrPutUserMutationVariables = {
            ...data,
            roles: data.roles?.map((role) => role.value) || [],
        };
        if (newUser) {
            postUserMutation.mutate(form);
        } else {
            putUserMutation.mutate(form);
        }
    };

    return (
        <main className="pr-8">
            <TypographyH1 className="mb-8">
                {newUser ? 'Crear usuario' : 'Editar usuario'}
            </TypographyH1>

            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="firstName"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                            minLength: {
                                value: 2,
                                message: 'El nombre debe tener al menos 2 caracteres',
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input placeholder="Bruce" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="lastName"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                            minLength: {
                                value: 2,
                                message: 'El apellido debe tener al menos 2 caracteres',
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apellido</FormLabel>
                                <FormControl>
                                    <Input placeholder="Wayne" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="email"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="ejemplo@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {newUser && (
                        <FormField
                            name="password"
                            control={form.control}
                            rules={{
                                required: 'Este campo es requerido',
                                minLength: {
                                    value: 8,
                                    message:
                                        'La contraseña debe tener al menos 8 caracteres',
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="********"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Al menos 8 caracteres
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        name="city"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ciudad</FormLabel>
                                <FormControl>
                                    <DataTableComboboxFilter
                                        searchPlaceholder="Buscar ciudad"
                                        selectPlaceholder="Seleccione una ciudad"
                                        items={cities.map((city) => {
                                            return {
                                                value: city._id.toString(),
                                                label: `${city.name}, ${
                                                    (city.province as IProvince).name
                                                }`,
                                            };
                                        })}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="roles"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Roles</FormLabel>
                                <FormControl>
                                    <FancyMultiSelect
                                        placeholder="Añade roles"
                                        options={roles.map((role) => {
                                            return {
                                                value: role,
                                                label: role,
                                            };
                                        })}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between space-x-8">
                        <Button asChild type="button" variant="secondary">
                            <Link href="/tech-admin/users">Cancelar</Link>
                        </Button>

                        <ButtonWithSpinner
                            showSpinner={
                                postUserMutation.isLoading || putUserMutation.isLoading
                            }
                        >
                            Guardar
                        </ButtonWithSpinner>
                    </div>
                </form>
            </Form>
        </main>
    );
}
