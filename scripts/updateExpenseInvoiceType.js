const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function updateExpenseInvoiceType() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado a MongoDB');

        const db = client.db();
        const expensesCollection = db.collection('expenses');

        // 1. Encontrar todos los gastos que no tienen invoiceType
        const expensesWithoutInvoiceType = await expensesCollection
            .find({
                invoiceType: { $exists: false },
            })
            .toArray();

        console.log(
            `Encontrados ${expensesWithoutInvoiceType.length} gastos sin invoiceType`,
        );

        if (expensesWithoutInvoiceType.length === 0) {
            console.log('No hay gastos para actualizar');
            return;
        }

        // 2. Actualizar todos los gastos con el valor por defecto 'SinFactura'
        const result = await expensesCollection.updateMany(
            { invoiceType: { $exists: false } },
            { $set: { invoiceType: 'SinFactura' } },
        );

        console.log(
            `Actualizados ${result.modifiedCount} gastos con invoiceType: SinFactura`,
        );

        // 3. Verificar que todos los gastos ahora tienen invoiceType
        const remainingExpenses = await expensesCollection.countDocuments({
            invoiceType: { $exists: false },
        });

        if (remainingExpenses === 0) {
            console.log('✅ Todos los gastos ahora tienen invoiceType');
        } else {
            console.log(`⚠️  Aún quedan ${remainingExpenses} gastos sin invoiceType`);
        }

        // 4. Mostrar estadísticas por tipo de factura
        const stats = await expensesCollection
            .aggregate([
                {
                    $group: {
                        _id: '$invoiceType',
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { count: -1 },
                },
            ])
            .toArray();

        console.log('\n📊 Estadísticas por tipo de factura:');
        stats.forEach((stat) => {
            console.log(`  ${stat._id || 'Sin tipo'}: ${stat.count} gastos`);
        });
    } catch (error) {
        console.error('Error actualizando invoiceType:', error);
        console.error(error.stack);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

updateExpenseInvoiceType();
