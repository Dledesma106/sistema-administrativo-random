import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Label, Select, Textarea } from 'flowbite-react';
import { type ChangeEvent, useEffect, useState } from 'react';
import { BsFillXCircleFill } from 'react-icons/bs';

import { Button } from '@/components/ui/button';
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

export interface ITaskForm {
    _id: string;
    branch: IBranch;
    business: IBusiness;
    assigned: IUser[];
    description: string;
    openedAt: Date;
    taskType: types.TaskType | '';
    status: types.TaskStatus | '';
    images?: {
        _id: string;
        url: string;
    }[];
}

export interface ITaskFormErrors {
    branch: string;
    business: string;
    assigned: string;
    description: string;
    client: string;
    taskType: string;
    // status:string,
}

export interface Props {
    taskForm: ITaskForm;
    newTask?: boolean;
    branches: IBranch[];
    clients: IClient[];
    businesses: IBusiness[];
    technicians: IUser[];
}

const TechAdminTaskForm = ({
    taskForm,
    newTask = true,
    businesses,
    branches,
    clients,
    technicians,
}: Props): JSX.Element => {
    const router = useRouter();
    const [errors, setErrors] = useState<ITaskFormErrors>({} as ITaskFormErrors);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [client, setClient] = useState(
        taskForm.branch.client !== undefined ? taskForm.branch.client.name : '',
    );
    const [filteredBranches, setFilteredBranches] = useState<IBranch[]>(
        newTask
            ? []
            : branches.filter(
                  (branch) => branch.client.name === taskForm.branch.client.name,
              ),
    );
    const [form, setForm] = useState<ITaskForm>({
        _id: taskForm._id,
        branch: taskForm.branch,
        business: taskForm.business,
        assigned: taskForm.assigned ?? [],
        taskType: taskForm.taskType,
        description: taskForm.description,
        openedAt: taskForm.openedAt,
        status: taskForm.status,
        images: taskForm.images,
    });
    //

    const { stopLoading, startLoading } = useLoading();
    const { triggerAlert } = useAlert();
    /* The POST method adds a new entry in the mongodb database. */
    const postData = async (form: ITaskForm): Promise<void> => {
        try {
            startLoading();
            await fetcher.post(form, api.techAdmin.tasks);
            await router.push('/tech-admin/tasks');
            stopLoading();
            triggerAlert({
                type: 'Success',
                message: `El tarea para ${form.business.name} en la sucursal ${form.branch.number} del cliente ${client} fue creada correctamente`,
            });
        } catch (error) {
            stopLoading();
            triggerAlert({
                type: 'Failure',
                message: `No se pudo crear la tarea para ${form.business.name} en la sucursal ${form.branch.number} del cliente ${client}`,
            });
        }
    };

    const putData = async (form: ITaskForm): Promise<void> => {
        try {
            startLoading();
            await fetcher.put(form, api.techAdmin.tasks);
            await router.push('/tech-admin/tasks');
            stopLoading();
            triggerAlert({
                type: 'Success',
                message: `La tarea para ${form.business.name} en la sucursal ${form.branch.number} del cliente ${client} fue actualizada correctamente`,
            });
        } catch (error) {
            stopLoading();
            triggerAlert({
                type: 'Failure',
                message: `No se pudo actualizar la tarea para ${form.business.name} en la sucursal ${form.branch.number} del cliente ${client}`,
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

    const changeDescription = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        const { name, value } = event.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const selectTaskType = (event: ChangeEvent<HTMLSelectElement>): void => {
        const { value } = event.target;
        setForm({
            ...form,
            taskType: value as types.TaskType,
        });
    };

    const formValidate = (): ITaskFormErrors => {
        const err: ITaskFormErrors = {
            branch: '',
            business: '',
            assigned: '',
            taskType: '',
            description: '',
            client: '',
            // openedAt:'',
            // status:''}
        };
        if (Object.keys(form.branch).length < 1) {
            err.branch = 'Se debe especificar una sucursal';
        }
        if (Object.keys(form.branch).length < 1) {
            err.client = 'Se debe especificar un cliente';
        }
        if (Object.keys(form.business).length < 1) {
            err.business = 'Se debe especificar una empresa';
        }
        if (form.assigned.length < 1) {
            err.assigned = 'Al menos un tecnico debe ser asignado';
        }
        if (form.taskType === '') {
            err.taskType = 'Se debe especificar el tipo de la tarea';
        }
        if (form.description === '') {
            err.description = 'Se debe proveer una descripcion';
        }
        setErrors(err);
        return err;
    };

    useEffect(() => {
        if (submitted) {
            formValidate();
        }
    }, [form]);

    const handleSubmit = (): void => {
        setSubmitted(true);
        const errs = formValidate();
        if (
            errs.branch === '' &&
            errs.business === '' &&
            errs.assigned === '' &&
            errs.taskType === '' &&
            errs.description === ''
        ) {
            if (newTask) {
                void postData(form);
            } else {
                void putData(form);
            }
        }
    };

    async function goBack(): Promise<void> {
        startLoading();
        await router.push('/tech-admin/tasks');
        stopLoading();
    }

    const handleNavigate = (): void => {
        void goBack();
    };

    return (
        <>
            <form
                id="task"
                className="mx-auto my-4 flex w-1/2 flex-col rounded-3xl bg-gray-50 p-4"
                onSubmit={handleSubmit}
            >
                <h2 className="text-lg">{newTask ? 'Agregar Tarea' : 'Editar Tarea'}</h2>
                <hr className="my-2" />
                <div id="select-client">
                    <div className="mb-2 block">
                        <Label
                            htmlFor="clients"
                            value="Elegi al cliente"
                            className="text-lg"
                        />
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
                            {newTask ? 'Seleccione un cliente...' : `${client}`}
                        </option>
                        {clients.map((client, index) => (
                            <option key={index}>{client.name}</option>
                        ))}
                    </Select>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="client error"
                            value={errors.branch}
                            className="text-lg"
                            color="failure"
                        />
                    </div>
                </div>
                <div id="select-branch">
                    <div className="mb-2 block">
                        <Label
                            htmlFor="branch"
                            value="Elegi la sucursal"
                            className="text-lg"
                        />
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
                            {newTask
                                ? 'Seleccione una sucursal...'
                                : `${taskForm.branch.number.toString()}, ${
                                      taskForm.branch.city.name
                                  }`}
                        </option>
                        {filteredBranches?.map((branch, index) => (
                            <option
                                key={index}
                            >{`${branch.number}, ${branch.city.name}`}</option>
                        ))}
                    </Select>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="branch error"
                            value={errors.branch}
                            className="text-lg"
                            color="failure"
                        />
                    </div>
                </div>
                <div id="select-business">
                    <div className="mb-2 block">
                        <Label
                            htmlFor="business"
                            value="Elegi la empresa"
                            className="text-lg"
                        />
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
                            {newTask
                                ? 'Seleccione una empresa...'
                                : taskForm.business.name}
                        </option>
                        {form.branch?.businesses !== undefined &&
                            form.branch.businesses.map((business, index) => (
                                <option key={index}>{business.name}</option>
                            ))}
                    </Select>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="branch error"
                            value={errors.business}
                            className="text-lg"
                            color="failure"
                        />
                    </div>
                </div>
                <div id="select-technician">
                    <div className="mb-2 block">
                        <Label
                            htmlFor="assigned"
                            value="Elegi a los tecnicos responsables de este preventivo"
                            className="text-lg"
                        />
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
                                            type="button"
                                            className="rounded-full bg-white "
                                            onClick={() =>
                                                deleteTechnician(technician._id as string)
                                            }
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
                            htmlFor="assigned error"
                            value={errors.assigned}
                            className="text-lg"
                            color="failure"
                        />
                    </div>
                </div>
                <div id="select-taskType">
                    <div className="mb-2 block">
                        <Label
                            htmlFor="taskType"
                            value="Elegi el tipo de servicio"
                            className="text-lg"
                        />
                    </div>
                    <Select
                        id="taskType"
                        required={true}
                        onChange={selectTaskType}
                        name="taskType"
                        defaultValue="default"
                        color={errors.taskType !== undefined ? 'failure' : ''}
                    >
                        <option value="default" hidden disabled>
                            {newTask
                                ? 'Seleccione el tipo de servicio'
                                : taskForm.taskType}
                        </option>
                        {types.taskTypes.map((taskType, index) => (
                            <option key={index}>{taskType}</option>
                        ))}
                    </Select>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="assigned error"
                            value={errors.taskType}
                            className="text-lg"
                            color="failure"
                        />
                    </div>
                </div>
                <div id="textarea">
                    <div className="mb-2 block">
                        <Label
                            htmlFor="description"
                            value="Descripcion de la tarea"
                            className="text-lg"
                        />
                    </div>
                    <Textarea
                        id="description"
                        name="description"
                        onChange={changeDescription}
                        placeholder={
                            newTask
                                ? 'Describa brevemente la tarea...'
                                : taskForm.description
                        }
                        required={true}
                        value={form.description}
                        rows={4}
                        color={errors.description !== undefined ? 'failure' : ''}
                    />
                    <div className="mb-2 block">
                        <Label
                            htmlFor="assigned error"
                            value={errors.description}
                            className="text-lg"
                            color="failure"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {form.images?.map((image, index) => {
                        return (
                            <div className="bg-gray-200" key={index}>
                                {/* image in portrait taken from a phone  with an aspect ratio of 9:16 */}
                                <Image
                                    src={image.url}
                                    alt="Task Image"
                                    width={200}
                                    height={400}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 flex flex-row justify-between">
                    <Button variant="secondary" onClick={handleNavigate} type="button">
                        Cancelar
                    </Button>
                    <Button type="submit">Guardar</Button>
                </div>
            </form>
        </>
    );
};

export default TechAdminTaskForm;
