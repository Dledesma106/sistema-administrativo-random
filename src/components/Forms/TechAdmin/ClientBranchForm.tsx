import { useRouter } from 'next/navigation';

import { Label, Select, TextInput } from 'flowbite-react';
import { type ChangeEvent, useEffect, useState } from 'react';
import { BsFillXCircleFill } from 'react-icons/bs';

import { Button } from '@/components/ui/button';
import useAlert from '@/hooks/useAlert';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { CityWithProvince } from '@/types';
import {
    type IProvince,
    type IBusiness,
    type ICity,
    type IClient,
} from 'backend/models/interfaces';

export interface IClientBranchForm {
    _id: string;
    number: string;
    client: IClient;
    city: ICity;
    businesses: IBusiness[];
}

export interface IClientBranchFormErrors {
    number: string;
    city: string;
    businesses: string;
}

interface Props {
    branchForm: IClientBranchForm;
    newBranch?: boolean;
    cities: CityWithProvince[];
    businesses: IBusiness[];
}

export default function ClientBranchForm({
    branchForm,
    newBranch = true,
    cities,
    businesses,
}: Props): JSX.Element {
    const router = useRouter();
    const { stopLoading, startLoading } = useLoading();
    const [form, setForm] = useState<IClientBranchForm>({
        _id: branchForm._id,
        number: branchForm.number,
        client: branchForm.client,
        city: branchForm.city,
        businesses: branchForm.businesses,
    });
    const [errors, setErrors] = useState<IClientBranchFormErrors>(
        {} as IClientBranchFormErrors,
    );
    const [submitted, setSubmitted] = useState<boolean>(false);
    const { triggerAlert } = useAlert();
    const postData = async (form: IClientBranchForm): Promise<void> => {
        try {
            startLoading();
            await fetcher.post(form, api.techAdmin.branches);
            await router.push(`/tech-admin/clients/${form.client.name}/branches`);
            triggerAlert({
                type: 'Success',
                message: `La sucursal de numero ${form.number} para el cliente ${form.client.name} fue creada correctamente`,
            });
            stopLoading();
        } catch (error) {
            stopLoading();
            triggerAlert({
                type: 'Failure',
                message: `No se pudo crear la sucursal ${form.number} para el cliente ${form.client.name}`,
            });
        }
    };

    const putData = async (form: IClientBranchForm): Promise<void> => {
        try {
            startLoading();
            await fetcher.put(form, api.techAdmin.branches);
            await router.push(`/tech-admin/clients/${form.client.name}/branches`);
            triggerAlert({
                type: 'Success',
                message: `La sucursal de numero ${form.number} del cliente ${form.client.name} fue actualizada correctamente`,
            });
            stopLoading();
        } catch (error) {
            stopLoading();
            triggerAlert({
                type: 'Failure',
                message: `No se pudo actualizar la sucursal ${form.number} del cliente ${form.client.name}`,
            });
            // alert('No se pudo actualizar la sucursal')
        }
    };

    function selectCity(e: ChangeEvent<HTMLSelectElement>): void {
        const { value } = e.target;
        const cityName = value.slice(0, value.indexOf(','));
        const city = cities.find((city) => city.name === cityName);
        if (city !== null) {
            setForm({
                ...form,
                city,
            });
        }
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>): void {
        const { value } = e.target;
        setForm({
            ...form,
            number: value,
        });
    }

    useEffect(() => {
        if (submitted) {
            formValidate();
        }
    }, [form]);

    const formValidate = (): IClientBranchFormErrors => {
        const err: IClientBranchFormErrors = {
            number: '',
            city: '',
            businesses: '',
        };
        if (form.number === '') {
            err.number = 'Se debe proporcionar un numero';
        }
        if (Object.keys(form.city).length < 1) {
            err.city = 'Se debe especificar la ciudad';
        }
        if (form.businesses.length < 1) {
            err.businesses = 'Se debe seleccionar al menos una empresa';
        }
        setErrors(err);
        return err;
    };

    const handleSubmit = (): void => {
        setSubmitted(true);
        const errors = formValidate();
        if (errors.number === '' && errors.city === '') {
            if (newBranch) {
                void postData(form);
            } else {
                void putData(form);
            }
        }
    };

    const addBusiness = (e: ChangeEvent<HTMLSelectElement>): void => {
        const { value } = e.target;
        const business = businesses.find((business) => business.name === value);
        if (business !== undefined) {
            setForm((prev) => {
                return {
                    ...prev,
                    businesses: !prev.businesses.some((x) => x._id === business._id)
                        ? [...prev.businesses, business]
                        : prev.businesses,
                };
            });
        }
    };

    const deleteBranchBusiness = (id: string): void => {
        setForm((prev) => {
            return {
                ...prev,
                businesses: prev.businesses.filter((business) => business._id !== id),
            };
        });
    };

    async function goBack(): Promise<void> {
        startLoading();
        await router.push(`/tech-admin/clients/${form.client.name}/branches`);
        stopLoading();
    }

    const handleNavigate = (): void => {
        void goBack();
    };

    return (
        <>
            <form
                className="mx-auto my-4 flex w-1/2 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4"
                onSubmit={handleSubmit}
            >
                <h2 className="text-lg">
                    {`${branchForm.client.name} : ${
                        newBranch
                            ? 'Agregar una sucursal'
                            : `Editar la sucursal  ${branchForm.number}`
                    }`}
                </h2>
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="number"
                            value="Numero de la sucursal"
                            className="text-lg"
                        />
                    </div>
                    <TextInput
                        id="number"
                        type="number"
                        sizing="md"
                        placeholder={branchForm.number.toString()}
                        onChange={handleChange}
                        value={form.number}
                        disabled={!newBranch}
                        color={errors.number !== undefined ? 'failure' : ''}
                    />
                    <div className="mb-2 block">
                        <Label
                            htmlFor="number error"
                            value={errors.number}
                            className="text-lg"
                            color="failure"
                        />
                    </div>
                </div>
                <div id="select-city">
                    <div className="mb-2 block">
                        <Label
                            htmlFor="city"
                            value="Elegi la ciudad"
                            className="text-lg"
                        />
                    </div>
                    <Select
                        id="citys"
                        required={true}
                        onChange={selectCity}
                        name="city"
                        defaultValue="default"
                        disabled={!newBranch}
                        color={errors.city !== undefined ? 'failure' : ''}
                    >
                        <option value="default" disabled hidden>
                            {newBranch
                                ? 'Seleccione una localidad...'
                                : `${form.city.name}, ${
                                      (form.city.province as IProvince).name
                                  }`}
                        </option>
                        {cities.map((city, index) => (
                            <option key={index}>{`${city.name}, ${
                                (city.province as IProvince).name
                            } `}</option>
                        ))}
                    </Select>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="city error"
                            value={errors.city}
                            className="text-lg"
                            color="failure"
                        />
                    </div>
                </div>
                <Label value="Empresas contratadas" className="text-lg" />
                <div>
                    <Select
                        id="branchBusinesses"
                        onChange={addBusiness}
                        value="default"
                        className="col-span-5"
                        color={errors.businesses !== undefined ? 'failure' : ''}
                    >
                        <option value="default" disabled hidden>
                            Seleccione las empresas a agregar
                        </option>
                        {businesses.map((business, index) => (
                            <option key={index} value={business.name}>
                                {business.name}
                            </option>
                        ))}
                    </Select>
                    <ul className="mt-4">
                        {form.businesses.map((business, index) => {
                            return (
                                <li
                                    className="mb-2 mr-1 inline-block rounded-full bg-gray-300 px-3 py-2"
                                    key={index}
                                >
                                    <div className="flex items-center justify-between gap-2 font-semibold">
                                        {business.name}
                                        <button
                                            className="rounded-full bg-white "
                                            onClick={() =>
                                                deleteBranchBusiness(
                                                    business._id as string,
                                                )
                                            }
                                            type="button"
                                        >
                                            <BsFillXCircleFill color="gray" size={20} />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="business error"
                            value={errors.businesses}
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
