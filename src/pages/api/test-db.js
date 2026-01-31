import pool from '../../lib/db';

export default async function handler(req, res) {
    console.log('[DB Health Check] Starting...');

    try {
        // 1. Test basic connection
        const client = await pool.connect();
        console.log('[DB Health Check] Connection successful');

        try {
            // 2. Test table existence
            const result = await client.query('SELECT count(*) FROM users');
            const clientRelease = client.release();

            res.status(200).json({
                status: 'OK',
                message: 'Database connected and table "users" exists',
                user_count: result.rows[0].count
            });
        } catch (queryErr) {
            client.release();
            console.error('[DB Health Check] Query failed:', queryErr.message);
            res.status(500).json({
                status: 'ERROR',
                message: 'Connected to DB, but could not query "users" table. Did you run the SQL script?',
                error: queryErr.message
            });
        }
    } catch (err) {
        console.error('[DB Health Check] Connection failed:', err.message);
        res.status(500).json({
            status: 'ERROR',
            message: 'Could not connect to database. Check DATABASE_URL.',
            error: err.message
        });
    }
}
