import { useRouter } from 'next/navigation';

import { Label, TextInput } from 'flowbite-react';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import useAlert from '@/hooks/useAlert';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
export interface IProvinceForm {
    _id: string;
    name: string;
}

export interface IProvinceFormErrors {
    name: string;
}

interface Props {
    provinceForm: IProvinceForm;
    newProvince?: boolean;
}

export default function ProvinceForm({
    provinceForm,
    newProvince = true,
}: Props): JSX.Element {
    const router = useRouter();
    const [form, setForm] = useState<IProvinceForm>({
        _id: provinceForm._id,
        name: provinceForm.name,
    });
    const [errors, setErrors] = useState<IProvinceFormErrors>({} as IProvinceFormErrors);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const { stopLoading, startLoading } = useLoading();
    const { triggerAlert } = useAlert();
    const postData = async (form: IProvinceForm): Promise<void> => {
        try {
            startLoading();
            await fetcher.post(form, api.techAdmin.provinces);
            await router.push('/tech-admin/provinces');
            stopLoading();
            triggerAlert({
                type: 'Success',
                message: `La provincia ${form.name} fue creada correctamente`,
            });
        } catch (error) {
            stopLoading();
            triggerAlert({
                type: 'Failure',
                message: `No se pudo crear la provincia ${form.name}`,
            });
        }
    };

    const putData = async (form: IProvinceForm): Promise<void> => {
        try {
            startLoading();
            await fetcher.put(form, api.techAdmin.provinces);
            await router.push('/tech-admin/provinces');
            stopLoading();
            triggerAlert({
                type: 'Success',
                message: `La provincia ${form.name} fue actualizada correctamente`,
            });
        } catch (error) {
            stopLoading();
            triggerAlert({
                type: 'Failure',
                message: `No se pudo actualizar la provincia ${form.name}`,
            });
        }
    };

    function handleChange(e: ChangeEvent<HTMLInputElement>): void {
        const { value } = e.target;
        setForm({ ...provinceForm, name: value });
    }

    useEffect(() => {
        if (submitted) {
            formValidate();
        }
    }, [form]);

    const formValidate = (): IProvinceFormErrors => {
        const err: IProvinceFormErrors = {
            name: '',
        };

        if (form.name === '') {
            err.name = 'Se debe especificar un nombre';
        }
        setErrors(err);
        return err;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setSubmitted(true);

        const errors = formValidate();

        if (errors.name === '') {
            if (newProvince) {
                void postData(form);
            } else {
                void putData(form);
            }
        } else {
            setErrors(errors);
        }
    };

    async function goBack(): Promise<void> {
        startLoading();
        await router.push('/tech-admin/provinces');
        stopLoading();
    }

    const handleNavigate = (): void => {
        void goBack();
    };

    return (
        <>
            <form
                className="mx-auto flex w-1/2 flex-col gap-4 rounded-3xl bg-gray-50 p-4"
                onSubmit={handleSubmit}
            >
                <h2 className="text-lg">
                    {newProvince ? 'Agregar Provincia' : 'Editar Provincia'}
                </h2>
                <hr className="mb-2" />
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="name"
                            value="Nombre de la provincia"
                            className="text-lg"
                        />
                    </div>
                    <TextInput
                        id="name"
                        type="text"
                        sizing="md"
                        placeholder={provinceForm.name}
                        onChange={handleChange}
                        color={errors.name !== undefined ? 'failure' : ''}
                    />
                    <div className="mb-2 block">
                        <Label
                            htmlFor="name error"
                            value={errors.name}
                            className="text-lg"
                            color="failure"
                        />
                    </div>
                </div>
                <div className="flex flex-row justify-between">
                    <Button variant="secondary" onClick={handleNavigate} type="button">
                        Cancelar
                    </Button>
                    <Button type="submit">Guardar</Button>
                </div>
            </form>
        </>
    );
}
