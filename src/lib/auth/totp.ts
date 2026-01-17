import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';

const APP_NAME = 'zPleum Admin';
const ENCRYPTION_KEY = process.env.TOTP_ENCRYPTION_KEY || '';
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt TOTP secret using AES-256-GCM
 */
export function encryptSecret(secret: string): string {
    // Remove whitespace and potential surrounding quotes
    const sanitizedKey = ENCRYPTION_KEY.trim().replace(/^["']|["']$/g, '');

    if (!sanitizedKey || sanitizedKey.length !== 64) {
        console.error(`TOTP Encryption Key Error: String length is ${sanitizedKey?.length || 0}. Expected 64 hex characters.`);
        if (sanitizedKey) {
            console.error(`Key starts with: ${sanitizedKey.substring(0, 3)}... ends with: ...${sanitizedKey.substring(sanitizedKey.length - 3)}`);
        }
        throw new Error('TOTP_ENCRYPTION_KEY must be a 64-character hex string');
    }

    const isHex = /^[0-9a-fA-F]+$/.test(sanitizedKey);
    if (!isHex) {
        console.error('TOTP Configuration Error: Key contains non-hexadecimal characters.');
        console.error(`First 10 character of sanitized key: "${sanitizedKey.substring(0, 10)}"`);
        throw new Error('TOTP_ENCRYPTION_KEY must be a 64-character hex string');
    }

    const key = Buffer.from(sanitizedKey, 'hex');
    if (key.length !== 32) {
        console.error(`TOTP Encryption Key Error: Buffer length is ${key.length}. Expected 32 bytes.`);
        console.error(`First 5 characters of sanitzed key: "${sanitizedKey.substring(0, 5)}"`);
        throw new Error('TOTP_ENCRYPTION_KEY must be a valid 64-character hex string');
    }
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt TOTP secret using AES-256-GCM
 */
export function decryptSecret(encryptedData: string): string {
    // Remove whitespace and potential surrounding quotes
    const sanitizedKey = ENCRYPTION_KEY.trim().replace(/^["']|["']$/g, '');

    if (!sanitizedKey || sanitizedKey.length !== 64) {
        console.error(`TOTP Decryption Key Error: String length is ${sanitizedKey?.length || 0}. Expected 64 hex characters.`);
        throw new Error('TOTP_ENCRYPTION_KEY must be a 64-character hex string');
    }

    const isHex = /^[0-9a-fA-F]+$/.test(sanitizedKey);
    if (!isHex) {
        console.error('TOTP Configuration Error: Key contains non-hexadecimal characters.');
        throw new Error('TOTP_ENCRYPTION_KEY must be a 64-character hex string');
    }

    const key = Buffer.from(sanitizedKey, 'hex');
    if (key.length !== 32) {
        console.error(`TOTP Decryption Key Error: Buffer length is ${key.length}. Expected 32 bytes.`);
        throw new Error('TOTP_ENCRYPTION_KEY must be a valid 64-character hex string');
    }
    const parts = encryptedData.split(':');

    if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Generate a new TOTP secret
 */
export function generateSecret(): { secret: string; encryptedSecret: string } {
    const secret = speakeasy.generateSecret({
        name: APP_NAME,
        length: 32,
    });

    return {
        secret: secret.base32,
        encryptedSecret: encryptSecret(secret.base32),
    };
}

/**
 * Generate QR code for TOTP setup
 */
export async function generateQRCode(
    email: string,
    secret: string
): Promise<string> {
    const otpauthUrl = speakeasy.otpauthURL({
        secret,
        label: email,
        issuer: APP_NAME,
        encoding: 'base32',
    });

    return await QRCode.toDataURL(otpauthUrl);
}

/**
 * Verify a TOTP token
 */
export function verifyToken(
    encryptedSecret: string,
    token: string,
    window: number = 1
): boolean {
    try {
        const secret = decryptSecret(encryptedSecret);

        return speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window, // Allow 1 step before/after for clock drift
        });
    } catch (error) {
        console.error('Error verifying TOTP token:', error);
        return false;
    }
}

/**
 * Generate backup codes for 2FA recovery
 */
export function generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];

    for (let i = 0; i < count; i++) {
        // Generate 8-character alphanumeric code
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();
        codes.push(code);
    }

    return codes;
}
