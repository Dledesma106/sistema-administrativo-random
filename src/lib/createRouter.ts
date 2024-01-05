import { NextApiResponse } from 'next';

import { createRouter } from 'next-connect';

import { NextConnectApiRequest } from 'backend/controllers/interfaces';

export const createApiRouter = <RequiresAuth = true>() => {
    return createRouter<NextConnectApiRequest<RequiresAuth>, NextApiResponse>();
};
