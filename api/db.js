import pg from 'pg';
const { Pool } = pg;

// Use a single pool instance
// In Vercel serverless, this pool might be created per invocation or re-used if the container is warm.
// Ideally for Vercel + Postgres, consider using @vercel/postgres or a connection pooler string (Supabase Transaction Mode).

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Required for Supabase/Neon typically
    },
});

export default pool;
