const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function migratePreventiveFrequencies() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado a MongoDB');

        const db = client.db();
        const preventivesCollection = db.collection('preventives');

        // Obtener todos los preventivos
        const preventives = await preventivesCollection.find({}).toArray();
        console.log(`Encontrados ${preventives.length} preventivos`);

        // Contador para estadísticas
        const stats = {
            removed: 0,
            mensual: 0,
            bimestral: 0,
            trimestral: 0,
            cuatrimestral: 0,
            semestral: 0,
            error: 0
        };

        // Procesar cada preventivo
        for (const preventive of preventives) {
            try {
                let update;
                
                switch (preventive.frequency) {
                    case 1:
                        update = { $set: { frequency: "Mensual" } };
                        stats.mensual++;
                        break;
                    case 2:
                        update = { $set: { frequency: "Bimestral" } };
                        stats.bimestral++;
                        break;
                    case 3:
                        update = { $set: { frequency: "Trimestral" } };
                        stats.trimestral++;
                        break;
                    case 4:
                        update = { $set: { frequency: "Cuatrimestral" } };
                        stats.cuatrimestral++;
                        break;
                    case 6:
                        update = { $set: { frequency: "Semestral" } };
                        stats.semestral++;
                        break;
                    default:
                        update = { $unset: { frequency: "" } };
                        stats.removed++;
                }

                await preventivesCollection.updateOne(
                    { _id: preventive._id },
                    update
                );

                console.log(`Actualizado preventivo ${preventive._id}`);
            } catch (error) {
                console.error(`Error actualizando preventivo ${preventive._id}:`, error);
                stats.error++;
            }
        }

        console.log('\nEstadísticas de migración:');
        console.log('---------------------------');
        console.log(`Convertidos a Mensual: ${stats.mensual}`);
        console.log(`Convertidos a Bimestral: ${stats.bimestral}`);
        console.log(`Convertidos a Trimestral: ${stats.trimestral}`);
        console.log(`Convertidos a Cuatrimestral: ${stats.cuatrimestral}`);
        console.log(`Convertidos a Semestral: ${stats.semestral}`);
        console.log(`Campos frequency eliminados: ${stats.removed}`);
        console.log(`Errores encontrados: ${stats.error}`);
        console.log('---------------------------');
        console.log('Proceso completado exitosamente');

    } catch (error) {
        console.error('Error durante la migración:', error);
        console.error(error.stack);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

migratePreventiveFrequencies();
