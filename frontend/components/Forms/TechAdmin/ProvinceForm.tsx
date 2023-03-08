import { Button, Label, TextInput } from 'flowbite-react';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import fetcher from 'lib/fetcher';
import * as api from 'lib/apiEndpoints'
import useLoading from 'frontend/hooks/useLoading';
export interface IProvinceForm{
    _id:string,
    name:string
}

export interface IProvinceFormErrors{
    name:string
}

interface props{
    provinceForm:IProvinceForm,
    newProvince?:boolean
}

export default function ProvinceForm({provinceForm, newProvince=true }:props){
    const router = useRouter()
    const [form,setForm] = useState<IProvinceForm>({
        _id:provinceForm._id,
        name:provinceForm.name
    })
    const[errors, setErrors] = useState<IProvinceFormErrors>({} as IProvinceFormErrors)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const {stopLoading, startLoading} = useLoading()
    const postData = async (form:IProvinceForm) => {
        try {
            startLoading()
            await fetcher.post(form, api.techAdmin.provinces)
            router.push('/tech-admin/provinces')
            stopLoading()
        } 
        catch (error) {
            console.log(error)
            stopLoading()
            alert('No se pudo crear la provincia')
        }
    }

    const putData = async (form:IProvinceForm) => {
        try {
            startLoading()
            await fetcher.put(form, api.techAdmin.provinces)
            await router.push('/tech-admin/provinces')
            stopLoading()
        } 
        catch (error) {
            console.log(error)
            stopLoading()
            alert('No se pudo actualizar la provincia')
        }
    }

    function handleChange(e:ChangeEvent<HTMLInputElement>){
        const{value} = e.target
        setForm({...provinceForm, name:value})
    }

    useEffect(()=>{
        if(submitted)formValidate()
    },[form])

    const formValidate = () => {
        let err : IProvinceFormErrors = { 
           name:''
        }
        //console.log(form.name);
        
        if (!form.name) err.name = 'Se debe especificar un nombre'
        setErrors(err)
        return err
    }

    const handleSubmit = (e:any) => {
        e.preventDefault()
        setSubmitted(true)
        //console.log('estoy submiteando');
        
        const errors = formValidate()
        
        if (errors.name === '' ) {
            newProvince ? postData(form) : putData(form)
        } else {
            setErrors(errors)
        }
    }

    async function goBack(){
        startLoading()
        await router.push('/tech-admin/provinces')
        stopLoading()
    }

    return(
        <>
            <form className='flex flex-col gap-4 w-1/2 mx-auto my-4 bg-gray-50 rounded-3xl p-4' onSubmit={handleSubmit}>
                <h2 className="text-lg">{newProvince?'Agregar Provincia':'Editar Provincia'}</h2>
                <hr className="mb-2"/>
                <div>
                    <div className='mb-2 block'>
                        <Label
                            htmlFor='name'
                            value='Nombre de la provincia'
                            className='text-lg'
                        />
                    </div>
                    <TextInput
                    id='name'
                    type='text'
                    sizing='md'
                    placeholder={provinceForm.name}
                    onChange={handleChange}
                    color={errors.name?'failure':''}
                    />
                    <div className='mb-2 block'>
                        <Label
                        htmlFor='name error'
                        value={errors.name}
                        className='text-lg'
                        color='failure'
                        />
                    </div>
                </div>
                <div className='flex flex-row justify-between'>
                    <Button size='sm' color='gray' onClick={goBack}> Cancelar </Button>
                    <Button size='sm' onClick={handleSubmit}> Guardar </Button>
                </div>
            </form>
        </>
    )
}