const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function copyAssignedToParticipants() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado a MongoDB');

        const db = client.db();
        const tasksCollection = db.collection('tasks');
        const usersCollection = db.collection('users');

        // Obtener todas las tareas que no están eliminadas
        const tasks = await tasksCollection.find({ 
            deleted: false 
        }).toArray();

        console.log(`Encontradas ${tasks.length} tareas para procesar`);

        let updatedCount = 0;
        let skippedCount = 0;

        // Procesar cada tarea
        for (const task of tasks) {
            // Si la tarea no tiene asignados, continuar con la siguiente
            if (!task.assignedIDs || task.assignedIDs.length === 0) {
                console.log(`Tarea ${task._id} sin técnicos asignados, omitiendo`);
                skippedCount++;
                continue;
            }

            // Convertir los IDs de string a ObjectId para la consulta
            const assignedObjectIds = task.assignedIDs.map(id => {
                try {
                    return new ObjectId(id);
                } catch (e) {
                    console.warn(`ID inválido encontrado: ${id}`);
                    return null;
                }
            }).filter(id => id !== null);

            if (assignedObjectIds.length === 0) {
                console.log(`Tarea ${task._id} sin IDs válidos, omitiendo`);
                skippedCount++;
                continue;
            }

            // Obtener los nombres completos de los técnicos asignados
            const assignedUsers = await usersCollection.find({
                _id: { $in: assignedObjectIds },
                deleted: false
            }, {
                projection: { fullName: 1 }
            }).toArray();

            // Extraer los nombres completos
            const participantNames = assignedUsers.map(user => user.fullName);

            // Si no hay nombres para agregar, continuar con la siguiente tarea
            if (participantNames.length === 0) {
                console.log(`No se encontraron nombres de técnicos para la tarea ${task._id}, omitiendo`);
                skippedCount++;
                continue;
            }

            // Combinar con los participantes existentes (si hay)
            let updatedParticipants = [...(task.participants || [])];
            
            // Agregar solo los nombres que no existen ya en el array
            for (const name of participantNames) {
                if (!updatedParticipants.includes(name)) {
                    updatedParticipants.push(name);
                }
            }

            // Actualizar la tarea con los nombres de participantes
            await tasksCollection.updateOne(
                { _id: task._id },
                { $set: { participants: updatedParticipants } }
            );

            console.log(`Actualizada tarea ${task._id} (${task.taskNumber}): ${participantNames.join(', ')}`);
            updatedCount++;
        }

        console.log(`Proceso completado: ${updatedCount} tareas actualizadas, ${skippedCount} tareas omitidas`);

    } catch (error) {
        console.error('Error actualizando participantes:', error);
        console.error(error.stack);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

copyAssignedToParticipants(); 