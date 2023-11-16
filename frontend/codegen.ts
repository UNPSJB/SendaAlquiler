import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'http://127.0.0.1:8000/graphql',
    documents: './src/api/documents/*.graphql',

    generates: {
        './src/api/graphql.ts': {
            plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
            config: {
                avoidOptionals: true,
                // immutableTypes: true,
                // skipTypename: true,
                // preResolveTypes: false,
                maybeValue: 'T | null',
                scalars: {
                    Date: 'string',
                },
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
