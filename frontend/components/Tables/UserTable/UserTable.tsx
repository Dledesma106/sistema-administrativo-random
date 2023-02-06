import { Table } from 'flowbite-react'
import mongoose from 'mongoose'
import { useState } from 'react'
import { IUser } from 'backend/models/interfaces'
import Item from './Item'

interface props{
    users:IUser[]
}
export default function UserTable({users}:props){
    const [tableUsers, setTableUsers] = useState<IUser[]>(users)

    const deleteUser = (id:string | mongoose.Schema.Types.ObjectId) =>{
        const newTable = (prev:IUser[]) => prev.filter(user => user._id !== id)
        //console.log(newTable(users));
        
        setTableUsers(newTable(users))
    }

    
    return(
        <div className='rounded-none shadow-none'>
            <Table hoverable={true} className='bg-white rounded-none shadow-none'>
                <Table.Head className='bg-white border-b'>
                    <Table.HeadCell>Nombre</Table.HeadCell>
                    <Table.HeadCell>Ciudad</Table.HeadCell>
                    <Table.HeadCell>Roles</Table.HeadCell>
                    <Table.HeadCell className='w-40 text-center'>Acciones</Table.HeadCell>
                </Table.Head>
                <Table.Body className='rounded-none shadow-none'>
                    {tableUsers.map((user, index)=><Item key={index} user={user} deleteUser={deleteUser}/>)}
                </Table.Body>
            </Table>
        </div>
    )
}