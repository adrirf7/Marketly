import type { APIContext } from 'astro';
import { extractToken, verifyToken } from '../lib/auth';
import type { JWTPayload } from '../types';

export interface AuthenticatedRequest extends APIContext {
  user?: JWTPayload & { _id: string };
}

/**
 * Middleware para proteger rutas que requieren autenticación
 */
export async function requireAuth(
  context: APIContext
): Promise<Response | null> {
  try {
    // Extraer token
    const authHeader = context.request.headers.get('Authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No autorizado - Token requerido',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verificar token
    const decoded = verifyToken(token);

    // Importación dinámica para evitar problemas con Vite SSR
    const { connectDB } = await import('../lib/mongodb.js');
    const { default: User } = await import('../models/User');

    // Conectar a DB y verificar usuario existe
    await connectDB();
    const user = await User.findById(decoded.id);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Usuario no encontrado',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Agregar usuario al context (para uso posterior)
    (context as AuthenticatedRequest).user = {
      ...decoded,
      _id: user._id.toString(),
    };

    // null indica que la autenticación fue exitosa
    return null;
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'No autorizado',
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Middleware para proteger rutas que requieren rol de administrador
 */
export async function requireAdmin(
  context: APIContext
): Promise<Response | null> {
  // Primero verificar autenticación
  const authError = await requireAuth(context);
  if (authError) return authError;

  const user = (context as AuthenticatedRequest).user;

  if (user?.role !== 'admin') {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Acceso denegado - Se requiere rol de administrador',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return null;
}
