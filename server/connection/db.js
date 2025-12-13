// db.js
require('dotenv').config();
const { Pool, Client } = require('pg');

const dbConfig = {
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'habesha-expat',
    port: 5432,
    max: 20, // Increased max connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

const pgPool = new Pool(dbConfig);

// ---------------------------------------------------------
//  AUTO-KILL FUNCTION: Clears "Zombie" Connections on Start
// ---------------------------------------------------------
const clearIdleConnections = async () => {
    // We create a temporary separate client just for this cleanup task
    const client = new Client(dbConfig);
    
    try {
        await client.connect();
        
        // This query kills ALL idle connections to this specific database
        // except the one we are currently using.
        const sql = `
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = $1
              AND pid <> pg_backend_pid()
              AND (state = 'idle' OR application_name ILIKE '%pgAdmin%');
        `;

        const result = await client.query(sql, [dbConfig.database]);
        console.log(`🧹 Database Cleanup: Killed ${result.rowCount} idle/pgAdmin connections.`);
        
    } catch (err) {
        // If we can't even connect to kill them, the DB is truly hard-locked.
        if (err.code === '53300') {
            console.error("❌ CRITICAL: Database is 100% full. You must restart the PostgreSQL Service manually or close pgAdmin.");
        } else {
            console.error("⚠️ Warning: Could not clear idle connections:", err.message);
        }
    } finally {
        await client.end();
    }
};

// Run the cleanup immediately when this file is loaded
clearIdleConnections();

// ---------------------------------------------------------
//  Universal Query Function
// ---------------------------------------------------------
const query = async (sql, params = []) => {
    try {
        const result = await pgPool.query(sql, params);
        const insertId = result.rows.length > 0 && result.rows[0].id ? result.rows[0].id : null;
        return { rows: result.rows, insertId };
    } catch (err) {
        console.error("Database Error:", err.message);
        throw err;
    }
};

// ---------------------------------------------------------
//  Graceful Shutdown (Prevents creating new zombies)
// ---------------------------------------------------------
const cleanup = async () => {
    console.log('Closing PostgreSQL pool...');
    await pgPool.end();
    process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

module.exports = { query };