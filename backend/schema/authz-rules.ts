import { preExecRule } from '@graphql-authz/core';
import { Role } from '@prisma/client';

import { USER_ACCESS_TOKEN_COOKIE_NAME } from './resolvers/users';
import { YogaContext } from './types';

import { getPayload } from '@/lib/jwt';
import { prisma } from 'lib/prisma';

const getUserFromJWT = async (jwt: string) => {
    let result = null;
    console.log('graphql middleware');
    try {
        result = getPayload(jwt);
        console.error('result', result);
    } catch (error) {
        console.error('result error', error);
        return null;
    }

    if (!result) {
        return null;
    }

    const userId = result.payload.userId;
    if (!userId) {
        return null;
    }

    const user = await prisma.user.findUniqueUndeleted({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return null;
    }

    return user;
};

const getUserFromAuthorizationHeader = async (context: YogaContext) => {
    const authorization = context.request.headers.get('Authorization');
    if (!authorization) {
        return null;
    }

    const jwt = authorization.replace('Bearer ', '');
    return getUserFromJWT(jwt);
};

const getUserFromCookie = async (context: YogaContext) => {
    const cookie = await context.request.cookieStore?.get(USER_ACCESS_TOKEN_COOKIE_NAME);
    if (!cookie?.value) {
        return null;
    }

    const jwt = cookie.value;
    return getUserFromJWT(jwt);
};

const getUserFromContext = async (context: YogaContext) => {
    const cookie = await context.request.cookieStore?.get(USER_ACCESS_TOKEN_COOKIE_NAME);
    if (!cookie?.value) {
        return null;
    }

    let user = null;

    const isMobileApp = context.request.headers.get('X-Mobile-App') === 'true';
    if (isMobileApp) {
        user = await getUserFromAuthorizationHeader(context);
    } else {
        user = await getUserFromCookie(context);
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
