/**
 * Helper para obtener variables de entorno
 * Funciona tanto en desarrollo local (Astro) como en producción (Vercel)
 */

/**
 * Obtiene una variable de entorno de forma segura
 * Intenta primero import.meta.env, luego process.env
 */
export function getEnv(key: string, defaultValue?: string): string {
  let value: string | undefined;

  // Intentar obtener de import.meta.env (Astro en desarrollo)
  try {
    if (import.meta?.env?.[key]) {
      value = import.meta.env[key] as string;
    }
  } catch (e) {
    // import.meta no disponible, continuar
  }
  
  // Intentar obtener de process.env (Node.js / Vercel)
  if (!value && process?.env?.[key]) {
    value = process.env[key];
  }
  
  // Usar valor por defecto si está disponible
  if (!value && defaultValue !== undefined) {
    return defaultValue;
  }
  
  // Si hay valor, devolverlo
  if (value) {
    return value;
  }
  
  // Si no hay valor, lanzar error
  throw new Error(`Variable de entorno ${key} no está definida`);
}

/**
 * Obtiene la URI de MongoDB
 */
export function getMongoUri(): string {
  return getEnv('MONGODB_URI');
}

/**
 * Obtiene el secreto JWT
 */
export function getJwtSecret(): string {
  return getEnv('JWT_SECRET', 'your-secret-key-change-in-production');
}

/**
 * Verifica si estamos en producción
 */
export function isProduction(): boolean {
  const env = getEnv('NODE_ENV', 'development');
  return env === 'production';
}
