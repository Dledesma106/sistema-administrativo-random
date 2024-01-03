import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { Select, Textarea } from 'flowbite-react';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsFillXCircleFill } from 'react-icons/bs';

import { UserFormValues } from './UserForm';

import { fetchClient } from '@/api/fetch-client';
import { CreateTaskDocument } from '@/api/graphql';
import Combobox from '@/components/Combobox';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { TypographyH1 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { EditPreventivePageProps } from '@/pages/tech-admin/preventives/[id]';
import {
    type IBranch,
    type IBusiness,
    type IClient,
    type IUser,
} from 'backend/models/interfaces';
import * as types from 'backend/models/types';

type FormValues = {
    client: string;
    branch: string | null;
    business: string | null;
    assignedIDs: {
        label: string;
        value: string;
    }[];
    frequency: string;
};

type Props = {
    defaultValues?: FormValues;
    preventiveIdToUpdate?: string;
} & EditPreventivePageProps;

const PreventiveForm = ({
    preventiveForm,
    preventiveIdToUpdate,
    newPreventive = true,
    businesses,
    branches,
    clients,
    defaultValues,
}: Props): JSX.Element => {
    const router = useRouter();
    const form = useForm<FormValues>({ defaultValues });
    const { triggerAlert } = useAlert();

    const postMutation = useMutation({
        mutationFn: async (form: UserFormValues) => {
            return fetchClient(CreatePreventiveDocument, {
                input: {
                    auditor: null,
                    branch: form.branch,
                    business: form.business,
                    description: form.description,
                    status: form.status,
                    frequency: form.frequency,
                },
            });
        },
        onSuccess: () => {
            triggerAlert({
                type: 'Success',
                message: `La tarea fue creada correctamente`,
            });
            router.push('/tech-admin/tasks');
        },
    });

    const putMutation = useMutation({
        mutationFn: async (form: FormValues) => {
            if (!taskIdToUpdate) {
                return;
            }

            return fetchClient(UpdateTaskDocument, {
                id: taskIdToUpdate,
                input: {
                    auditor: null,
                    branch: form.branch,
                    business: form.business,
                    description: form.description,
                    status: form.status,
                    taskType: form.taskType,
                    workOrderNumber: form.workOrderNumber,
                    assigned: form.assignedIDs.map((technician) => technician.value),
                },
            });
        },
        onSuccess: () => {
            triggerAlert({
                type: 'Success',
                message: `La tarea fue actualizada correctamente`,
            });
            router.push('/tech-admin/tasks');
        },
    });

    const onSubmit = (form: FormValues): void => {
        if (preventiveIdToUpdate) {
            putMutation.mutateAsync(form);
        } else {
            postMutation.mutateAsync(form);
        }
    };

    return (
        <main>
            <TypographyH1 className="mb-8">
                {newPreventive ? 'Agregar Empresa' : 'Editar Empresa'}
            </TypographyH1>
            <Form {...form}>
                <FormField
                    name="client"
                    rules={{
                        required: 'Este campo es requerido',
                    }}
                    control={form.control}
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                <FormControl>
                                    <Combobox
                                        selectPlaceholder="Seleccione un cliente"
                                        searchPlaceholder="Buscar cliente"
                                        value={field.value}
                                        onChange={field.onChange}
                                        items={clients.map((client) => ({
                                            label: client.name,
                                            value: client.id,
                                        }))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    name="branch"
                    control={form.control}
                    rules={{
                        required: 'Este campo es requerido',
                    }}
                    disabled={form.watch('client') === undefined}
                    render={({ field }) => {
                        return (
                            <FormItem
                                className={
                                    field.disabled ? 'pointer-events-none opacity-30' : ''
                                }
                            >
                                <FormLabel>Sucursal</FormLabel>
                                <FormControl>
                                    <Combobox
                                        selectPlaceholder="Seleccione una sucursal"
                                        searchPlaceholder="Buscar sucursal"
                                        value={field.value ?? ''}
                                        onChange={field.onChange}
                                        items={branches
                                            .filter(
                                                (branch) =>
                                                    branch.clientId ===
                                                    form.watch('client'),
                                            )
                                            .map((branch) => ({
                                                label: `${branch.number}, ${branch.city.name}`,
                                                value: branch.id,
                                            }))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    name="business"
                    control={form.control}
                    rules={{
                        required: 'Este campo es requerido',
                    }}
                    disabled={!!form.watch('branch')}
                    render={({ field }) => {
                        return (
                            <FormItem
                                className={
                                    field.disabled ? 'pointer-events-none opacity-30' : ''
                                }
                            >
                                <FormLabel>Empresa</FormLabel>
                                <FormControl></FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
            </Form>
        </main>
    );
};

export default PreventiveForm;
