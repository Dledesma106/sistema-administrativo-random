import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'http://127.0.0.1:3000/api/graphql',
    documents: './src/**/*.graphql',

    generates: {
        './src/api/graphql.ts': {
            plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
            config: {
                avoidOptionals: true,
                maybeValue: 'T | null',
                arrayInputCoercion: false,
                enumsAsConst: true,
            },
        },
        './src/api/graphql.schema.json': {
            plugins: ['introspection'],
        },
    },
    hooks: {
        afterAllFileWrite: 'prettier --write',
    },
};
export default config;
