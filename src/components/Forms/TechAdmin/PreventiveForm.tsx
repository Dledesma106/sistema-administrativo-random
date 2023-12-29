import { useRouter } from 'next/navigation';

import { Select, Textarea } from 'flowbite-react';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsFillXCircleFill } from 'react-icons/bs';

import { Button } from '@/components/ui/button';
import { Form, FormLabel } from '@/components/ui/form';
import useAlert from '@/hooks/useAlert';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import {
    type IBranch,
    type IBusiness,
    type IClient,
    type IUser,
} from 'backend/models/interfaces';
import * as types from 'backend/models/types';
import { TypographyH1 } from '@/components/ui/typography';

export interface IPreventiveForm {
    _id: string;
    branch: IBranch;
    business: IBusiness;
    assigned: IUser[];
    status: types.PreventiveStatus;
    frequency?: types.Frequency;
    months: types.Month[];
    lastDoneAt?: Date;
    batteryChangedAt?: Date;
    observations?: string;
}

export interface IPreventiveFormErrors {
    client: string;
    branch: string;
    business: string;
    assigned: string;
    frequency: string;
}

export interface Props {
    preventiveForm: IPreventiveForm;
    newPreventive?: boolean;
    branches: IBranch[];
    clients: IClient[];
    businesses: IBusiness[];
    technicians: IUser[];
}

const PreventiveForm = ({
    preventiveForm,
    newPreventive = true,
    businesses,
    branches,
    clients,
    technicians,
}: Props): JSX.Element => {
    const router = useRouter();
    const formMethods = useForm<IPreventiveForm>();
    const [errors, setErrors] = useState<IPreventiveFormErrors>(
        {} as IPreventiveFormErrors,
    );
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [client, setClient] = useState(
        preventiveForm.branch.client !== undefined
            ? preventiveForm.branch.client.name
            : '',
    );
    const [filteredBranches, setFilteredBranches] = useState<IBranch[]>();
    const [form, setForm] = useState<IPreventiveForm>({
        _id: preventiveForm._id,
        branch: preventiveForm.branch,
        business: preventiveForm.business,
        assigned: preventiveForm.assigned,
        status: preventiveForm.status,
        frequency: preventiveForm.frequency,
        months: preventiveForm.months,
        lastDoneAt: preventiveForm.lastDoneAt,
        batteryChangedAt: preventiveForm.batteryChangedAt,
        observations: preventiveForm.observations,
    });
    //

    useEffect(() => {
        if (submitted) {
            formValidate();
        }
    }, [form]);

    const { stopLoading, startLoading } = useLoading();
    const { triggerAlert } = useAlert();

    /* The POST method adds a new entry in the mongodb database. */
    const postData = async (form: IPreventiveForm): Promise<void> => {
        try {
            startLoading();
            await fetcher.post(form, api.techAdmin.preventives);
            await router.push('/tech-admin/preventives');
            stopLoading();
            triggerAlert({
                type: 'Success',
                message: `El preventivo de ${form.business.name} para la sucursal ${form.branch.number} del cliente ${client} fue creado correctamente`,
            });
        } catch (error) {
            stopLoading();
            triggerAlert({
                type: 'Failure',
                message: `No se pudo crear el preventivo de ${form.business.name} para la sucursal ${form.branch.number} del cliente ${client}`,
            });
        }
    };

    const putData = async (form: IPreventiveForm): Promise<void> => {
        try {
            startLoading();
            await fetcher.put(form, api.techAdmin.preventives);
            await router.push('/tech-admin/preventives');
            stopLoading();
            triggerAlert({
                type: 'Success',
                message: `El preventivo de ${form.business.name} para la sucursal ${form.branch.number} del cliente ${client} fue actualizadp correctamente`,
            });
        } catch (error) {
            stopLoading();
            triggerAlert({
                type: 'Failure',
                message: `No se pudo actualizar el preventivo de ${form.business.name} para la sucursal ${form.branch.number} del cliente ${client}`,
            });
        }
    };

    const selectClient = (event: ChangeEvent<HTMLSelectElement>): void => {
        const { value } = event.target;
        setClient(value);
        setFilteredBranches(branches.filter((branch) => branch.client.name === value));
    };

    const selectBranch = (event: ChangeEvent<HTMLSelectElement>): void => {
        const { name, value } = event.target;
        const branch = branches.find(
            (branch) => branch.number.toString() === value.slice(0, value.indexOf(',')),
        );

        setForm({
            ...form,
            [name]: branch,
        });
    };

    const selectBusiness = (event: ChangeEvent<HTMLSelectElement>): void => {
        const { name, value } = event.target;
        const business = businesses.find((business) => business.name === value);

        setForm({
            ...form,
            [name]: business,
        });
    };
    /*
    const selectTechnician = (event:ChangeEvent<HTMLSelectElement>) =>{

    }

 */
    const changeObservations = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        const { name, value } = event.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const selectFrequency = (event: ChangeEvent<HTMLSelectElement>): void => {
        const { value } = event.target;
        setForm({
            ...form,
            frequency: parseInt(value) as types.Frequency,
        });
    };

    const formValidate = (): IPreventiveFormErrors => {
        const err: IPreventiveFormErrors = {
            client: '',
            branch: '',
            business: '',
            assigned: '',
            frequency: '',
        };
        if (Object.keys(form.branch).length < 1) {
            err.branch = 'Se debe especificar la sucursal';
            err.client = 'Se debe seleccionar el cliente';
        }
        if (Object.keys(form.business).length < 1) {
            err.business = 'Se debe especificar la empresa';
        }
        if (form.assigned.length < 1) {
            err.assigned = 'Se requiere al menos un tecnico asignado';
        }
        if (form.frequency === undefined && form.months.length < 1) {
            err.frequency =
                'Se debe definir o la frecuencia o los meses impuestos por el cliente';
        }
        setErrors(err);
        return err;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        startLoading();
        setSubmitted(true);
        const errs = formValidate();
        if (
            errs.branch === '' &&
            errs.business === '' &&
            errs.assigned === '' &&
            errs.client === '' &&
            errs.frequency === ''
        ) {
            if (newPreventive) {
                void postData(form);
            } else {
                void putData(form);
            }
        } else {
            stopLoading();
        }
    };

    const addTechnician = (e: ChangeEvent<HTMLSelectElement>): void => {
        const { value } = e.target;
        const technician = technicians.find(
            (technician) => technician.fullName === value,
        );
        if (technician !== null) {
            setForm((prev) => {
                return {
                    ...prev,
                    assigned: !prev.assigned.some((x) => x._id === technician._id)
                        ? [...prev.assigned, technician]
                        : prev.assigned,
                };
            });
        }
    };

    const deleteTechnician = (id: string): void => {
        // setBranchBusinesses(prev => prev.filter(business=>business._id!=id))
        setForm((prev) => {
            return {
                ...prev,
                assigned: prev.assigned.filter((technician) => technician._id !== id),
            };
        });
    };

    const addMonth = (e: ChangeEvent<HTMLSelectElement>): void => {
        const { value } = e.target;
        setForm((prev) => {
            return {
                ...prev,
                months: !prev.months.some((month) => month === (value as types.Month))
                    ? [...prev.months, value as types.Month]
                    : prev.months,
            };
        });
    };

    const deleteMonth = (month: types.Month): void => {
        setForm((prev) => {
            return {
                ...prev,
                months: prev.months.filter((prev) => prev !== month),
            };
        });
    };

    async function goBack(): Promise<void> {
        startLoading();
        await router.push('/tech-admin/preventives');
        stopLoading();
    }

    const handleNavigate = (): void => {
        void goBack();
    };

    return (
        <main>
            <TypographyH1 className="mb-8">
                {newPreventive ? 'Agregar Empresa' : 'Editar Empresa'}
            </TypographyH1>
            <Form {...formMethods}>
                <form
                    id="task"
                    className="mx-auto my-4 flex w-1/2 flex-col rounded-3xl bg-gray-50 p-4"
                    onSubmit={handleSubmit}
                >
                    <div id="select-client">
                        <div className="mb-2 block">
                            <FormLabel htmlFor="clients" className="text-lg" />
                        </div>
                        <Select
                            id="clients"
                            required={true}
                            onChange={selectClient}
                            name="select-client"
                            defaultValue={'default'}
                            color={errors.branch !== undefined ? 'failure' : ''}
                        >
                            <option value="default" hidden disabled>
                                {newPreventive ? 'Seleccione un cliente...' : `${client}`}
                            </option>
                            {clients.map((client, index) => (
                                <option key={index}>{client.name}</option>
                            ))}
                        </Select>
                        <div className="mb-2 block">
                            <FormLabel
                                htmlFor="branch"
                                className="text-lg"
                                color="failure"
                            />
                        </div>
                    </div>
                    <div id="select-branch">
                        <div className="mb-2 block">
                            <FormLabel htmlFor="branch" className="text-lg" />
                        </div>
                        <Select
                            id="branches"
                            required={true}
                            onChange={selectBranch}
                            name="branch"
                            defaultValue="default"
                            color={errors.branch !== undefined ? 'failure' : ''}
                        >
                            <option value="default" hidden disabled>
                                {newPreventive
                                    ? 'Seleccione una sucursal...'
                                    : `${preventiveForm.branch.number.toString()}, ${
                                          preventiveForm.branch.city.name
                                      }`}
                            </option>
                            {filteredBranches?.map((branch, index) => (
                                <option
                                    key={index}
                                >{`${branch.number}, ${branch.city.name}`}</option>
                            ))}
                        </Select>
                        <div className="mb-2 block">
                            <FormLabel
                                htmlFor="branch"
                                className="text-lg"
                                color="failure"
                            />
                        </div>
                    </div>
                    <div id="select-business">
                        <div className="mb-2 block">
                            <FormLabel htmlFor="business" className="text-lg" />
                        </div>

                        <Select
                            id="businesses"
                            required={true}
                            onChange={selectBusiness}
                            name="business"
                            defaultValue="default"
                            color={errors.business !== undefined ? 'failure' : ''}
                        >
                            <option value="default" hidden disabled>
                                {newPreventive
                                    ? 'Seleccione una empresa...'
                                    : preventiveForm.business.name}
                            </option>
                            {form.branch?.businesses !== undefined &&
                                form.branch.businesses.map((business, index) => (
                                    <option key={index}>{business.name}</option>
                                ))}
                        </Select>
                        <div className="mb-2 block">
                            <FormLabel
                                htmlFor="branch"
                                className="text-lg"
                                color="failure"
                            />
                        </div>
                    </div>
                    <div id="select-frequency">
                        <div className="mb-2 block">
                            <FormLabel htmlFor="frequency" className="text-lg" />
                        </div>
                        <Select
                            id="frequency"
                            required={true}
                            onChange={selectFrequency}
                            name="frequency"
                            defaultValue="default"
                            color={errors.frequency !== undefined ? 'failure' : ''}
                        >
                            <option value="default" hidden disabled>
                                {newPreventive
                                    ? 'Seleccione la frequencia'
                                    : preventiveForm.frequency !== undefined
                                      ? preventiveForm.frequency > 1
                                          ? `Cada ${preventiveForm.frequency} meses`
                                          : 'Todos los meses'
                                      : 'Seleccione la frequencia'}
                            </option>
                            {types.frequencies.map((frequency, index) => (
                                <option key={index} value={frequency}>
                                    {frequency > 1
                                        ? `Cada ${frequency} meses`
                                        : 'Todos los meses'}
                                </option>
                            ))}
                        </Select>
                        <div className="mb-2 block">
                            <FormLabel
                                htmlFor="frequency error"
                                className="text-lg"
                                color="failure"
                            />
                        </div>
                    </div>
                    <div id="textarea">
                        <div className="mb-2 block">
                            <FormLabel htmlFor="observations" className="text-lg" />
                        </div>
                        <Textarea
                            id="observations"
                            name="observations"
                            onChange={changeObservations}
                            placeholder={
                                newPreventive
                                    ? 'Observaciones...'
                                    : preventiveForm.observations
                            }
                            required={true}
                            value={form.observations}
                            rows={4}
                            color="white"
                        />
                    </div>
                    <div id="select-technician">
                        <div className="mb-2 block">
                            <FormLabel htmlFor="assigned" className="text-lg" />
                        </div>

                        <div className="w-full">
                            <Select
                                id="technicians"
                                onChange={addTechnician}
                                value="default"
                                className="mb-4"
                                color={errors.assigned !== undefined ? 'failure' : ''}
                            >
                                <option value="default" disabled hidden>
                                    Seleccione un tecnico para agregar
                                </option>
                                {technicians.map((technician, index) => (
                                    <option key={index} value={technician.fullName}>
                                        {technician.fullName}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <ul>
                            {form.assigned.map((technician, index) => {
                                return (
                                    <li
                                        className="mb-2 mr-1 inline-block rounded-full bg-gray-300 px-3 py-2"
                                        key={index}
                                    >
                                        <div className="flex items-center justify-between gap-2 font-semibold">
                                            {technician.fullName}
                                            <button
                                                className="rounded-full bg-white "
                                                type="button"
                                                onClick={() =>
                                                    deleteTechnician(
                                                        technician._id as string,
                                                    )
                                                }
                                            >
                                                <BsFillXCircleFill
                                                    color="gray"
                                                    size={20}
                                                />
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="mb-2 block">
                            <FormLabel
                                htmlFor="assigned error"
                                className="text-lg"
                                color="failure"
                            />
                        </div>
                    </div>
                    <div id="select-month">
                        <div className="mb-2 block">
                            <FormLabel htmlFor="assigned" className="text-lg" />
                        </div>
                        <div className="">
                            <Select
                                id="months"
                                onChange={addMonth}
                                value="default"
                                className="mb-4"
                                color={errors.frequency !== undefined ? 'failure' : ''}
                            >
                                <option value="default" disabled hidden>
                                    Seleccione un mes para agregar
                                </option>
                                {types.months.map((month, index) => (
                                    <option key={index} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <ul>
                            {form.months.map((month, index) => {
                                return (
                                    <li
                                        className="mb-2 mr-1 inline-block rounded-full bg-gray-300 px-3 py-2"
                                        key={index}
                                    >
                                        <div className="flex items-center justify-between gap-2 font-semibold">
                                            {month}
                                            <button
                                                className="rounded-full bg-white "
                                                type="button"
                                                onClick={() => deleteMonth(month)}
                                            >
                                                <BsFillXCircleFill
                                                    color="gray"
                                                    size={20}
                                                />
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="mb-2 block">
                        <FormLabel
                            htmlFor="months error"
                            className="text-lg"
                            color="failure"
                        />
                    </div>
                    <div className="flex flex-row justify-between">
                        <Button
                            variant="secondary"
                            onClick={handleNavigate}
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </Form>
        </main>
    );
};

export default PreventiveForm;
