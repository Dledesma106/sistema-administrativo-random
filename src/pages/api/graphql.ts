import type { NextApiRequest, NextApiResponse } from 'next';

import { authZEnvelopPlugin } from '@graphql-authz/envelop-plugin';
import { useCookies } from '@whatwg-node/server-plugin-cookies';
import { createYoga } from 'graphql-yoga';

import { schema } from 'backend/schema';
import { authzRules } from 'backend/schema/authz-rules';
export default createYoga<{
    req: NextApiRequest;
    res: NextApiResponse;
}>({
    schema: schema,
    graphqlEndpoint: '/api/graphql',
    // eslint-disable-next-line react-hooks/rules-of-hooks
    plugins: [useCookies(), authZEnvelopPlugin({ rules: authzRules })],
});

export const config = {
    api: {
        bodyParser: false,
    },
};
