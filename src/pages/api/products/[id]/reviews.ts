import type { APIRoute } from 'astro';
import { verifyToken } from '../../../../lib/auth';
import { logger } from '../../../../lib/logger';

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
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
    const { rating, comment } = body;

    if (!rating || !comment) {
      return new Response(
        JSON.stringify({ success: false, error: 'Datos incompletos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Importar dinámicamente
    const { connectDB } = await import('../../../../lib/mongodb.js');
    const mongoose = await import('mongoose');
    
    await connectDB();

    // Obtener modelo de Product
    const Product = mongoose.default.models.Product || 
      mongoose.default.model('Product', new mongoose.default.Schema({}, { strict: false }));

    // Buscar producto
    const product = await Product.findById(id);
    
    if (!product) {
      return new Response(
        JSON.stringify({ success: false, error: 'Producto no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Importar modelo de User
    const { default: User } = await import('../../../../models/User');
    const user = await User.findById(decoded.id);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuario no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Añadir reseña
    if (!product.reviews) {
      product.reviews = [];
    }

    product.reviews.push({
      rating: Number(rating),
      comment: comment,
      reviewerName: user.name,
      reviewerEmail: user.email,
      date: new Date(),
    });

    // Recalcular rating promedio
    const totalRating = product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();

    return new Response(
      JSON.stringify({
        success: true,
        data: product,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    logger.error('Error adding review', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error al agregar reseña' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
