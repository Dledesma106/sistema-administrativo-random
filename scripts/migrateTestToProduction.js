const { MongoClient } = require('mongodb');
require('dotenv').config();

const testUri = process.env.MONGODB_URI;
const productionUri = "mongodb+srv://randomDev:488IOoGwvWpjp4tU@randomdev.a3qughe.mongodb.net/production?retryWrites=true&w=majority";

async function migrateTestToProduction() {
    const testClient = new MongoClient(testUri);
    const productionClient = new MongoClient(productionUri);

    try {
        await testClient.connect();
        await productionClient.connect();
        console.log('Conectado a ambas bases de datos');

        const testDb = testClient.db();
        const productionDb = productionClient.db();

        // Lista de colecciones a migrar
        const collections = [
            'users',
            'tasks',
            'businesses',
            'clients',
            'branches',
            'cities',
            'provinces',
            'expenses',
            'preventives',
            'images',
            'files'
        ];

        for (const collectionName of collections) {
            console.log(`\nMigrando colección: ${collectionName}`);
            
            const testCollection = testDb.collection(collectionName);
            const productionCollection = productionDb.collection(collectionName);

            // Obtener todos los documentos de test
            const documents = await testCollection.find({}).toArray();
            console.log(`Encontrados ${documents.length} documentos en test`);

            if (documents.length > 0) {
                // Insertar documentos en producción
                try {
                    await productionCollection.insertMany(documents, { ordered: false });
                    console.log(`✅ Migrados ${documents.length} documentos a producción`);
                } catch (error) {
                    if (error.code === 11000) {
                        console.log(`⚠️  Algunos documentos ya existían en producción (duplicados ignorados)`);
                    } else {
                        throw error;
                    }
                }
            }
        }

        console.log('\n✅ Migración completada exitosamente');

    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        console.error(error.stack);
    } finally {
        await testClient.close();
        await productionClient.close();
        console.log('Conexiones cerradas');
    }
}

migrateTestToProduction(); 