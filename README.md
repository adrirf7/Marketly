# 🛍️ Marketly - E-commerce Platform

Plataforma de e-commerce moderna construida con **Astro**, **React**, **MongoDB** y **Tailwind CSS**.

## ✨ Características

- 🔐 **Autenticación JWT** - Sistema completo de registro y login
- 👤 **Gestión de perfiles** - Los usuarios pueden actualizar su información y avatar
- 🛒 **Carrito de compras** - Gestión con useContext + useReducer y persistencia en localStorage
- 🔍 **Búsqueda y filtros** - Filtrado por categoría, marca, precio y búsqueda de texto
- ⭐ **Sistema de reseñas** - Los usuarios pueden dejar reseñas en productos
- 📱 **Diseño responsive** - Funciona perfectamente en desktop y móvil
- 🎨 **UI moderna** - Interfaz elegante con Tailwind CSS

## 🚀 Instalación

### Requisitos previos

- Node.js 18+
- MongoDB (local o Atlas)
- pnpm (recomendado) o npm

### Pasos de instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd marketly
   ```

2. **Instalar dependencias**

   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Editar `.env` y configurar:

   - `MONGODB_URI`: URL de conexión a MongoDB
   - `JWT_SECRET`: Clave secreta para JWT (generar una nueva para producción)

4. **Ejecutar en modo desarrollo**

   ```bash
   pnpm dev
   ```

   La aplicación estará disponible en `http://localhost:4321`

## 🏗️ Construcción para producción

```bash
# Construir la aplicación
pnpm build

# Previsualizar la build de producción
pnpm preview

# O ejecutar directamente el servidor de producción
pnpm start
```

## 📁 Estructura del proyecto

```
marketly/
├── src/
│   ├── components/
│   │   └── react/         # Componentes React
│   ├── context/           # Context API para estado global
│   ├── hooks/             # Custom hooks
│   ├── layouts/           # Layouts de Astro
│   ├── lib/               # Utilidades (auth, db, logger)
│   ├── middleware/        # Middleware de autenticación
│   ├── models/            # Modelos de MongoDB
│   ├── pages/             # Páginas y API routes
│   │   ├── api/           # Endpoints de la API
│   │   └── product/       # Páginas de productos
│   ├── reducers/          # Reducers para estado
│   ├── styles/            # Estilos globales
│   ├── types/             # Definiciones de TypeScript
│   └── utils/             # Funciones utilitarias
├── public/                # Archivos estáticos
└── scripts/               # Scripts de desarrollo (no usados en producción)
```

## 🔑 Variables de entorno

| Variable    | Descripción                          | Ejemplo                              |
| ----------- | ------------------------------------ | ------------------------------------ |
| MONGODB_URI | URL de conexión a MongoDB            | `mongodb://localhost:27017/marketly` |
| JWT_SECRET  | Clave secreta para firmar tokens JWT | `your-secret-key-here`               |
| NODE_ENV    | Entorno de ejecución                 | `development` o `production`         |

## 🔐 Seguridad

- Las contraseñas se hashean con **bcryptjs**
- Autenticación mediante **JWT**
- Logger optimizado para producción (no expone información sensible)
- Validación de datos en backend
- Protección de rutas mediante middleware

## 🏗️ Arquitectura

- **Backend**: API REST con Node.js y Astro SSR
- **Base de datos**: MongoDB con esquemas de Mongoose
- **Frontend**: React con Astro para SSR e hidratación parcial
- **Estado global**: Context API + useReducer
- **Autenticación**: JWT con tokens en localStorage

## 🛠️ Tecnologías utilizadas

### Backend

- **Node.js** - Runtime del servidor
- **Astro 5 (SSR)** - API Routes y rendering del servidor
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas

### Frontend

- **React 19** - Biblioteca UI
- **Tailwind CSS 4** - Framework CSS
- **TypeScript** - Tipado estático

## 📝 API Endpoints

### Productos

- `GET /api/products` - Listar productos (con filtros)
- `GET /api/products/[id]` - Obtener producto por ID
- `POST /api/products` - Crear producto (requiere autenticación)
- `PUT /api/products/[id]` - Actualizar producto (requiere autenticación)
- `DELETE /api/products/[id]` - Eliminar producto (requiere autenticación)

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Usuarios

- `PUT /api/users/me` - Actualizar perfil
- `POST /api/users/me/avatar` - Subir avatar

### Reseñas

- `POST /api/products/[id]/reviews` - Agregar reseña
- `DELETE /api/products/[id]/reviews/[reviewId]` - Eliminar reseña

## 📦 Scripts disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm preview` - Previsualiza la build de producción
- `pnpm start` - Ejecuta el servidor de producción

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerir cambios o mejoras.

---

Desarrollado con ❤️ usando Astro + React + MongoDB
