import jwt from 'jsonwebtoken';
import { getJwtSecret } from './env';

const JWT_SECRET = getJwtSecret();
const JWT_EXPIRE = '7d';

/**
 * Genera un token JWT para un usuario
 */
export function generateToken(userId: string, email: string, role: string): string {
  return jwt.sign(
    { id: userId, email, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

/**
 * Verifica y decodifica un token JWT
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}

/**
 * Extrae el token del header Authorization
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
