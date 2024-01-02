import { preExecRule } from '@graphql-authz/core';

import { USER_ACCESS_TOKEN_COOKIE_NAME } from './resolvers/users';
import { YogaContext } from './types';

import { getPayload } from '@/lib/jwt';
import { prisma } from 'lib/prisma';

const IsAuthenticated = preExecRule()(async (context: YogaContext, _fieldArgs) => {
    const cookie = await context.request.cookieStore?.get(USER_ACCESS_TOKEN_COOKIE_NAME);
    if (!cookie?.value) {
        return false;
    }

    const jwt = cookie.value;
    let result = null;
    try {
        result = getPayload(jwt);
    } catch (error) {
        return false;
    }

    if (!result) {
        return false;
    }

    const userId = result.payload.userId;
    if (!userId) {
        return false;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return false;
    }

    context.user = user;
    return true;
});

export const authzRules = {
    IsAuthenticated,
} as const;
