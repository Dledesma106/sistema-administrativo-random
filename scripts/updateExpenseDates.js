const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function updateExpenseDates() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado a MongoDB');

        const db = client.db();
        const expensesCollection = db.collection('expenses');
        // Buscar documentos que no tienen el campo expenseDate
        const expenses = await expensesCollection.find({
            expenseDate: { $exists: false }
        }).toArray();

        console.log(`Encontrados ${expenses.length} gastos para actualizar`);

        // Actualizar cada documento
        for (const expense of expenses) {
            await expensesCollection.updateOne(
                { _id: expense._id },
                { 
                    $set: { 
                        expenseDate: expense.createdAt 
                    } 
                }
            );
        }

        console.log(`Actualizados ${expenses.length} gastos exitosamente`);

    } catch (error) {
        console.error('Error actualizando gastos:', error);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

updateExpenseDates();
