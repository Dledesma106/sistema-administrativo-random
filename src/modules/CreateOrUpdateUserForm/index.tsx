import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Role } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';

import { UserInput, GetCitiesQuery } from '@/api/graphql';
import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import Combobox from '@/components/Combobox';
import { FancyMultiSelect } from '@/components/MultiSelect';
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
import { useCreateUser } from '@/hooks/api/user/useCreateUser';
import { useUpdateUser } from '@/hooks/api/user/useUpdateUser';
import { routesBuilder } from '@/lib/routes';

export interface UserFormProps {
    cities: GetCitiesQuery['cities'];
    userIdToUpdate?: string;
    defaultValues?: UserFormValues;
}

export type UserFormValues = {
    firstName: string;
    lastName: string;
    city: string;
    roles: {
        value: Role;
        label: Role;
    }[];
    email: string;
};

export default function CreateOrUpdateUserForm({
    defaultValues,
    userIdToUpdate,
    cities,
}: UserFormProps): JSX.Element {
    const router = useRouter();
    const form = useForm<UserFormValues>({
        defaultValues: defaultValues,
    });
    const { triggerAlert } = useAlert();

    const postUserMutation = useCreateUser();
    const putUserMutation = useUpdateUser();

    const onSubmit: SubmitHandler<UserFormValues> = (data) => {
        const input: UserInput = {
            ...data,
            roles: data.roles?.map((role) => role.value) || [],
        };

        console.log(input);

        if (!userIdToUpdate) {
            postUserMutation.mutate(
                { input },
                {
                    onSuccess: (data, { input }) => {
                        if (!data) {
                            triggerAlert({
                                type: 'Failure',
                                message: `No se pudo crear el usuario ${input.email}`,
                            });
                            return;
                        }

                        const { user, success, message } = data.createUser;
                        if (!success && message) {
                            triggerAlert({
                                type: 'Failure',
                                message,
                            });
                            return;
                        }

                        if (!user) {
                            triggerAlert({
                                type: 'Failure',
                                message: `No se pudo crear el usuario ${input.email}`,
                            });
                            return;
                        }

                        triggerAlert({
                            type: 'Success',
                            message: `El usuario ${input.email} fue creado correctamente`,
                        });
                        router.push('/tech-admin/users');
                    },
                    onError: (error, { input }) => {
                        triggerAlert({
                            type: 'Failure',
                            message: `No se pudo crear el usuario ${input.email}`,
                        });
                    },
                },
            );
        } else {
            putUserMutation.mutate(
                {
                    id: userIdToUpdate,
                    input,
                },
                {
                    onSuccess: (data, { input }) => {
                        if (!data) {
                            triggerAlert({
                                type: 'Failure',
                                message: `No se pudo actualizar el usuario ${input.email}`,
                            });
                            return;
                        }

                        const { user, success, message } = data.updateUser;

                        if (!success && message) {
                            triggerAlert({
                                type: 'Failure',
                                message,
                            });
                            return;
                        }

                        if (!user) {
                            triggerAlert({
                                type: 'Failure',
                                message: `No se pudo actualizar el usuario ${input.email}`,
                            });
                            return;
                        }

                        triggerAlert({
                            type: 'Success',
                            message: `El usuario ${input.email} fue actualizado correctamente`,
                        });
                    },
                    onError: (error, { input }) => {
                        triggerAlert({
                            type: 'Failure',
                            message: `No se pudo actualizar el usuario ${input.email}`,
                        });
                    },
                },
            );
        }
    };

    return (
        <main className="rounded-md border border-accent bg-background-primary p-4">
            <TypographyH2 className="mb-4" asChild>
                <h1>{!userIdToUpdate ? 'Crear usuario' : 'Editar usuario'}</h1>
            </TypographyH2>

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
                                    <Combobox
                                        searchPlaceholder="Buscar ciudad"
                                        selectPlaceholder="Seleccione una ciudad"
                                        items={cities.map((city) => ({
                                            value: city.id,
                                            label: `${city.name}, ${city.province.name}`,
                                        }))}
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
                                        options={Object.entries(Role).map(
                                            ([key, value]) => ({
                                                label: key,
                                                value: value,
                                            }),
                                        )}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-row justify-end gap-4">
                        <Button variant="outline" type="button" asChild>
                            <Link href={routesBuilder.users.list()}>Cancelar</Link>
                        </Button>

                        <ButtonWithSpinner
                            showSpinner={
                                postUserMutation.isPending || putUserMutation.isPending
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
