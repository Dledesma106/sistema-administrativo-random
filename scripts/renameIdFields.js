const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function renameFields() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado a MongoDB');

        const db = client.db();
        const tasksCollection = db.collection('tasks');
        const expensesCollection = db.collection('expenses');

        // Primero renombrar los campos
        const taskResult = await tasksCollection.updateMany(
            {},
            { $rename: { "taskId": "taskNumber" } }
        );

        const expenseResult = await expensesCollection.updateMany(
            {},
            { $rename: { "expenseId": "expenseNumber" } }
        );

        // Convertir números a strings y manejar nulls
        const tasksToUpdate = await tasksCollection.find({
            $or: [
                { taskNumber: { $type: "number" } },
                { taskNumber: null }
            ]
        }).toArray();

        for (const task of tasksToUpdate) {
            await tasksCollection.updateOne(
                { _id: task._id },
                { 
                    $set: { 
                        taskNumber: task.taskNumber ? task.taskNumber.toString() : null 
                    } 
                }
            );
        }

        const expensesToUpdate = await expensesCollection.find({
            $or: [
                { expenseNumber: { $type: "number" } },
                { expenseNumber: null }
            ]
        }).toArray();

        for (const expense of expensesToUpdate) {
            await expensesCollection.updateOne(
                { _id: expense._id },
                { 
                    $set: { 
                        expenseNumber: expense.expenseNumber ? expense.expenseNumber.toString() : null 
                    } 
                }
            );
        }

        console.log(`Renombrados: ${taskResult.modifiedCount} tareas y ${expenseResult.modifiedCount} gastos`);
        console.log(`Actualizados: ${tasksToUpdate.length} tareas y ${expensesToUpdate.length} gastos`);

    } catch (error) {
        console.error('Error renombrando campos:', error);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

renameFields();
