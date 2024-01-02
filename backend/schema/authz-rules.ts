import { preExecRule } from '@graphql-authz/core';
import { Role } from '@prisma/client';

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

const IsAdministrativoTecnico = preExecRule()(async (
    context: YogaContext,
    _fieldArgs,
) => {
    if (!context.user) {
        return false;
    }

    if (context.user.roles.includes(Role.AdministrativoTecnico)) {
        return true;
    }

    return false;
});

const IsAuditor = preExecRule()(async (context: YogaContext, _fieldArgs) => {
    if (!context.user) {
        return false;
    }

    if (context.user.roles.includes(Role.Auditor)) {
        return true;
    }

    return false;
});

const IsTecnico = preExecRule()(async (context: YogaContext, _fieldArgs) => {
    if (!context.user) {
        return false;
    }

    if (context.user.roles.includes(Role.Tecnico)) {
        return true;
    }

    return false;
});

const IsAdministrativoContable = preExecRule()(async (
    context: YogaContext,
    _fieldArgs,
) => {
    if (!context.user) {
        return false;
    }

    if (context.user.roles.includes(Role.AdministrativoContable)) {
        return true;
    }

    return false;
});

export const authzRules = {
    IsAuthenticated,
    IsAdministrativoTecnico,
    IsAdministrativoContable,
    IsAuditor,
    IsTecnico,
} as const;
