import { preExecRule } from '@graphql-authz/core';
import { Role } from '@prisma/client';

import { USER_ACCESS_TOKEN_COOKIE_NAME } from './resolvers/users';
import { YogaContext } from './types';

import { getPayload } from '@/lib/jwt';
import { prisma } from 'lib/prisma';

const getUserFromContext = async (context: YogaContext) => {
    const cookie = await context.request.cookieStore?.get(USER_ACCESS_TOKEN_COOKIE_NAME);
    if (!cookie?.value) {
        return null;
    }

    const jwt = cookie.value;
    let result = null;
    try {
        result = getPayload(jwt);
    } catch (error) {
        return null;
    }

    if (!result) {
        return null;
    }

    const userId = result.payload.userId;
    if (!userId) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return null;
    }

    return user;
};

const IsAuthenticated = preExecRule({
    error: 'No estás autenticado',
})(async (context: YogaContext, _fieldArgs) => {
    const user = await getUserFromContext(context);
    if (!user) {
        return false;
    }

    context.user = user;
    return true;
});

const IsAdministrativoTecnico = preExecRule({
    error: 'No tienes permisos para realizar esta acción',
})(async (context: YogaContext, _fieldArgs) => {
    const user = await getUserFromContext(context);
    if (!user) {
        return false;
    }

    if (user.roles.includes(Role.AdministrativoTecnico)) {
        return true;
    }

    return false;
});

const IsAuditor = preExecRule({
    error: 'No tienes permisos para realizar esta acción',
})(async (context: YogaContext, _fieldArgs) => {
    const user = await getUserFromContext(context);
    if (!user) {
        return false;
    }

    if (user.roles.includes(Role.Auditor)) {
        return true;
    }

    return false;
});

const IsTecnico = preExecRule({
    error: 'No tienes permisos para realizar esta acción',
})(async (context: YogaContext, _fieldArgs) => {
    const user = await getUserFromContext(context);
    if (!user) {
        return false;
    }

    if (user.roles.includes(Role.Tecnico)) {
        return true;
    }

    return false;
});

const IsAdministrativoContable = preExecRule({
    error: 'No tienes permisos para realizar esta acción',
})(async (context: YogaContext, _fieldArgs) => {
    const user = await getUserFromContext(context);
    if (!user) {
        return false;
    }

    if (user.roles.includes(Role.AdministrativoContable)) {
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
