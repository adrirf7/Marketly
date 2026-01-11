import type { APIRoute } from 'astro';
import { verifyToken } from '../../../../../lib/auth';
import { logger } from '../../../../../lib/logger';
import { connectDB } from '../../../../../lib/mongodb.js';

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return new Response(JSON.stringify({ message: 'Token inválido' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { Product } = await connectDB();
    const { id: productId, reviewId } = params;

    if (!productId || !reviewId) {
      return new Response(JSON.stringify({ message: 'ID de producto o reseña faltante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Buscar el producto
    const product = await Product.findById(productId);
    if (!product) {
      return new Response(JSON.stringify({ message: 'Producto no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Buscar la reseña
    const reviewIndex = product.reviews.findIndex(
      (r: any) => r._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return new Response(JSON.stringify({ message: 'Reseña no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const review = product.reviews[reviewIndex];

    // Verificar permisos: admin puede eliminar cualquier reseña, usuarios solo las suyas
    if (decoded.role !== 'admin' && review.userId !== decoded.id) {
      return new Response(JSON.stringify({ message: 'No tienes permiso para eliminar esta reseña' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Eliminar la reseña
    product.reviews.splice(reviewIndex, 1);
    
    // Recalcular rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
      product.rating = totalRating / product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();

    return new Response(JSON.stringify({ 
      message: 'Reseña eliminada exitosamente',
      product 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Error al eliminar reseña', error);
    return new Response(JSON.stringify({ 
      message: 'Error al eliminar reseña'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
