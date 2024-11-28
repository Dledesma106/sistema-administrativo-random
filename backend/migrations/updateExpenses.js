import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();
export default async function expenseChanges() {
    const uri = process.env.MONGODB_URI ?? '';
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('test');
        const expenses = database.collection('expenses');
        // Actualizar los campos installments que no están definidos a 1
        const installmentsResult = await expenses.updateMany( { installments: { $exists: false } }, { $set: { installments: 1 } } );
        console.log(`${installmentsResult.modifiedCount} documento(s) actualizado(s) con installments = 1.`); 
        // Actualizar los campos expenseDate que no están definidos con el valor de createdAt
        const expenseDateResult = await expenses.updateMany( { expenseDate: { $exists: false } }, [{ $set: { expenseDate: "$createdAt" } }] );
        console.log(`${expenseDateResult.modifiedCount} documento(s) actualizado(s) con expenseDate = createdAt.`)
        console.log('Migración completada');
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

expenseChanges();
