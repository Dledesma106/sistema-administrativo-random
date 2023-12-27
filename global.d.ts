import { Mongoose, Connection } from 'mongoose';

declare global {
    const mongoose: Mongoose;
}

declare module 'jsonwebtoken' {
    export interface UserIdJwtPayload extends JwtPayload {
        userId: string;
        userRoles: string[];
    }
}

export const mongoose = global.mongoose || new Connection();
