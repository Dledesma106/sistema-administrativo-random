import { type NextApiRequest } from 'next';

import { User } from 'backend/models/User';

import { type Role } from '../models/types';

export interface MulterS3File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    bucket: string;
    key: string;
    acl: string;
    contentType: string;
    contentDisposition: null;
    storageClass: string;
    serverSideEncryption: null;
    metadata: {
        fieldname: string;
    };
    location: string;
    etag: string;
    versionId: string;
}

export interface NextConnectApiRequest<RequiresAuth = true> extends NextApiRequest {
    file: MulterS3File;
    filename: string;
    userId: string;
    user: RequiresAuth extends true ? User : undefined;
}

export interface UserData {
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName?: string;
    role: Role[];
}
