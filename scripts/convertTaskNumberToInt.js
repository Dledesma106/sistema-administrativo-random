const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function convertTaskNumberToInt() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado a MongoDB');

        const db = client.db();
        const tasksCollection = db.collection('tasks');

        // Encontrar todas las tareas con taskNumber como string
        const tasksToUpdate = await tasksCollection.find({
            taskNumber: { $type: "string" }
        }).toArray();

        console.log(`Encontradas ${tasksToUpdate.length} tareas para convertir`);

        // Convertir taskNumber de string a int
        for (const task of tasksToUpdate) {
            await tasksCollection.updateOne(
                { _id: task._id },
                { 
                    $set: { 
                        taskNumber: parseInt(task.taskNumber, 10)
                    } 
                }
            );
        }

        console.log(`Convertidas ${tasksToUpdate.length} tareas de string a int`);

    } catch (error) {
        console.error('Error convirtiendo taskNumber:', error);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

convertTaskNumberToInt();