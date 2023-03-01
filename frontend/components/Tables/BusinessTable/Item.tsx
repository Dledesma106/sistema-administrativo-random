import { Button, Table } from 'flowbite-react'
import { IBusiness } from 'backend/models/interfaces'
import {BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs'
import Link from 'next/link'
import * as apiEndpoints from 'lib/apiEndpoints'
import mongoose from 'mongoose'
import { useRouter } from 'next/router'
import { slugify } from 'lib/utils'
import fetcher from 'lib/fetcher'
import useLoading from 'frontend/hooks/useLoading'


interface props{
    business:IBusiness,
    deleteBusiness: (id:string | mongoose.Schema.Types.ObjectId) => void
}

export default function Item({business, deleteBusiness}:props){
    const router = useRouter()
    const {startLoading, stopLoading} = useLoading()
    const deleteData = async () => {        
        try {
            await fetcher.delete({_id:business._id}, apiEndpoints.techAdmin.businesses)
            deleteBusiness(business._id as string)

        } 
        catch (error) {
            console.log(error)

        }
    }

    async function navigateEdit(){
        startLoading()
        await router.push(`/tech-admin/businesses/${slugify(business.name)}`)
        stopLoading()
    }

    return(
        <Table.Row className='border-b'>
            <Table.Cell >{business.name}</Table.Cell>
            <Table.Cell className='w-40'>
                <div className='flex justify-center gap-2 items-center'>
                    <button className='p-0.5 hover:bg-gray-200 rounder-lg' onClick={navigateEdit}>
                        <BsFillPencilFill color="gray" size="15"/>
                    </button>
                    <button className='p-0.5 hover:bg-gray-200 rounder-lg' onClick={deleteData}>
                        <BsFillTrashFill color="gray" size="15"/>
                    </button>       
                </div>
            </Table.Cell>
        </Table.Row>
    )
}