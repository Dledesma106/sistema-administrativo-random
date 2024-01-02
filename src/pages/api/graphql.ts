import type { NextApiRequest, NextApiResponse } from 'next';

import { useCookies } from '@whatwg-node/server-plugin-cookies';
import { createYoga } from 'graphql-yoga';

import { schema } from 'backend/schema';
export default createYoga<{
    req: NextApiRequest;
    res: NextApiResponse;
}>({
    schema: schema,
    graphqlEndpoint: '/api/graphql',
    // eslint-disable-next-line react-hooks/rules-of-hooks
    plugins: [useCookies()],
});

export const config = {
    api: {
        bodyParser: false,
    },
};
