 const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function updateIds() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado a MongoDB');

        const db = client.db();
        const tasksCollection = db.collection('tasks');
        const expensesCollection = db.collection('expenses');

        // 1. Actualizar tareas sin taskNumber
        // Primero encontrar el último número usado
        const lastTask = await tasksCollection.findOne(
            { taskNumber: { $exists: true } },
            { sort: { taskNumber: -1 } }
        );

        let nextTaskNumber = lastTask ? parseInt(lastTask.taskNumber) + 1 : 1;

        // Encontrar y actualizar tareas sin taskNumber
        const tasksToUpdate = await tasksCollection.find({
            taskNumber: { $exists: false }
        }).sort({ createdAt: 1 }).toArray();

        console.log(`Encontradas ${tasksToUpdate.length} tareas para actualizar`);

        for (const task of tasksToUpdate) {
            await tasksCollection.updateOne(
                { _id: task._id },
                { $set: { taskNumber: nextTaskNumber } }
            );
            nextTaskNumber++;
        }

        // 2. Actualizar gastos sin expenseNumber
        const expensesToUpdate = await expensesCollection.find({
            expenseNumber: null
        }).sort({ createdAt: 1 }).toArray();

        console.log(`Encontrados ${expensesToUpdate.length} gastos para actualizar`);

        for (const expense of expensesToUpdate) {
            if (expense.task) {
                // Si el gasto está asociado a una tarea
                const task = await tasksCollection.findOne({ _id: expense.task });
                if (!task) continue;

                // Encontrar el último número de secuencia para esta tarea
                const lastExpense = await expensesCollection.findOne(
                    {
                        task: expense.task,
                        expenseNumber: { $exists: true, $regex: task.taskNumber }
                    },
                    { sort: { expenseNumber: -1 } }
                );

                const sequence = lastExpense
                    ? parseInt(lastExpense.expenseNumber.split('-')[1]) + 1
                    : 1;

                await expensesCollection.updateOne(
                    { _id: expense._id },
                    { $set: { expenseNumber: `${task.taskNumber}-${sequence}` } }
                );
            } else {
                // Si el gasto no está asociado a una tarea
                const lastExpense = await expensesCollection.findOne(
                    {
                        task: null,
                        expenseNumber: { $exists: true, $not: { $regex: '-' } }
                    },
                    { sort: { expenseNumber: -1 } }
                );

                const nextNumber = lastExpense
                    ? (parseInt(lastExpense.expenseNumber) + 1).toString()
                    : '1';

                await expensesCollection.updateOne(
                    { _id: expense._id },
                    { $set: { expenseNumber: nextNumber } }
                );
            }
        }

        console.log(`Actualizadas ${tasksToUpdate.length} tareas`);
        console.log(`Actualizados ${expensesToUpdate.length} gastos`);

    } catch (error) {
        console.error('Error actualizando IDs:', error);
        console.error(error.stack);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

updateIds();