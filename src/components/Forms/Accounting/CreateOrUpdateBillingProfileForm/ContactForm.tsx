import { useForm } from 'react-hook-form';

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
import { Textarea } from '@/components/ui/textarea';

export type ContactFormValues = {
    id?: string;
    name: string;
    email: string;
    phone: string;
    notes: string;
};

interface ContactFormProps {
    defaultValues?: ContactFormValues;
    onSubmit: (data: ContactFormValues) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ContactForm = ({
    defaultValues,
    onSubmit,
    onCancel,
    isLoading = false,
}: ContactFormProps): JSX.Element => {
    const form = useForm<ContactFormValues>({
        defaultValues: defaultValues || {
            name: '',
            email: '',
            phone: '',
            notes: '',
        },
    });

    return (
        <Form {...form}>
            <form
                className="space-y-4 rounded-md border border-accent bg-background-primary p-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit(onSubmit)(e);
                }}
            >
                <FormField
                    name="name"
                    control={form.control}
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre y Apellido</FormLabel>
                            <FormControl>
                                <Input placeholder="Nombre y apellido" {...field} />
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
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email inválido',
                        },
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="phone"
                    control={form.control}
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Número de teléfono"
                                    type="tel"
                                    onKeyDown={(e) => {
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            e.key !== 'Backspace' &&
                                            e.key !== 'Delete' &&
                                            e.key !== 'ArrowLeft' &&
                                            e.key !== 'ArrowRight'
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="notes"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Observaciones</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Observaciones"
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-row justify-end gap-4">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onCancel();
                        }}
                    >
                        Cancelar
                    </Button>
                    <ButtonWithSpinner showSpinner={isLoading}>
                        {defaultValues?.id ? 'Actualizar' : 'Agregar'}
                    </ButtonWithSpinner>
                </div>
            </form>
        </Form>
    );
};
