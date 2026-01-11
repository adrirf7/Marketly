// Tipos para productos
export interface Product {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  reviews: Review[];
  returnPolicy?: string;
  minimumOrderQuantity: number;
  images: string[];
  thumbnail: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Review {
  rating: number;
  comment: string;
  date: Date | string;
  reviewerName: string;
  reviewerEmail: string;
}

// Tipos para usuarios
export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRegister {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  error?: string;
}

// Tipos para el carrito
export interface CartItem extends Product {
  quantity: number;
}

// Tipos para filtros
export interface Filters {
  category: string;
  maxPrice: number;
  brand: string;
  search: string;
}

// Tipos para respuestas API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  usingMongoDB?: boolean;
}
