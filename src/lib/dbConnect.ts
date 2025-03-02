/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? '';
if (MONGODB_URI === '') {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local',
    );
}

type Cached = {
    promise: Promise<typeof mongoose> | null;
    conn: typeof mongoose | null;
};

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: Cached = (global as any).mongoose;

if (cached === undefined) {
    cached = (global as any).mongoose = {
        conn: null,
        promise: null,
    };
}

async function dbConnect(): Promise<Cached['conn']> {
    if (cached.conn) {
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
