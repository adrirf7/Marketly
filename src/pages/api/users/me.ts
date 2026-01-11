import type { APIRoute } from 'astro';
import { verifyToken } from '../../../lib/auth';
import { logger } from '../../../lib/logger';

export const PUT: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return new Response(
        JSON.stringify({ success: false, error: 'Token inválido' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Datos incompletos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Importar dinámicamente
    const { connectDB } = await import('../../../lib/mongodb.js');
    const { default: User } = await import('../../../models/User');
    
    await connectDB();

    // Buscar usuario
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuario no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar si el email ya existe (si cambió)
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return new Response(
          JSON.stringify({ success: false, error: 'El email ya está en uso' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Actualizar usuario
    user.name = name;
    user.email = email;
    await user.save();

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    logger.error('Error updating user', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error al actualizar usuario' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
