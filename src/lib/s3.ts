import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

const s3Client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID || '',
        secretAccessKey: R2_SECRET_ACCESS_KEY || '',
    },
});

/**
 * Uploads a file to Cloudflare R2
 * @param buffer The file content as a Buffer
 * @param filename The name to store the file as
 * @param contentType The MIME type of the file
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(buffer: Buffer, filename: string, contentType: string): Promise<string> {
    if (!R2_BUCKET_NAME) throw new Error('R2_BUCKET_NAME is not defined');
    if (!R2_PUBLIC_URL) throw new Error('R2_PUBLIC_URL is not defined');

    const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
    });

    await s3Client.send(command);

    // Ensure public URL doesn't have trailing slash and filename doesn't have leading slash
    const base = R2_PUBLIC_URL.endsWith('/') ? R2_PUBLIC_URL.slice(0, -1) : R2_PUBLIC_URL;
    const path = filename.startsWith('/') ? filename.slice(1) : filename;

    return `${base}/${path}`;
}

/**
 * Deletes a file from Cloudflare R2
 * @param fileUrl The full public URL of the file to delete
 */
export async function deleteFromR2(fileUrl: string): Promise<void> {
    if (!R2_BUCKET_NAME) throw new Error('R2_BUCKET_NAME is not defined');
    if (!R2_PUBLIC_URL) throw new Error('R2_PUBLIC_URL is not defined');

    try {
        const url = new URL(fileUrl);
        // Remove leading slash from pathname to get the R2 key
        const filename = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;

        const command = new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: filename,
        });

        await s3Client.send(command);
    } catch (error) {
        console.error(`Failed to delete file from R2 (${fileUrl}):`, error);
    }
}

export interface R2Object {
    key: string;
    url: string;
    size: number;
    lastModified: Date;
}

/**
 * Lists files from Cloudflare R2 with a specific prefix
 * @param prefix The prefix to filter objects (e.g., 'profile/')
 * @returns Array of R2 objects with their metadata
 */
export async function listFromR2(prefix: string): Promise<R2Object[]> {
    if (!R2_BUCKET_NAME) throw new Error('R2_BUCKET_NAME is not defined');
    if (!R2_PUBLIC_URL) throw new Error('R2_PUBLIC_URL is not defined');

    const command = new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        Prefix: prefix,
    });

    const response = await s3Client.send(command);

    if (!response.Contents) {
        return [];
    }

    const base = R2_PUBLIC_URL.endsWith('/') ? R2_PUBLIC_URL.slice(0, -1) : R2_PUBLIC_URL;

    return response.Contents.map(obj => ({
        key: obj.Key || '',
        url: `${base}/${obj.Key}`,
        size: obj.Size || 0,
        lastModified: obj.LastModified || new Date(),
    }));
}
