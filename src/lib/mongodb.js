import mongoose from "mongoose";
import { logger } from "./logger.ts";

let isConnected = false;

/**
 * Establece la conexión con MongoDB
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  // Si ya está conectado, no hacer nada
  if (isConnected) {
    logger.debug("Usando conexión existente a MongoDB");
    return;
  }

  try {
    const MONGODB_URI = import.meta.env.MONGODB_URI || process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("Por favor define la variable de entorno MONGODB_URI");
    }

    // Opciones de configuración de mongoose
    const options = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const db = await mongoose.connect(MONGODB_URI, options);

    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      logger.info("MongoDB conectado exitosamente");
    }
  } catch (error) {
    logger.error("Error al conectar con MongoDB", error);
    throw error;
  }
};

/**
 * Cierra la conexión con MongoDB
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info("MongoDB desconectado");
  } catch (error) {
    logger.error("Error al desconectar MongoDB", error);
    throw error;
  }
};

/**
 * Verifica el estado de la conexión
 * @returns {boolean}
 */
export const isDBConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

export default { connectDB, disconnectDB, isDBConnected };
