import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql/language/printer';

export { gql } from 'graphql-request';

const url = `${process.env.NEXT_PUBLIC_API_HOST}/api/graphql`;

export async function fetchClient<T, V>(
    query: TypedDocumentNode<T, V>,
    variables: V,
    {
        ...options
    }: Omit<RequestInit, 'method' | 'headers' | 'body'> & {
        token?: string;
    } = {},
) {
    try {
        const fetchConfig: RequestInit = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: print(query),
                variables: variables || undefined,
            }),
            ...options,
        };
        const response = await fetch(url, fetchConfig);

        if (!response.ok) {
            throw response;
        }

        const json = await response.json();

        if (json.errors && json.errors.length > 0) {
            const firstError = json.errors[0];
            let message = firstError.message;

            const firstErrorSplitted = firstError.message.split('Error: ');
            if (firstErrorSplitted.length > 1) {
                message = firstErrorSplitted.slice(1).join('');
            }

            if (message === 'Error decoding signature') {
                sessionStorage.removeItem('token');
                return fetchClient<T, V>(query, variables);
            } else {
                throw new Error(message);
            }
        }

        return json.data as T;
    } catch (error) {
        if (error instanceof Response) {
            if (error.status === 409) {
                window.location.href = '/request-email-verification';
            }

            throw error;
        }

        throw error;
    }
}
