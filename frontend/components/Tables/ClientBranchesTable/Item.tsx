import { IBranch } from 'backend/models/interfaces'
import Link from 'next/link'
import * as apiEndpoints from 'lib/apiEndpoints'
import fetcher from 'lib/fetcher'
import useLoading from 'frontend/hooks/useLoading'
import { useState } from 'react'
import { Button, Table } from 'flowbite-react'
import {BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs'
import Modal from 'frontend/components/Modal'
import { useRouter } from 'next/router'
import Business from 'backend/models/Business'
import useAlert from 'frontend/hooks/useAlert'

interface props{
    branch:IBranch,
    deleteBranch: (id:string) => void
}

export default function Item({branch, deleteBranch}:props){
    
    const [modal, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };
    const {startLoading, stopLoading} = useLoading()
    const router = useRouter()
    const {triggerAlert} = useAlert()

    const deleteData = async () => {
        try {
            await fetcher.delete({_id:branch._id}, apiEndpoints.techAdmin.branches)
            deleteBranch(branch._id as string)
            triggerAlert({type:'Success', message:`La sucursal de numero ${branch.number} para el cliente ${branch.client.name} fue eliminada correctamente`})

        } 
        catch (error) {
            console.log(error)
            triggerAlert({type:'Failure', message:`No se pudo eliminar la sucursal ${branch.number} para el cliente ${branch.client.name}`})

        }
    }

    async function navigateEdit(){
        startLoading()
        await router.push(`/tech-admin/clients/${branch.client.name}/branches/${branch.number}`)
        stopLoading()
    }

    return(
        <Table.Row className='border-b'>
            <Table.Cell>{branch.number}</Table.Cell>
            <Table.Cell>{`${branch.city.name}, ${branch.city.province.name}`}</Table.Cell>
            <Table.Cell>{branch.businesses.length >1?branch.businesses.map(business => `${business.name}, `):`${branch.businesses[0].name}`}</Table.Cell>
            <Table.Cell>
                <div className='flex justify-center gap-2 items-center'>

                    <button className='p-0.5 hover:bg-gray-200 rounder-lg' onClick={navigateEdit}>
                            <BsFillPencilFill color="gray" size="15"/>
                    </button>
                    <button onClick={openModal} className='p-0.5 hover:bg-gray-200 rounder-lg' >
                        <BsFillTrashFill color="gray" size="15"/>
                    </button> 
                    
            <Modal openModal={modal} handleToggleModal={closeModal} handleDelete={deleteData}/>
                </div>
            </Table.Cell>
        </Table.Row>
    )
}