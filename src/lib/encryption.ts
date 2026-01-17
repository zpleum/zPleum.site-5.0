import crypto from 'crypto';

// Get encryption key from environment (use existing TOTP_ENCRYPTION_KEY)
let ENCRYPTION_KEY = process.env.TOTP_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY || '';

// Validate encryption key
if (!ENCRYPTION_KEY) {
    console.error('⚠️  ENCRYPTION_KEY not set in environment variables!');
    console.error('⚠️  Generating temporary key for development (NOT SECURE FOR PRODUCTION)');
    console.error('⚠️  Run: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    console.error('⚠️  Then add to .env.local: ENCRYPTION_KEY=<generated-key>');

    // Generate temporary key for development
    ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
} else if (ENCRYPTION_KEY.length !== 64) {
    console.error(`⚠️  ENCRYPTION_KEY has invalid length: ${ENCRYPTION_KEY.length} (expected 64)`);
    console.error('⚠️  Run: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    throw new Error('Invalid ENCRYPTION_KEY length. Must be 64 hex characters (32 bytes)');
}

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

/**
 * Encrypt sensitive data (e.g., TOTP secrets)
 */
export function encrypt(text: string): string {
    try {
        const key = Buffer.from(ENCRYPTION_KEY, 'hex');
        const iv = crypto.randomBytes(IV_LENGTH);
        const salt = crypto.randomBytes(SALT_LENGTH);

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final()
        ]);

        const tag = cipher.getAuthTag();

        // Combine: salt + iv + tag + encrypted
        const result = Buffer.concat([salt, iv, tag, encrypted]);

        return result.toString('base64');
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedData: string): string {
    try {
        const key = Buffer.from(ENCRYPTION_KEY, 'hex');
        const data = Buffer.from(encryptedData, 'base64');

        const salt = data.subarray(0, SALT_LENGTH);
        const iv = data.subarray(SALT_LENGTH, TAG_POSITION);
        const tag = data.subarray(TAG_POSITION, ENCRYPTED_POSITION);
        const encrypted = data.subarray(ENCRYPTED_POSITION);

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);

        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final()
        ]);

        return decrypted.toString('utf8');
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}

/**
 * Generate a random encryption key (for setup)
 * Run this once and store in .env.local as ENCRYPTION_KEY
 */
export function generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a secure session ID
 */
export function generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
}
