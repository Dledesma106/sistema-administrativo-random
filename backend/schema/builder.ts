/* eslint-disable import/default */
/* eslint-disable import/no-named-as-default */
import SchemaBuilder from '@pothos/core';
import AuthzPlugin from '@pothos/plugin-authz';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { DateResolver, DateTimeResolver } from 'graphql-scalars';

import { authzRules } from './authz-rules';
import { YogaContext } from './types';

import { prisma } from 'lib/prisma';

export const builder = new SchemaBuilder<{
    Context: YogaContext;
    AuthZRule: keyof typeof authzRules;
    PrismaTypes: PrismaTypes;
    Scalars: {
        Date: {
            Input: Date;
            Output: Date;
        };
        DateTime: {
            Input: Date;
            Output: Date;
        };
    };
}>({
    plugins: [PrismaPlugin, AuthzPlugin],
    prisma: {
        client: prisma,
    },
});

builder.queryType({});
builder.mutationType({});
builder.addScalarType('Date', DateResolver, {});
builder.addScalarType('DateTime', DateTimeResolver, {});
