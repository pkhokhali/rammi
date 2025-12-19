import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn('DATABASE_URL not set. Database operations will fail.');
    return null;
  }

  if (!pool) {
    try {
      pool = new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });

      // Handle pool errors
      pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
      });
    } catch (error) {
      console.error('Failed to create database pool:', error);
      return null;
    }
  }

  return pool;
}

export async function query(text: string, params?: any[]): Promise<{ rows: any[]; rowCount: number }> {
  const db = getDbPool();
  
  if (!db) {
    // Return empty result if database is not configured
    console.warn('Database not configured. Returning empty result.');
    return { rows: [], rowCount: 0 };
  }

  const start = Date.now();
  try {
    const res = await db.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error', error);
    // Return empty result instead of throwing to prevent page crashes
    return { rows: [], rowCount: 0 };
  }
}

