import type { APIRoute } from 'astro';
import { generateToken } from '../../../lib/auth';
import { logger } from '../../../lib/logger';
import type { UserRegister, AuthResponse } from '../../../types';

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Importación dinámica para evitar problemas con Vite SSR
    const { connectDB } = await import('../../../lib/mongodb.js');
    const { default: User } = await import('../../../models/User');
    
    await connectDB();

    const body: UserRegister = await request.json();
    const { name, email, password } = body;

    // Validar datos
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Todos los campos son requeridos',
        } as AuthResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'El email ya está registrado',
        } as AuthResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
    });

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
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    logger.error('Error en registro', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error al registrar usuario',
      } as AuthResponse),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
