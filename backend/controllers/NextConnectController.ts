import { type NextApiResponse } from 'next';

import { NextConnectApiRequest } from './interfaces';

export const onError = (
    error: any,
    req: NextConnectApiRequest<boolean>,
    res: NextApiResponse,
): void => {
    return res.status(500).json({
        error: `Sorry something Happened! ${error as string}`,
    });
};

export const onNoMatch = (
    req: NextConnectApiRequest<boolean>,
    res: NextApiResponse,
): void => {
    return res.status(405).json({
        error: `Method '${req.method as string}' Not Allowed`,
    });
};
