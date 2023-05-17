import { Button, Label, TextInput } from 'flowbite-react'
import { useRouter } from 'next/router'
import { type ChangeEvent, useEffect, useState, type FormEvent } from 'react'
import fetcher from 'lib/fetcher'
import * as api from 'lib/apiEndpoints'
import useLoading from 'frontend/hooks/useLoading'
import useAlert from 'frontend/hooks/useAlert'
export interface IClientForm {
	_id: string
	name: string
}

export interface IClientFormErrors {
	name: string
}

interface props {
	clientForm: IClientForm
	newClient?: boolean
}

export default function ClientForm({ clientForm, newClient = true }: props): JSX.Element {
	const router = useRouter()
	const [form, setForm] = useState<IClientForm>({
		_id: clientForm._id,
		name: clientForm.name
	})
	const [errors, setErrors] = useState<IClientFormErrors>({} as IClientFormErrors)
	const { stopLoading, startLoading } = useLoading()
	const [submitted, setSubmitted] = useState<boolean>(false)
	const { triggerAlert } = useAlert()

	const postData = async (form: IClientForm): Promise<void> => {
		try {
			startLoading()
			await fetcher.post(form, api.techAdmin.clients)
			await router.push('/tech-admin/clients')
			triggerAlert({ type: 'Success', message: `El cliente de nombre "${form.name}" fue creado con exito` })
			stopLoading()
		} catch (error) {
			console.log(error)
			stopLoading()
			triggerAlert({ type: 'Failure', message: `No se pudo crear el cliente "${form.name}"` })
		}
	}

	const putData = async (form: IClientForm): Promise<void> => {
		try {
			startLoading()
			await fetcher.put(form, api.techAdmin.clients)
			await router.push('/tech-admin/clients')
			triggerAlert({ type: 'Success', message: `El cliente de nombre "${form.name}" fue actualizado con exito` })
			stopLoading()
		} catch (error) {
			console.log(error)
			stopLoading()
			triggerAlert({ type: 'Failure', message: `No se pudo actualizar el cliente "${form.name}"` })
		}
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>): void {
		const { value } = e.target
		setForm({ ...clientForm, name: value })
	}

	const formValidate = (): IClientFormErrors => {
		const err: IClientFormErrors = {
			name: ''
		}
		if (form.name === '') err.name = 'Se debe especificar un nombre'
		setErrors(err)
		return err
	}

	useEffect(() => {
		if (submitted) formValidate()
	}, [form])

	async function goBack(): Promise<void> {
		startLoading()
		await router.push('/tech-admin/clients')
		stopLoading()
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault()
		setSubmitted(true)
		const errs = formValidate()
		if (errs.name === '') {
			if (newClient) void postData(form)
			else void putData(form)
		} else {
			setErrors(errs)
		}
	}

	const handleNavigate = (): void => {
		void goBack()
	}

	return (
		<>
			<form className="flex flex-col gap-4 bg-gray-50 w-1/2 rounded-3xl p-4 mx-auto my-4" onSubmit={handleSubmit}>
				<h2 className="text-lg">{newClient ? 'Agregar Cliente' : 'Editar Cliente'}</h2>
				<hr className="mb-2" />
				<div>
					<div className="mb-2 block">
						<Label htmlFor="name" value="Nombre del cliente" className="text-lg" />
					</div>
					<TextInput
						id="name"
						type="text"
						sizing="md"
						placeholder={clientForm.name}
						onChange={handleChange}
						color={errors.name !== '' ? 'failure' : ''}
					/>
					<div className="mb-2 block">
						<Label htmlFor="branch" value={errors.name} className="text-lg" color="failure" />
					</div>
				</div>

				<div className="flex flex-row justify-between">
					<Button size="sm" onClick={handleNavigate} color="gray" type="button">
						{' '}
						Cancelar{' '}
					</Button>
					<Button size="sm" type="submit">
						{' '}
						Guardar{' '}
					</Button>
				</div>
			</form>
		</>
	)
}
