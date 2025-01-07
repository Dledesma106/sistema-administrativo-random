const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function updateTasksIds() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado a MongoDB');

        const db = client.db();
        const tasksCollection = db.collection('tasks');
        // Buscar documentos que no tienen el campo taskId
        const tasks = await tasksCollection.find({
            taskId: { $exists: false }
        }).sort({ createdAt: 1 }).toArray();

        console.log(`Encontrados ${tasks.length} tareas para actualizar`);

        // Actualizar cada documento
        for (const [index, task] of tasks.entries()) {
            await tasksCollection.updateOne(
                { _id: task._id },
                { $set: { taskId: index + 1 } }
            );
        }

        console.log(`Actualizadas ${tasks.length} tareas exitosamente`);

    } catch (error) {
        console.error('Error actualizando tareas:', error);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

updateTasksIds();
