import type { APIRoute } from 'astro';
import { generateToken } from '../../../lib/auth';
import { logger } from '../../../lib/logger';
import type { UserLogin, AuthResponse } from '../../../types';

/**
 * POST /api/auth/login
 * Inicia sesión de usuario
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Importación dinámica para evitar problemas con Vite SSR
    const { connectDB } = await import('../../../lib/mongodb.js');
    const { default: User } = await import('../../../models/User');
    
    await connectDB();

    const body: UserLogin = await request.json();
    const { email, password } = body;

    // Validar datos
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email y contraseña son requeridos',
        } as AuthResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Buscar usuario y incluir password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Credenciales inválidas',
        } as AuthResponse),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Credenciales inválidas',
        } as AuthResponse),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generar token
    const token = generateToken(user._id.toString(), user.email, user.role);

    return new Response(
      JSON.stringify({
        success: true,
        token,
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
    logger.error('Error en login', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error al iniciar sesión',
      } as AuthResponse),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
