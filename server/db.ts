import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Postgres connection pool
// Note: Requires DATABASE_URL in .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/fleet_db',
  // In a real staging/production environment with SSL:
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
