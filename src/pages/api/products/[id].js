import { connectDB } from "../../../lib/mongodb.js";
import Product from "../../../models/Product.js";
import { logger } from "../../../lib/logger.ts";

/**
 * GET /api/products/[id]
 * Obtiene un producto por ID
 */
export async function GET({ params }) {
  try {
    const { id } = params;

    await connectDB();
    const product = await Product.findById(id).lean();

    if (!product) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Producto no encontrado",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: product,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    logger.error("Error al obtener producto", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error al obtener producto",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

/**
 * PUT /api/products/[id]
 * Actualiza un producto
 */
export async function PUT({ params, request }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Producto no encontrado",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!product) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Producto no encontrado",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: product,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    logger.error("Error al actualizar producto", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error al actualizar producto",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Elimina un producto
 */
export async function DELETE({ params }) {
  try {
    await connectDB();

    const { id } = params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Producto no encontrado",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {},
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    logger.error("Error al eliminar producto", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error al eliminar producto",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
