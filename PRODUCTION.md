# 🚀 Guía de Despliegue en Producción

Esta guía te ayudará a desplegar Marketly en producción de forma segura y optimizada.

## ✅ Checklist pre-producción

### Seguridad

- [ ] Cambiar `JWT_SECRET` por una clave aleatoria fuerte
- [ ] Configurar `NODE_ENV=production` en variables de entorno
- [ ] Usar MongoDB Atlas o un servidor MongoDB dedicado
- [ ] Habilitar autenticación en MongoDB
- [ ] Configurar HTTPS en el servidor
- [ ] Revisar permisos de archivos y carpetas

### Optimización

- [ ] Ejecutar `pnpm build` y verificar que no haya errores
- [ ] Configurar compresión Gzip en el servidor
- [ ] Configurar caché de assets estáticos
- [ ] Optimizar imágenes si es necesario
- [ ] Configurar CDN si se requiere

### Monitoreo

- [ ] Configurar servicio de logging (ej: Sentry, LogRocket)
- [ ] Configurar alertas de errores
- [ ] Implementar monitoreo de rendimiento
- [ ] Configurar backups automáticos de MongoDB

## 🔐 Variables de entorno de producción

Crear archivo `.env` en producción con:

```env
# MongoDB - Usar MongoDB Atlas u otro servicio
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketly?retryWrites=true&w=majority

# JWT Secret - Generar uno nuevo y seguro
# Puedes generar uno con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=tu_clave_super_secreta_de_64_caracteres_minimo

# Environment
NODE_ENV=production
```

## 📦 Construcción para producción

```bash
# 1. Instalar dependencias
pnpm install --frozen-lockfile

# 2. Construir la aplicación
pnpm build

# 3. El output estará en ./dist/
```

## 🌐 Opciones de despliegue

### Opción 1: Vercel (Recomendado para Astro)

1. **Instalar Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Desplegar**

   ```bash
   vercel --prod
   ```

3. **Configurar variables de entorno en Vercel Dashboard**
   - Ir a Settings > Environment Variables
   - Agregar `MONGODB_URI` y `JWT_SECRET`

### Opción 2: Netlify

1. **Instalar adaptador de Netlify**

   ```bash
   pnpm add @astrojs/netlify
   ```

2. **Modificar `astro.config.mjs`**

   ```js
   import netlify from "@astrojs/netlify";

   export default defineConfig({
     adapter: netlify(),
     // ... resto de la configuración
   });
   ```

3. **Desplegar vía Netlify CLI o Git**

### Opción 3: VPS/Servidor dedicado (Node.js)

1. **Construir la aplicación**

   ```bash
   pnpm build
   ```

2. **Copiar archivos al servidor**

   ```bash
   scp -r dist/ user@server:/path/to/app/
   ```

3. **En el servidor, instalar PM2**

   ```bash
   npm install -g pm2
   ```

4. **Crear archivo `ecosystem.config.js`**

   ```js
   module.exports = {
     apps: [
       {
         name: "marketly",
         script: "./dist/server/entry.mjs",
         instances: "max",
         exec_mode: "cluster",
         env: {
           NODE_ENV: "production",
           PORT: 3000,
         },
       },
     ],
   };
   ```

5. **Iniciar con PM2**

   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

6. **Configurar Nginx como proxy inverso**
   ```nginx
   server {
     listen 80;
     server_name tudominio.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

### Opción 4: Docker

1. **Crear `Dockerfile`**

   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm install --production

   COPY . .
   RUN npm run build

   EXPOSE 3000

   CMD ["node", "./dist/server/entry.mjs"]
   ```

2. **Crear `docker-compose.yml`**

   ```yaml
   version: "3.8"
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - MONGODB_URI=${MONGODB_URI}
         - JWT_SECRET=${JWT_SECRET}
       restart: unless-stopped
   ```

3. **Construir y ejecutar**
   ```bash
   docker-compose up -d
   ```

## 🗄️ MongoDB en producción

### MongoDB Atlas (Recomendado)

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito o de pago
3. Configurar IP whitelist (permitir todas las IPs: `0.0.0.0/0` para producción)
4. Crear usuario de base de datos
5. Obtener connection string y usarlo en `MONGODB_URI`

### Seguridad MongoDB

- Usar contraseñas fuertes
- Habilitar autenticación
- Configurar firewall/IP whitelist
- Hacer backups regulares
- Monitorear uso y rendimiento

## 📊 Monitoreo y Logs

### Integrar Sentry para errores

1. **Instalar Sentry**

   ```bash
   pnpm add @sentry/node
   ```

2. **Configurar en `src/lib/logger.ts`**

   ```ts
   import * as Sentry from "@sentry/node";

   if (process.env.NODE_ENV === "production") {
     Sentry.init({
       dsn: process.env.SENTRY_DSN,
       environment: "production",
     });
   }
   ```

### Logs de aplicación

El logger creado (`src/lib/logger.ts`) ya está optimizado para producción:

- Solo registra errores y warnings en producción
- No expone información sensible
- Se puede extender para enviar logs a servicios externos

## 🔄 Actualizaciones

### Proceso de actualización

1. **Hacer backup de la base de datos**

   ```bash
   mongodump --uri="mongodb+srv://..." --out=./backup
   ```

2. **Pull de cambios**

   ```bash
   git pull origin main
   ```

3. **Instalar dependencias**

   ```bash
   pnpm install
   ```

4. **Construir nueva versión**

   ```bash
   pnpm build
   ```

5. **Reiniciar aplicación**
   ```bash
   pm2 restart marketly
   # o
   vercel --prod
   ```

## 🚨 Troubleshooting

### Error de conexión a MongoDB

- Verificar que `MONGODB_URI` esté correctamente configurado
- Verificar IP whitelist en MongoDB Atlas
- Verificar credenciales de usuario

### Error 500 en producción

- Revisar logs del servidor
- Verificar que todas las variables de entorno estén configuradas
- Verificar que JWT_SECRET esté configurado

### Rendimiento lento

- Verificar índices en MongoDB
- Habilitar caché
- Optimizar queries
- Considerar CDN para assets estáticos

## 📈 Mejoras futuras

- Implementar rate limiting
- Agregar Redis para caché
- Implementar CDN para imágenes
- Configurar CI/CD automatizado
- Agregar tests automatizados
- Implementar lazy loading de imágenes
- Agregar compresión de imágenes automática

## 📞 Soporte

Para problemas o preguntas sobre el despliegue, crear un issue en el repositorio.

---

**Importante**: Nunca commitees archivos `.env` o expongas credenciales en el código fuente.
