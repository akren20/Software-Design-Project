// database.mjs
import { createPool } from 'mysql2/promise';

const pool = createPool({
    host: "volunteerdb.cjqg0oce21yy.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "Swdproject2024!",
    database: "volunteerdb",
    connectionLimit: 10
});

export { pool as db };

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        console.log('Database connection successful:', rows[0].solution);  // Should output 2 if connected
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
}

testConnection();