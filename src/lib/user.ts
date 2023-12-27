import { type UserIdJwtPayload, verify } from 'jsonwebtoken';

import dbConnect from './dbConnect';
import { mongooseDocumentToJSON } from './utils';

import { NextConnectApiRequest } from 'backend/controllers/interfaces';
import UserModel from 'backend/models/User';

const secret = process.env.SECRET ?? '';

export async function getUserServer(req: NextConnectApiRequest) {
    await dbConnect();
    const { cookies } = req;
    if (cookies.ras_access_token === undefined) {
        return undefined;
    }
    const jwt = cookies.ras_access_token;
    const result = <UserIdJwtPayload>verify(jwt, secret);
    if (result === undefined) {
        return undefined;
    }
    const _id = result._id;
    const docUser = await UserModel.findById(_id);
    if (docUser === null) {
        return undefined;
    }
    const user = mongooseDocumentToJSON(docUser);
    return user;
}
