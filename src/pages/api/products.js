import { connectDB } from "../../lib/mongodb.js";
import Product from "../../models/Product.js";
import { logger } from "../../lib/logger.ts";

/**
 * GET /api/products
 * Obtiene todos los productos con filtros opcionales
 */
export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const brand = url.searchParams.get("brand");
    const maxPrice = url.searchParams.get("maxPrice");
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    await connectDB();

    const query = {};
    if (category && category !== "all") query.category = category;
    if (brand && brand !== "all") query.brand = brand;
    if (maxPrice) query.price = { $lte: parseFloat(maxPrice) };
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

    const total = await Product.countDocuments(query);

    return new Response(
      JSON.stringify({
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    logger.error("Error al obtener productos", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error al obtener productos",
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
 * POST /api/products
 * Crea un nuevo producto
 */
export async function POST({ request }) {
  try {
    await connectDB();
    const body = await request.json();
    const product = await Product.create(body);

    return new Response(
      JSON.stringify({
        success: true,
        data: product,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    logger.error("Error al crear producto", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Error al crear producto",
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
