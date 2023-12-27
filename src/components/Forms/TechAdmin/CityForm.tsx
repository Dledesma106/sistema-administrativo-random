import { useRouter } from 'next/navigation';

import { Label, Select, TextInput } from 'flowbite-react';
import { type ChangeEvent, type FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import useAlert from '@/hooks/useAlert';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { type IProvince } from 'backend/models/interfaces';

export interface ICityForm {
    _id: string;
    name: string;
    province: IProvince;
}

export interface ICityFormErrors {
    name: string;
    province: string;
}

interface Props {
    cityForm: ICityForm;
    newCity?: boolean;
    provinces: IProvince[];
}

export default function CityForm({
    cityForm,
    newCity = true,
    provinces,
}: Props): JSX.Element {
    const router = useRouter();
    const { stopLoading, startLoading } = useLoading();
    const [form, setForm] = useState<ICityForm>({
        _id: cityForm._id,
        name: cityForm.name,
        province: cityForm.province,
    });
    const [errors, setErrors] = useState<ICityFormErrors>({} as ICityFormErrors);
    const { triggerAlert } = useAlert();

    const postData = async (form: ICityForm): Promise<void> => {
        try {
            startLoading();
            await fetcher.post(form, api.techAdmin.cities);
            await router.push('/tech-admin/cities');
            triggerAlert({
                type: 'Success',
                message: `La localidad "${form.name}" fue creada correctamente`,
            });
            stopLoading();
        } catch (error) {
            stopLoading();
            triggerAlert({
                type: 'Failure',
                message: `No se pudo crear la localidad "${form.name}"`,
            });
        }
    };

    const putData = async (form: ICityForm): Promise<void> => {
        try {
            startLoading();
            await fetcher.put(form, api.techAdmin.cities);
            await router.push('/tech-admin/cities');
            triggerAlert({
                type: 'Success',
                message: `La localidad "${form.name}" fue actualizada correctamente`,
            });
            stopLoading();
        } catch (error) {
            stopLoading();
            triggerAlert({
                type: 'Failure',
                message: `No se pudo actualizar la localidad "${form.name}"`,
            });
        }
    };

    function selectProvince(e: ChangeEvent<HTMLSelectElement>): void {
        const { value } = e.target;
        const province = provinces.find((province) => province.name === value);
        if (province != null) {
            setForm({ ...form, province });
        }
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>): void {
        const { value } = e.target;
        setForm({ ...form, name: value });
    }

    async function goBack(): Promise<void> {
        startLoading();
        await router.push('/tech-admin/cities');
        stopLoading();
    }

    const formValidate = (): ICityFormErrors => {
        const err: ICityFormErrors = {
            name: '',
            province: '',
        };
        if (form.name === '') {
            err.name = 'Se debe especificar un nombre';
        }
        if (Object.keys(form.province).length < 1) {
            err.province = 'Se debe especificar la provincia';
        }

        return err;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const errors = formValidate();

        if (errors.name === '') {
            if (newCity) {
                void postData(form);
            } else {
                void putData(form);
            }
        } else {
            setErrors(errors);
        }
    };

    const handleNavigate = (): void => {
        void goBack();
    };

    return (
        <>
            <form
                className="mx-auto my-4 flex w-1/2 flex-col gap-4 rounded-3xl bg-gray-50 p-4"
                onSubmit={handleSubmit}
            >
                <h2 className="text-lg">
                    {newCity ? 'Agregar Localidad' : 'Editar Localidad'}
                </h2>
                <hr className="mb-2" />
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="name"
                            value="Nombre de la ciudad"
                            className="text-lg"
                        />
                    </div>
                    <TextInput
                        id="name"
                        type="text"
                        sizing="md"
                        placeholder={cityForm.name}
                        onChange={handleChange}
                        value={form.name}
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
                <div id="select-province">
                    <div className="mb-2 block">
                        <Label
                            htmlFor="province"
                            value="Elegi la provincia"
                            className="text-lg"
                        />
                    </div>
                    <Select
                        id="provinces"
                        required={true}
                        onChange={selectProvince}
                        name="province"
                        defaultValue="default"
                        color={errors.province !== undefined ? 'failure' : ''}
                    >
                        <option value="default" disabled hidden>
                            {newCity
                                ? 'Seleccione una provincia'
                                : cityForm.province.name}
                        </option>
                        {provinces.map((province, index) => (
                            <option key={index}>{province.name}</option>
                        ))}
                    </Select>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="province error"
                            value={errors.province}
                            className="text-lg"
                            color="failure"
                        />
                    </div>
                </div>
                <div className="flex flex-row justify-between">
                    <Button variant="secondary" onClick={handleNavigate} type="button">
                        {' '}
                        Cancelar{' '}
                    </Button>
                    <Button type="submit">Guardar</Button>
                </div>
            </form>
        </>
    );
}
