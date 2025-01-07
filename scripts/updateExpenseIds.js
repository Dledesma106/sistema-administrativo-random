const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function updateExpensesIds() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado a MongoDB');

        const db = client.db();
        const expensesCollection = db.collection('expenses');
        const tasksCollection = db.collection('tasks');

        // 1. Encontrar todos los gastos que pertenecen a tareas
        const expensesWithTasks = await expensesCollection.find({
            task: { $exists: true, $ne: null },
        }).sort({ createdAt: 1 }).toArray();

        console.log(`Encontrados ${expensesWithTasks.length} gastos con tareas para actualizar`);

        // Crear un mapa de task ObjectId -> taskId numérico
        const taskIds = [...new Set(expensesWithTasks.map(expense => expense.task))];
        const tasksMap = new Map();
        
        for (const taskObjectId of taskIds) {
            const task = await tasksCollection.findOne(
                { _id: new ObjectId(taskObjectId) },
                { projection: { taskId: 1 } }
            );
            if (task && task.taskId) {
                tasksMap.set(taskObjectId.toString(), task.taskId);
            }
        }

        // Agrupar gastos por taskId numérico
        const expensesByTask = expensesWithTasks.reduce((acc, expense) => {
            const numericTaskId = tasksMap.get(expense.task.toString());
            if (numericTaskId) {
                if (!acc[numericTaskId]) {
                    acc[numericTaskId] = [];
                }
                acc[numericTaskId].push(expense);
            }
            return acc;
        }, {});

        // Actualizar gastos con IDs compuestos usando el taskId numérico
        let processedCount = 0;
        for (const numericTaskId in expensesByTask) {
            const expenses = expensesByTask[numericTaskId];
            for (let i = 0; i < expenses.length; i++) {
                const compositeId = `${numericTaskId}-${i + 1}`;
                await expensesCollection.updateOne(
                    { _id: expenses[i]._id },
                    { $set: { expenseId: compositeId } }
                );
                processedCount++;
            }
            console.log(`Procesados ${expenses.length} gastos para la tarea ${numericTaskId}`);
        }

        // 2. Procesar gastos sin tareas
        const expensesWithoutTasks = await expensesCollection.find({
            task: { $exists: false },
            expenseId: { $exists: false }
        }).sort({ createdAt: 1 }).toArray();

        console.log(`Encontrados ${expensesWithoutTasks.length} gastos sin tareas para actualizar`);

        // Encontrar el último ID numérico usado
        const lastNumericExpense = await expensesCollection.findOne(
            {
                expenseId: { $regex: /^\d+$/ }
            },
            { sort: { expenseId: -1 } }
        );

        let nextId = lastNumericExpense ? parseInt(lastNumericExpense.expenseId) + 1 : 1;

        // Actualizar gastos sin tareas con IDs incrementales
        for (const expense of expensesWithoutTasks) {
            await expensesCollection.updateOne(
                { _id: expense._id },
                { $set: { expenseId: nextId.toString() } }
            );
            nextId++;
            processedCount++;
        }

        console.log(`Actualizados ${processedCount} gastos en total`);

    } catch (error) {
        console.error('Error actualizando gastos:', error);
        console.error(error.stack);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

updateExpensesIds();
