import { readFileSync } from 'fs';
import { join } from 'path';
import { getConnection, testConnection } from '../src/lib/db';

async function initializeDatabase() {
    console.log('🚀 Initializing database...\n');

    // Test connection first
    const connected = await testConnection();
    if (!connected) {
        console.error('❌ Failed to connect to database. Please check your .env configuration.');
        process.exit(1);
    }

    try {
        // Read schema file
        const schemaPath = join(__dirname, '..', 'database', 'schema.sql');
        const schema = readFileSync(schemaPath, 'utf-8');

        // Split by semicolon and filter empty statements
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        const connection = await getConnection();

        // Execute each statement
        for (const statement of statements) {
            if (statement) {
                await connection.query(statement);
            }
        }

        connection.release();

        console.log('✅ Database tables created successfully!\n');
        console.log('Tables created:');
        console.log('  - admins');
        console.log('  - admin_sessions');
        console.log('  - admin_backup_codes');
        console.log('  - projects\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase();
