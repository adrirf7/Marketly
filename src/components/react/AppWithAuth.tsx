import { useState, useEffect } from 'react';
import { Products } from './Products.jsx';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { Cart } from './Cart.jsx';
import { CartProvider } from '../../context/cart.jsx';
import { FiltersProvider } from '../../context/filter.jsx';
import { useFilters } from '../../hooks/useFilters.js';
import AuthForm from './AuthForm';
import UserMenu from './UserMenu';
import type { Product as ProductType } from '../../types';

/**
 * Componente interno con lógica de filtros y paginación
 */
function HomeContent({ 
  isCartOpen, 
  setIsCartOpen, 
  onLogout,
  products 
}: { 
  isCartOpen: boolean; 
  setIsCartOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  products: ProductType[];
}) {
  const { filterProducts } = useFilters();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const filteredProducts = filterProducts(products);

  // Resetear a página 1 cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts.length]);

  // Calcular índices de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(!isCartOpen)}>
        <UserMenu onLogout={onLogout} />
      </Header>
      <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
      <Products
        products={filteredProducts}
        openCart={() => setIsCartOpen(true)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        productsPerPage={productsPerPage}
      />
      <Footer />
    </>
  );
}

/**
 * Componente Home que carga los productos
 */
function Home({ isCartOpen, setIsCartOpen, onLogout }: { 
  isCartOpen: boolean; 
  setIsCartOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos desde la API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products?limit=100', {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });
      const data = await response.json();
      
      console.log('API Response:', data); // Debug
      
      if (data.success && data.data) {
        console.log('Products loaded:', data.data.length); // Debug
        setProducts(data.data);
      } else {
        setError(data.error || 'Error al cargar productos');
      }
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('Error de conexión al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header onCartClick={() => setIsCartOpen(!isCartOpen)}>
          <UserMenu onLogout={onLogout} />
        </Header>
        <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando productos...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header onCartClick={() => setIsCartOpen(!isCartOpen)}>
          <UserMenu onLogout={onLogout} />
        </Header>
        <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md px-4">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar productos</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadProducts}
              className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <HomeContent
      isCartOpen={isCartOpen}
      setIsCartOpen={setIsCartOpen}
      onLogout={onLogout}
      products={products}
    />
  );
}

/**
 * Componente principal de la aplicación con autenticación
 */
export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setAuthLoading(false);
    }
  }, []);

  // Verificar token con el backend
  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  // Manejar login exitoso
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  // Manejar logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setIsAuthenticated(false);
  };

  // Mostrar loading inicial
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Mostrar formulario de autenticación
  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  // App principal con providers
  return (
    <CartProvider>
      <FiltersProvider>
        <Home
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          onLogout={handleLogout}
        />
      </FiltersProvider>
    </CartProvider>
  );
}
