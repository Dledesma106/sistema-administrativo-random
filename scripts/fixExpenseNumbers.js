const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function fixExpenseNumbers() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado a MongoDB');

        const db = client.db();
        const expensesCollection = db.collection('expenses');
        const tasksCollection = db.collection('tasks');

        // 1. Corregir gastos con tarea
        const expensesWithTasks = await expensesCollection.aggregate([
            { 
                $match: { 
                    task: { $ne: null },
                    deleted: false 
                }
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: 'task',
                    foreignField: '_id',
                    as: 'taskData'
                }
            },
            { 
                $unwind: '$taskData' 
            },
            {
                $sort: { 
                    task: 1,
                    createdAt: 1 
                }
            },
            {
                $group: {
                    _id: '$task',
                    expenses: {
                        $push: {
                            _id: '$_id',
                            taskNumber: '$taskData.taskNumber',
                            currentExpenseNumber: '$expenseNumber',
                            createdAt: '$createdAt'
                        }
                    }
                }
            }
        ]).toArray();

        console.log(`Encontrados ${expensesWithTasks.length} grupos de gastos con tarea`);

        // Actualizar gastos con tarea
        for (const group of expensesWithTasks) {
            console.log(`Procesando grupo de gastos para tarea ${group._id}`);
            for (let i = 0; i < group.expenses.length; i++) {
                const expense = group.expenses[i];
                const newExpenseNumber = `${expense.taskNumber}-${i + 1}`;
                await expensesCollection.updateOne(
                    { _id: expense._id },
                    { $set: { expenseNumber: newExpenseNumber } }
                );
                console.log(`Actualizado gasto ${expense._id} a ${newExpenseNumber}`);
            }
        }

        // 2. Corregir gastos sin tarea
        const individualExpenses = await expensesCollection.aggregate([
            {
                $match: {
                    task: null,
                    deleted: false
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            },
            {
                $group: {
                    _id: null,
                    expenses: {
                        $push: {
                            _id: '$_id',
                            currentExpenseNumber: '$expenseNumber',
                            createdAt: '$createdAt'
                        }
                    }
                }
            }
        ]).toArray();

        if (individualExpenses.length > 0) {
            const expenses = individualExpenses[0].expenses;
            console.log(`Encontrados ${expenses.length} gastos individuales`);

            for (let i = 0; i < expenses.length; i++) {
                const expense = expenses[i];
                const newExpenseNumber = (i + 1).toString();
                await expensesCollection.updateOne(
                    { _id: expense._id },
                    { $set: { expenseNumber: newExpenseNumber } }
                );
                console.log(`Actualizado gasto individual ${expense._id} a ${newExpenseNumber}`);
            }
        }

        console.log('Proceso completado exitosamente');

    } catch (error) {
        console.error('Error actualizando números:', error);
        console.error(error.stack);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

fixExpenseNumbers(); 