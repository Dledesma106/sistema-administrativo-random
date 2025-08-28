import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Combobox from '@/components/Combobox';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ColumnBillingProfile } from '@/modules/tables/BillingProfilesTable/columns';

type Props = {
    billingProfiles: ColumnBillingProfile[];
};

export const ClientSection = ({ billingProfiles }: Props) => {
    const form = useFormContext();

    // Efecto para actualizar los campos cuando cambia el perfil
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'billingProfileId') {
                const selectedProfile = billingProfiles.find(
                    (profile) => profile.id === value.billingProfileId,
                );
                if (selectedProfile) {
                    form.setValue('legalName', selectedProfile.legalName);
                    form.setValue('cuit', selectedProfile.CUIT);
                    form.setValue('businessAddress', selectedProfile.comercialAddress);
                    form.setValue('ivaCondition', selectedProfile.IVACondition);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [form, billingProfiles]);

    return (
        <section className="space-y-4 rounded-lg border border-accent p-4">
            <h3 className="text-lg font-semibold">Datos del Cliente</h3>

            <FormField
                control={form.control}
                name="billingProfileId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Perfil de facturación</FormLabel>
                        <FormControl>
                            <Combobox
                                items={billingProfiles.map((profile) => ({
                                    label: profile.legalName,
                                    value: profile.id,
                                }))}
                                value={field.value}
                                onChange={field.onChange}
                                selectPlaceholder="Seleccione un perfil"
                                searchPlaceholder="Buscar perfil"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="legalName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Razón Social</FormLabel>
                            <FormControl>
                                <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="cuit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>CUIT</FormLabel>
                            <FormControl>
                                <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="businessAddress"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel>Domicilio Comercial</FormLabel>
                            <FormControl>
                                <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ivaCondition"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Condición IVA</FormLabel>
                            <FormControl>
                                <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </section>
    );
};
