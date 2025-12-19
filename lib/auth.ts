import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'super_admin' | 'content_manager';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query('SELECT id, email, name, role FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await query('SELECT id, email, name, role FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createUser(email: string, password: string, name: string, role: 'super_admin' | 'content_manager' = 'content_manager'): Promise<User> {
  const passwordHash = await hashPassword(password);
  const result = await query(
    'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
    [email, passwordHash, name, role]
  );
  return result.rows[0];
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const result = await query('SELECT id, email, password_hash, name, role FROM users WHERE email = $1', [email]);
  
  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];
  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

