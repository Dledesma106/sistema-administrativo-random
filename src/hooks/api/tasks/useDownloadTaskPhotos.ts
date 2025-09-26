import { useMutation } from '@tanstack/react-query';
import JSZip from 'jszip';

import { fetchClient } from '@/api/fetch-client';
import { GetTaskPhotosKeysDocument } from '@/api/graphql';

interface DownloadTaskPhotosParams {
    startDate: Date;
    endDate: Date;
    businessId?: string;
}

export const useDownloadTaskPhotos = () => {
    return useMutation({
        mutationFn: async (params: DownloadTaskPhotosParams) => {
            const { startDate, endDate, businessId } = params;

            // Paso 1: Obtener las fotos con información de nombres
            const photosResult = await fetchClient(GetTaskPhotosKeysDocument, {
                startDate,
                endDate,
                businessId: businessId ?? null,
            });

            const imageDataStrings = photosResult.getTaskPhotosWithInfo;

            if (imageDataStrings.length === 0) {
                throw new Error('No se encontraron fotos para el período seleccionado');
            }

            // Paso 2: Crear el archivo ZIP
            const zip = new JSZip();

            // Paso 3: Descargar cada imagen individualmente
            for (let i = 0; i < imageDataStrings.length; i++) {
                const imageDataString = imageDataStrings[i];
                const imageData = JSON.parse(imageDataString);

                try {
                    // Obtener imagen descargada desde el backend
                    const imageResponse = await fetch('/api/s3/get-signed-url', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ key: imageData.key }),
                    });

                    if (!imageResponse.ok) {
                        console.error(
                            `Error getting image data for ${imageData.fileName}:`,
                            imageResponse.statusText,
                        );
                        return; // Continuar con la siguiente imagen
                    }

                    const { imageData: base64Data } = await imageResponse.json();

                    // Convertir base64 a buffer
                    const imageBuffer = Uint8Array.from(atob(base64Data), (c) =>
                        c.charCodeAt(0),
                    );

                    // Usar el nombre de archivo correcto del formato estándar
                    const fileName = imageData.fileName;

                    // Agregar la imagen al ZIP
                    zip.file(fileName, imageBuffer);
                } catch (error) {
                    console.error(`Error processing image ${imageData.fileName}:`, error);
                    // Continuar con las siguientes imágenes
                }
            }

            // Paso 4: Generar el archivo ZIP
            const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });

            // Paso 5: Crear y descargar el archivo
            const blob = new Blob([zipBuffer], { type: 'application/zip' });
            const url = URL.createObjectURL(blob);

            // Crear un enlace temporal para descargar
            const link = document.createElement('a');
            link.href = url;
            link.download = `fotos-tareas-${startDate.toISOString().split('T')[0]}-${endDate.toISOString().split('T')[0]}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Limpiar la URL
            URL.revokeObjectURL(url);

            return { success: true };
        },
    });
};
