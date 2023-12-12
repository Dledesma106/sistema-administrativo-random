import mongoose from 'mongoose';
/* import mongooseNanoid from 'mongoose-nanoid'
mongoose.plugin(mongooseNanoid, 16) */
const MONGODB_URI = process.env.MONGODB_URI ?? '';
if (MONGODB_URI === '') {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local',
    );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (cached === undefined) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<any> {
    if (cached.conn !== null) {
        return cached.conn;
    }

    if (cached.promise === null) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
