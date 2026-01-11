import type { APIRoute } from 'astro';
import { extractToken, verifyToken } from '../../../lib/auth';
import { logger } from '../../../lib/logger';
import type { AuthResponse } from '../../../types';

/**
 * GET /api/auth/me
 * Obtiene información del usuario autenticado
 */
export const GET: APIRoute = async ({ request }) => {
  try {
    // Importación dinámica para evitar problemas con Vite SSR
    const { connectDB } = await import('../../../lib/mongodb.js');
    const { default: User } = await import('../../../models/User');
    
    await connectDB();

    // Extraer token del header
    const authHeader = request.headers.get('Authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No autorizado - Token no proporcionado',
        } as AuthResponse),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verificar token
    const decoded = verifyToken(token);
    
    // Buscar usuario
    const user = await User.findById(decoded.id);
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Usuario no encontrado',
        } as AuthResponse),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      } as AuthResponse),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    logger.error('Error al verificar usuario', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'No autorizado',
      } as AuthResponse),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
