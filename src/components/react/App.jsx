import { useState, useEffect } from 'react';
import { Products } from './Products.jsx';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { Cart } from './Cart.jsx';
import { CartProvider } from '../../context/cart.jsx';
import { FiltersProvider } from '../../context/filter.jsx';
import { useFilters } from '../../hooks/useFilters.js';

/**
 * Componente Home que contiene la lógica principal
 */
function Home({ isCartOpen, setIsCartOpen }) {
  const { filterProducts } = useFilters();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productsPerPage = 20;

  // Cargar productos desde la API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?limit=100');
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.error || 'Error al cargar productos');
        }
      } catch (err) {
        setError('Error de conexión al cargar productos');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = filterProducts(products);

  // Resetear a página 1 cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts.length]);

  if (loading) {
    return (
      <>
        <Header onCartClick={() => setIsCartOpen(!isCartOpen)} />
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
        <Header onCartClick={() => setIsCartOpen(!isCartOpen)} />
        <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md px-4">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar productos</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Asegúrate de que MongoDB esté corriendo y la variable MONGODB_URI esté configurada.
            </p>
            <button
              onClick={() => window.location.reload()}
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
    <>
      <Header onCartClick={() => setIsCartOpen(!isCartOpen)} />
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
 * Componente principal de la aplicación
 * Envuelve todo con los providers necesarios
 */
export function App({ initialProducts = [] }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <FiltersProvider>
        <Home
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
        />
      </FiltersProvider>
    </CartProvider>
  );
}
