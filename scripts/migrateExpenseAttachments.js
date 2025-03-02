const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function migrateExpenseAttachments() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado a MongoDB');

        const db = client.db();
        const expensesCollection = db.collection('expenses');
        const imagesCollection = db.collection('images');
        const filesCollection = db.collection('files');

        // Obtener todos los gastos que no están eliminados
        const expenses = await expensesCollection.find({ 
            deleted: false 
        }).toArray();

        console.log(`Encontrados ${expenses.length} gastos para procesar`);

        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        // Procesar cada gasto
        for (const expense of expenses) {
            try {
                console.log(`Procesando gasto #${expense.expenseNumber} (ID: ${expense._id})`);
                
                // Inicializar arrays vacíos (esto sobrescribirá cualquier array existente)
                const imageIDs = [];
                const fileIDs = [];
                
                // Verificar si el gasto tiene una imagen directa (como ObjectId o string)
                if (expense.image) {
                    try {
                        let imageId;
                        if (typeof expense.image === 'string') {
                            imageId = expense.image;
                        } else if (expense.image.$oid) {
                            // Si es un objeto con $oid
                            imageId = expense.image.$oid;
                        } else {
                            // Si es un ObjectId directo
                            imageId = expense.image.toString();
                        }
                        
                        console.log(`  Encontrada referencia a imagen: ${imageId}`);
                        
                        // Verificar que la imagen existe
                        const image = await imagesCollection.findOne({ 
                            _id: new ObjectId(imageId),
                            deleted: false
                        });
                        
                        if (image) {
                            // Convertir el ID a ObjectId antes de guardarlo
                            const imageObjectId = new ObjectId(imageId);
                            console.log(`  Añadiendo imagen: ${imageId} como ObjectId`);
                            imageIDs.push(imageObjectId);
                            
                            // Actualizar la imagen para que tenga referencia al gasto
                            await imagesCollection.updateOne(
                                { _id: imageObjectId },
                                { $addToSet: { expenseIDs: expense._id } }
                            );
                        } else {
                            console.log(`  No se encontró la imagen ${imageId} en la base de datos`);
                        }
                    } catch (imageError) {
                        console.error(`  Error procesando imagen: ${JSON.stringify(expense.image)}`, imageError);
                    }
                }
                
                // Verificar si el gasto tiene un archivo directo (como ObjectId o string)
                if (expense.file) {
                    try {
                        let fileId;
                        if (typeof expense.file === 'string') {
                            fileId = expense.file;
                        } else if (expense.file.$oid) {
                            // Si es un objeto con $oid
                            fileId = expense.file.$oid;
                        } else {
                            // Si es un ObjectId directo
                            fileId = expense.file.toString();
                        }
                        
                        console.log(`  Encontrada referencia a archivo: ${fileId}`);
                        
                        // Verificar que el archivo existe
                        const file = await filesCollection.findOne({ 
                            _id: new ObjectId(fileId),
                            deleted: false
                        });
                        
                        if (file) {
                            // Convertir el ID a ObjectId antes de guardarlo
                            const fileObjectId = new ObjectId(fileId);
                            console.log(`  Añadiendo archivo: ${fileId} como ObjectId`);
                            fileIDs.push(fileObjectId);
                            
                            // Actualizar el archivo para que tenga referencia al gasto
                            await filesCollection.updateOne(
                                { _id: fileObjectId },
                                { $addToSet: { expenseIDs: expense._id } }
                            );
                        } else {
                            console.log(`  No se encontró el archivo ${fileId} en la base de datos`);
                        }
                    } catch (fileError) {
                        console.error(`  Error procesando archivo: ${JSON.stringify(expense.file)}`, fileError);
                    }
                }
                
                // Actualizar el gasto con los nuevos arrays de ObjectIds
                // y eliminar los campos antiguos
                await expensesCollection.updateOne(
                    { _id: expense._id },
                    { 
                        $set: { 
                            imageIDs: imageIDs,
                            fileIDs: fileIDs
                        },
                        $unset: {
                            image: "",
                            file: ""
                        }
                    }
                );
                
                console.log(`  Actualizado gasto ${expense._id}: ${imageIDs.length} imágenes, ${fileIDs.length} archivos`);
                updatedCount++;
                
            } catch (expenseError) {
                console.error(`Error procesando gasto ${expense._id}:`, expenseError);
                errorCount++;
            }
        }

        console.log(`Proceso completado: ${updatedCount} gastos actualizados, ${skippedCount} gastos omitidos, ${errorCount} errores`);

    } catch (error) {
        console.error('Error migrando adjuntos de gastos:', error);
        console.error(error.stack);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

migrateExpenseAttachments(); 