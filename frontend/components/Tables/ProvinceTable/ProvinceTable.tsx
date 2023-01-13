import { Table } from 'flowbite-react'
import mongoose from 'mongoose'
import { useState } from 'react'
import { IProvince } from 'backend/models/interfaces'
import Item from './Item'

interface props{
    provinces:IProvince[]
}
export default function ProvinceTable({provinces}:props){
    const [tableProvinces, setTableProvinces] = useState<IProvince[]>(provinces)

    const deleteProvince = (id:string | mongoose.Schema.Types.ObjectId) =>{
        const newTable = (prev:IProvince[]) => prev.filter(province => province._id !== id)
        console.log(newTable(provinces));
        
        setTableProvinces(newTable(provinces))
    }

    
    return(
        <>
            <Table>
                <Table.Head color='teal'>
                    <Table.HeadCell>Nombre</Table.HeadCell>
                    <Table.HeadCell></Table.HeadCell>
                </Table.Head>
                <Table.Body>
                    {tableProvinces.map((province, index)=><Item key={index} province={province} deleteProvince={deleteProvince}/>)}
                </Table.Body>
            </Table>
        </>
    )
}