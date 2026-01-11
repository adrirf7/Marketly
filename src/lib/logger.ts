/**
 * Logger utility para manejar logs en desarrollo y producción
 * En producción, los logs se pueden enviar a servicios externos
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const isProduction = import.meta.env.PROD || process.env.NODE_ENV === 'production';

class Logger {
  private log(level: LogLevel, message: string, data?: any) {
    // En producción, solo logueamos errores y warnings
    if (isProduction && (level === 'debug' || level === 'info')) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'error':
        console.error(prefix, message, data || '');
        // Aquí se podría enviar a un servicio como Sentry
        break;
      case 'warn':
        console.warn(prefix, message, data || '');
        break;
      case 'info':
        console.log(prefix, message, data || '');
        break;
      case 'debug':
        console.log(prefix, message, data || '');
        break;
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, error?: any) {
    this.log('error', message, error);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }
}

export const logger = new Logger();
