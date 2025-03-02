import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();
export default async function expenseChanges() {
    const uri = process.env.MONGODB_URI ?? '';
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('test');
        const expenses = database.collection('expenses');
        const users = database.collection('users');
        await expenses.updateMany(
            { paySource: 'Tarjeta' },
            { $set: { paySource: 'Otro' } },
        );
        await expenses.updateMany(
            {},
            {
                $set: {
                    observations: '',
                    paySourceBank: 'Otro',
                },
            },
        );
        const allExpenses = await expenses.find({}).toArray();
        for (const expense of allExpenses) {
            if (expense.doneBy) {
                const doneBy = expense.doneBy;
                const user = await users.findOne({ _id: doneBy });
                if (user) {
                    await expenses.updateOne(
                        { _id: expense._id },
                        {
                            $set: {
                                registeredBy: doneBy,
                                doneBy: user.fullName,
                            },
                        },
                    );
                }
            }
        }
        console.log('Migración completada');
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

expenseChanges();
