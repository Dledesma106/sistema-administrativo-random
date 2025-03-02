const { S3Client, ListObjectsV2Command, CopyObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const sourceClient = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: 'https://s3.us-east-1.amazonaws.com',
});

const targetClient = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: 'https://s3.us-east-2.amazonaws.com',
});

const SOURCE_BUCKET = 'ransys-test';
const TARGET_BUCKET = 'ransys';

async function copyBucketContents() {
    try {
        console.log('Iniciando migración de archivos S3...');
        
        let continuationToken = undefined;
        do {
            // Listar objetos del bucket origen
            const listCommand = new ListObjectsV2Command({
                Bucket: SOURCE_BUCKET,
                ContinuationToken: continuationToken,
            });
            
            const listResponse = await sourceClient.send(listCommand);
            
            if (!listResponse.Contents || listResponse.Contents.length === 0) {
                console.log('No se encontraron archivos para copiar');
                break;
            }

            // Copiar cada objeto al bucket destino
            for (const object of listResponse.Contents) {
                const copyCommand = new CopyObjectCommand({
                    Bucket: TARGET_BUCKET,
                    CopySource: `${SOURCE_BUCKET}/${object.Key}`,
                    Key: object.Key,
                });

                await targetClient.send(copyCommand);
                console.log(`✅ Copiado: ${object.Key}`);
            }

            continuationToken = listResponse.NextContinuationToken;
            
        } while (continuationToken);

        console.log('✅ Migración completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
    }
}

copyBucketContents(); 