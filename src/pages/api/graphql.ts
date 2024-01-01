import type { NextApiRequest, NextApiResponse } from 'next';

import { createYoga } from 'graphql-yoga';

import { schema } from 'backend/schema';

export default createYoga<{
    req: NextApiRequest;
    res: NextApiResponse;
}>({
    schema: schema,
    graphqlEndpoint: '/api/graphql',
});

export const config = {
    api: {
        bodyParser: false,
    },
};
