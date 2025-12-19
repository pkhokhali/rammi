/**
 * Edge-compatible authentication utilities
 * Uses Web Crypto API instead of Node.js crypto
 */

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'super_admin' | 'content_manager';
}

/**
 * Simple JWT verification for Edge Runtime
 * Only verifies token structure and expiration, not signature
 * Full verification happens in API routes (Node.js runtime)
 */
export function verifyTokenEdge(token: string): User | null {
  try {
    // Basic JWT structure check
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (base64url) - Edge Runtime compatible
    const payload = parts[1];
    // Convert base64url to base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    
    // Use atob (available in Edge Runtime) to decode
    const decodedString = atob(padded);
    const decoded = JSON.parse(decodedString);

    // Check expiration
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return null;
    }

    // Return user data (signature verification happens in Node.js routes)
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name || decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
}

