import type { APIRoute } from 'astro';
import { verifyToken } from '../../../../lib/auth';
import { logger } from '../../../../lib/logger';

export const POST: APIRoute = async ({ request }) => {
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

    const formData = await request.formData();
    const avatarFile = formData.get('avatar') as File;

    if (!avatarFile) {
      return new Response(
        JSON.stringify({ success: false, error: 'No se proporcionó imagen' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convertir imagen a base64 (para simplificar, guardaremos en base64 en la BD)
    // En producción, deberías usar un servicio como Cloudinary, AWS S3, etc.
    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${avatarFile.type};base64,${buffer.toString('base64')}`;

    // Importar dinámicamente
    const { connectDB } = await import('../../../../lib/mongodb.js');
    const { default: User } = await import('../../../../models/User');
    
    await connectDB();

    // Actualizar avatar del usuario
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuario no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    user.avatar = base64Image;
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
    logger.error('Error uploading avatar', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error al subir imagen' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
