import { Table } from 'flowbite-react'
import { IUser } from 'backend/models/interfaces'
import {BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs'
import {CgPassword} from 'react-icons/cg'
import Link from 'next/link'
import * as apiEndpoints from 'lib/apiEndpoints'
import mongoose from 'mongoose'
import fetcher from 'lib/fetcher'
import useLoading from 'frontend/hooks/useLoading'
import { useRouter } from 'next/router'

interface props{
    user:IUser,
    deleteUser: (id:string | mongoose.Types.ObjectId) => void
}

export default function Item({user, deleteUser}:props){

    const {startLoading, stopLoading} = useLoading()
    const router = useRouter()

    const deleteData = async () => {
        //console.log('deleting');
        try {
            await fetcher.delete({_id:user._id}, apiEndpoints.techAdmin.users)
            deleteUser(user._id)
        } 
        catch (error) {
            console.log(error)
        }
    }

    async function navigateEdit(){
        startLoading()
        await router.push(`/tech-admin/users/${user._id}`)
        stopLoading()
    }

    async function reGeneratePassword(){        
        try {
            startLoading()
            await fetcher.put({_id:user._id}, apiEndpoints.techAdmin.users + 'new-password')
            stopLoading()
        } 
        catch (error) {
            console.log(error)
            stopLoading()
        }
    }

    return(
        <Table.Row className='border-b '>
            <Table.Cell>{user.fullName}</Table.Cell>
            <Table.Cell>{user.city?`${user.city?.name}, ${user.city?.province.name}`:''}</Table.Cell>
            <Table.Cell>{(user.roles?.length as number) > 1 ? user.roles?.map(role=> `${role}, `) : user.roles?.[0]}</Table.Cell>
            <Table.Cell>
            <div className='flex justify-center gap-2 items-center'>
                    <button className='p-0.5 hover:bg-gray-200 rounder-lg' onClick={navigateEdit}>
                        <BsFillPencilFill color="gray" size="15"/>
                    </button>
                    <button className='p-0.5 hover:bg-gray-200 rounder-lg' onClick={deleteData}>
                        <BsFillTrashFill color="gray" size="15"/>
                    </button>   
                    <button className='p-0.5 hover:bg-gray-200 rounder-lg' onClick={reGeneratePassword}>
                        <CgPassword color='gray' size='15'/>
                    </button>
                </div>
            </Table.Cell>
        </Table.Row>
    )
}