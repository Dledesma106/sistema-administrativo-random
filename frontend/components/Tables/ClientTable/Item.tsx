import { Button, Table } from 'flowbite-react'
import { IClient } from 'backend/models/interfaces'
import {BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs'
import Link from 'next/link'
import * as apiEndpoints from 'lib/apiEndpoints'
import mongoose from 'mongoose'
import { useRouter } from 'next/router'
import { slugify } from 'lib/utils'
import fetcher from 'lib/fetcher'

interface props{
    client:IClient,
    deleteClient: (id:string | mongoose.Schema.Types.ObjectId) => void
}

export default function Item({client, deleteClient}:props){

    const router = useRouter()
    function handleClick(){
        router.push(`/tech-admin/clients/${slugify(client.name)}/branches`)
    }

    const deleteData = async () => {
        try {
            await fetcher.delete({_id:client._id}, apiEndpoints.techAdmin.clients)
            deleteClient(client._id as string)
        } 
        catch (error) {
            console.log(error)
        }
    }

    return(
        <Table.Row className='border-b'>
            <Table.Cell onClick={handleClick}>{client.name}</Table.Cell>
            <Table.Cell>
                <div className='flex justify-center gap-2 items-center'>
                    <Link href='/tech-admin/clients/[name]/edit' as={`/tech-admin/clients/${slugify(client.name)}/edit`}>
                        <button className='p-0.5 hover:bg-gray-200 rounder-lg' >
                            <BsFillPencilFill color="gray" size="15"/>
                        </button>
                    </Link>
                    <button className='p-0.5 hover:bg-gray-200 rounder-lg' onClick={deleteData}>
                        <BsFillTrashFill color="gray" size="15"/>
                    </button>       
                </div>
            </Table.Cell>
        </Table.Row>
    )
}