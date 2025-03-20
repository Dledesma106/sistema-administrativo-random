import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-tag';

// Definimos manualmente los tipos para la mutación
type GenerateUploadUrlsMutation = {
    generateUploadUrls: {
        success: boolean;
        message?: string;
        uploadUrls: {
            url: string;
            key: string;
            urlExpire: string;
        }[];
    };
};

type GenerateUploadUrlsMutationVariables = {
    fileCount: number;
    prefix: string;
    mimeTypes: string[];
};

// Definimos la mutación usando graphql-tag para asegurar un AST válido
const GENERATE_UPLOAD_URLS = gql`
    mutation GenerateUploadUrls(
        $fileCount: Int!
        $prefix: String!
        $mimeTypes: [String!]!
    ) {
        generateUploadUrls(
            fileCount: $fileCount
            prefix: $prefix
            mimeTypes: $mimeTypes
        ) {
            success
            message
            uploadUrls {
                url
                key
                urlExpire
            }
        }
    }
`;

export const useGenerateUploadUrls = () => {
    return useMutation<
        GenerateUploadUrlsMutation,
        Error,
        GenerateUploadUrlsMutationVariables
    >({
        mutationFn: async (variables) => {
            try {
                const url =
                    typeof window !== 'undefined'
                        ? `${window.location.origin}/api/graphql`
                        : '/api/graphql';

                console.log('Enviando solicitud para generar URLs presignadas:', {
                    fileCount: variables.fileCount,
                    prefix: variables.prefix,
                    mimeTypesCount: variables.mimeTypes.length,
                });

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        query: GENERATE_UPLOAD_URLS.loc?.source.body,
                        variables,
                    }),
                });

                if (!response.ok) {
                    console.error('Error de red:', response.status, response.statusText);
                    throw new Error(`Error de red: ${response.status}`);
                }

                const json = await response.json();
                console.log('Respuesta recibida:', json);

                if (json.errors && json.errors.length > 0) {
                    const firstError = json.errors[0];
                    console.error('Error GraphQL:', firstError);
                    let message = firstError.message;

                    const firstErrorSplitted = firstError.message.split('Error: ');
                    if (firstErrorSplitted.length > 1) {
                        message = firstErrorSplitted.slice(1).join('');
                    }

                    throw new Error(message);
                }

                if (!json.data || !json.data.generateUploadUrls) {
                    console.error('Respuesta inesperada sin datos:', json);
                    throw new Error('Respuesta inesperada del servidor');
                }

                return json.data as GenerateUploadUrlsMutation;
            } catch (error) {
                console.error('Error completo en useGenerateUploadUrls:', error);
                throw error;
            }
        },
    });
};
