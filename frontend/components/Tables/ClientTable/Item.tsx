import { Button, Table } from 'flowbite-react'
import { IClient } from 'backend/models/interfaces'
import {BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs'
import Link from 'next/link'
import * as apiEndpoints from 'lib/apiEndpoints'
import mongoose from 'mongoose'
import { useRouter } from 'next/router'
import { slugify } from 'lib/utils'

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
        //console.log('deleting');
        const contentType = 'application/json'
        
        try {
            const res: Response = await fetch(apiEndpoints.techAdmin.clients, {
                method: 'DELETE',
                headers: {
                    Accept: contentType,
                    'Content-Type': contentType,
                    },
                body:JSON.stringify({_id:client._id})
            })

            // Throw error with status code in case Fetch API req failed
            if (!res.ok) {
                console.log(res);
                throw new Error('failed to delete Client')
            }
            deleteClient(client._id)

        } 
        catch (error) {
            console.log(error)

        }
    }

    return(
        <Table.Row>
            <Table.Cell onClick={handleClick}>{client.name}</Table.Cell>
            <Table.Cell>
                <div className='flex justify-end space-x-4'>
                    <Link href='/tech-admin/clients/[name]/edit' as={`/tech-admin/clients/${slugify(client.name)}/edit`}>
                        <Button outline={true} className='flex justify-evenly '>
                            <BsFillPencilFill/>
                            <h4>Editar</h4>
                        </Button>
                    </Link>
                    <Button outline={true} className='flex justify-evenly' onClick={deleteData}>
                        <BsFillTrashFill/>
                        <h4>Borrar</h4>
                    </Button>
                </div>
            </Table.Cell>
        </Table.Row>
    )
}