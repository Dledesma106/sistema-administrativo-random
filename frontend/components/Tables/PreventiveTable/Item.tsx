import { IPreventive, IUser } from 'backend/models/interfaces'
import Link from 'next/link'
import { Month } from 'backend/models/types'
import { dmyDateString, toMonth } from 'lib/utils'
import * as api from 'lib/apiEndpoints'
import fetcher from 'lib/fetcher'
import useLoading from 'frontend/hooks/useLoading'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Table, Badge } from 'flowbite-react'
import {BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs'
import Modal from 'frontend/components/Modal'
import useAlert from 'frontend/hooks/useAlert'

export default function Item({preventive, deletePreventive}:{preventive:IPreventive, deletePreventive:(id:string)=>void}){

    const {startLoading, stopLoading} = useLoading()
    const router = useRouter()
    const [modal, setModal] = useState(false);
    const {triggerAlert} = useAlert()

    
    const openModal = () => {
        setModal(true);
    };
    
    const closeModal = () => {
        setModal(false);
    };

    const deleteData = async () => {
        try {
            await fetcher.delete({_id:preventive._id}, api.techAdmin.preventives)
            deletePreventive(preventive._id as string)
            triggerAlert({type:'Success', message:`El preventivo de ${preventive.business.name} para la sucursal ${preventive.branch.number} del cliente ${preventive.branch.client.name} fue eliminado correctamente`})
        } 
        catch (error) {
            console.log(error)
            triggerAlert({type:'Failure', message:`No se pudo eliminar el preventivo de ${preventive.business.name} para la sucursal ${preventive.branch.number} del cliente ${preventive.branch.client.name}, compruebe su conexion`})
        }
    }

    function imposedMonths(months:Month[]){
        return months.length>1?months.map(month => `${month}, `):months[0]
    }

    function selectedTechs(techs:IUser[]){
        return techs.length > 1?techs.map(tech => `${tech.fullName}, `): techs[0].fullName
    }

    async function navigateEdit(){
        startLoading()
        await router.push(`/tech-admin/preventives/${preventive._id}`)
        stopLoading()
    }
    
    return (
        <Table.Row className='border-b'>
            <Table.Cell>{preventive.business.name}</Table.Cell>
            <Table.Cell>{`${preventive.branch.number}, ${preventive.branch.client.name}, ${preventive.branch.city.name}`}</Table.Cell>
            <Table.Cell>{selectedTechs(preventive.assigned)}</Table.Cell>
            <Table.Cell>{preventive.frequency?`Cada ${preventive.frequency} meses`:''}</Table.Cell>
            <Table.Cell>{preventive.months? imposedMonths(preventive.months):''}</Table.Cell>
            <Table.Cell>{preventive.observations}</Table.Cell>
            <Table.Cell>{preventive.lastDoneAt?dmyDateString(new Date(preventive.lastDoneAt)):''}</Table.Cell>
            <Table.Cell><Badge color='warning'>{preventive.status}</Badge></Table.Cell>
            <Table.Cell>{preventive.batteryChangedAt?dmyDateString(new Date(preventive.batteryChangedAt)):''}</Table.Cell>
            <Table.Cell>
                <div className='flex justify-evenly items-center'>
                    <button className='p-0.5 hover:bg-gray-200 rounder-lg ' onClick={navigateEdit} >
                        <BsFillPencilFill color="gray" size="15"/>
                    </button>
                    <button className='p-0.5 hover:bg-gray-200 rounder-lg' onClick={openModal}>
                        <BsFillTrashFill color="gray" size="15"/>
                    </button>       
                </div>
                <Modal openModal={modal} handleToggleModal={closeModal} handleDelete={deleteData}/>
            </Table.Cell>
        </Table.Row>
    )
}