import mysql from 'mysql2/promise';

// Database configuration
const dbConfig: mysql.PoolOptions = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'zpleum_db',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // SSL configuration for cloud databases (TiDB Cloud, PlanetScale, etc.)
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
    } : undefined,
};

// Create connection pool (singleton for Next.js HMR)
const globalForMysql = global as unknown as { pool: mysql.Pool | undefined };

export function getPool(): mysql.Pool {
    if (!globalForMysql.pool) {
        globalForMysql.pool = mysql.createPool(dbConfig);
    }
    return globalForMysql.pool;
}

// Get a connection from the pool
export async function getConnection(): Promise<mysql.PoolConnection> {
    const pool = getPool();
    return await pool.getConnection();
}

// Execute a query with automatic connection handling and simple retry for ECONNRESET
export async function query<T = any>(
    sql: string,
    values?: any[],
    retries = 2
): Promise<T> {
    try {
        const pool = getPool();
        const [rows] = await pool.query(sql, values);
        return rows as T;
    } catch (error: any) {
        if (retries > 0 && (error.code === 'ECONNRESET' || error.code === 'PROTOCOL_CONNECTION_LOST')) {
            console.warn(`Database connection lost. Retrying... (${retries} left)`);
            return query(sql, values, retries - 1);
        }
        throw error;
    }
}

// Execute a query and return the first row
export async function queryOne<T = any>(
    sql: string,
    values?: any[]
): Promise<T | null> {
    const rows = await query<T[]>(sql, values);
    return rows.length > 0 ? rows[0] : null;
}

// Test database connection
export async function testConnection(): Promise<boolean> {
    try {
        const pool = getPool();
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}

// Close all connections
export async function closePool(): Promise<void> {
    if (globalForMysql.pool) {
        await globalForMysql.pool.end();
        globalForMysql.pool = undefined;
    }
}

// Type definitions for database tables
export interface Admin {
    id: string;
    email: string;
    password_hash: string;
    is_2fa_enabled: boolean;
    totp_secret_encrypted: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface AdminSession {
    id: string;
    admin_id: string;
    token_hash: string;
    refresh_token_hash: string;
    expires_at: Date;
    created_at: Date;
}

export interface AdminBackupCode {
    id: string;
    admin_id: string;
    code_hash: string;
    used_at: Date | null;
    created_at: Date;
}

export interface Project {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    project_url: string | null;
    github_url: string | null;
    technologies: string[] | null;
    featured: boolean;
    created_by: string | null;
    updated_by: string | null;
    created_at: Date;
    updated_at: Date;
}
