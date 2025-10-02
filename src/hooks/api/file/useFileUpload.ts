import { useState } from 'react';

import { toast } from '@/components/ui/use-toast';
import { useGeneratePresignedUrls } from '@/hooks/api/file/useGeneratePresignedUrls';

export interface UploadedFile {
    key: string;
    filename: string;
    mimeType: string;
    size: number;
}

export interface FileUploadState {
    files: File[];
    uploadedFiles: UploadedFile[];
    isUploading: boolean;
}

export const useFileUpload = () => {
    const generatePresignedUrlsMutation = useGeneratePresignedUrls();
    const [files, setFiles] = useState<File[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const uploadFiles = async (
        filesToUpload: File[],
        prefix: string,
    ): Promise<UploadedFile[]> => {
        if (filesToUpload.length === 0) {
            return [];
        }

        setIsUploading(true);

        try {
            // Mostrar toast de carga
            toast({
                description: 'Preparando archivos...',
                duration: 3000,
            });

            // Obtener presigned URLs del backend
            const result = await generatePresignedUrlsMutation.mutateAsync({
                fileCount: filesToUpload.length,
                prefix,
                mimeTypes: filesToUpload.map((file) => file.type),
            });

            if (!result.generatePresignedUrls.success) {
                throw new Error(
                    result.generatePresignedUrls.message ||
                        'Error al generar presigned URLs',
                );
            }

            // Mostrar toast de carga para la subida
            toast({
                description: 'Subiendo archivos con presigned URLs...',
                duration: 5000,
            });

            // Subir los archivos usando presigned URLs
            const uploadPromises = filesToUpload.map(async (file, index) => {
                const { url, key } = result.generatePresignedUrls.presignedUrls[index];

                // Subir usando presigned URL
                const uploadResponse = await fetch(url, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type,
                    },
                });

                if (!uploadResponse.ok) {
                    throw new Error(
                        `Error al subir el archivo ${file.name}: ${uploadResponse.statusText}`,
                    );
                }

                return {
                    key,
                    filename: file.name,
                    mimeType: file.type,
                    size: file.size,
                };
            });

            // Esperar a que todas las subidas se completen
            const fileInfo = await Promise.all(uploadPromises);

            // Notificar éxito
            toast({
                description: `${filesToUpload.length} ${
                    filesToUpload.length === 1 ? 'archivo subido' : 'archivos subidos'
                } exitosamente.`,
                variant: 'success',
                duration: 3000,
            });

            return fileInfo;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error al subir archivos:', error);
            toast({
                description: `Error al subir los archivos: ${
                    error instanceof Error ? error.message : 'Error desconocido'
                }`,
                variant: 'destructive',
                duration: 5000,
            });
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    const addFiles = (newFiles: File[]) => {
        // Verificar que no se exceda el límite de 5 archivos
        if (files.length + newFiles.length > 5) {
            toast({
                description: 'No se pueden adjuntar más de 5 archivos en total',
                variant: 'destructive',
                duration: 5000,
            });
            return;
        }

        setFiles([...files, ...newFiles]);
    };

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);

        const newUploadedFiles = [...uploadedFiles];
        newUploadedFiles.splice(index, 1);
        setUploadedFiles(newUploadedFiles);
    };

    const clearFiles = () => {
        setFiles([]);
        setUploadedFiles([]);
    };

    return {
        files,
        uploadedFiles,
        isUploading,
        uploadFiles,
        addFiles,
        removeFile,
        clearFiles,
    };
};
