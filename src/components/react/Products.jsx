import {
  AddToCartIcon,
  RemoveFromCartIcon,
  FullStarIcon,
  HalfStarIcon,
  EmptyStarIcon,
} from './Icons.jsx';
import { useCart } from '../../hooks/useCart.js';
import { useEffect, useState } from 'react';
import { ImageCarousel } from './ImageCarousel.jsx';

/**
 * Componente de calificación por estrellas
 */
const StarRating = ({ rating, reviewCount }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FullStarIcon key={i} />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<HalfStarIcon key={i} />);
    } else {
      stars.push(<EmptyStarIcon key={i} />);
    }
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex gap-0.5">{stars}</div>
      <span className="text-sm text-gray-600">({reviewCount})</span>
    </div>
  );
};

/**
 * Componente principal de lista de productos
 */
export function Products({
  products,
  openCart,
  currentPage,
  setCurrentPage,
  productsPerPage,
}) {
  const { addToCart, removeFromCart, cart } = useCart();

  const checkProductInCart = (product) => {
    const productId = product._id || product.id;
    return cart.some((item) => (item._id || item.id) === productId);
  };

  // Calcular productos a mostrar
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Scroll al inicio al cambiar de página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleProductClick = (productId) => {
    window.location.href = `/product/${productId}`;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentProducts.map((product) => {
          const isProductInCart = checkProductInCart(product);
          const discountedPrice = (
            product.price *
            (1 - product.discountPercentage / 100)
          ).toFixed(2);
          
          const hasDiscount = product.discountPercentage > 0;
          const isFastShipping = product.shippingInformation?.toLowerCase().includes('overnight') || 
                                 product.shippingInformation?.toLowerCase().includes('1-2 business days');

          return (
            <article
              key={product._id || product.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 flex flex-col group"
            >
              <div
                className="cursor-pointer"
                onClick={() => handleProductClick(product._id || product.id)}
              >
                <ImageCarousel
                  images={product.images}
                  title={product.title}
                  onImageClick={() => handleProductClick(product._id || product.id)}
                />
                
                <div className="p-3">
                  {product.brand && (
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {product.brand}
                    </div>
                  )}
                  
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem] mb-2">
                    {product.title}
                  </h3>

                  <div className="mb-2">
                    {hasDiscount ? (
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-xl font-bold text-red-600">
                          ${discountedPrice}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                          -{product.discountPercentage.toFixed(0)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <StarRating
                    rating={product.rating}
                    reviewCount={product.reviews?.length || 0}
                  />
                  
                  {isFastShipping && (
                    <div className="mt-2">
                      <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                        </svg>
                        Envío rápido
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 pt-0 mt-auto">
                <button
                  className={`w-full py-2.5 px-4 rounded-md font-medium transition-all duration-200 text-sm ${
                    isProductInCart
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isProductInCart) {
                      removeFromCart(product);
                    } else {
                      addToCart(product);
                      openCart();
                    }
                  }}
                >
                  {isProductInCart ? 'Eliminar del carrito' : 'Añadir al carrito'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Anterior
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Siguiente
          </button>
        </div>
      )}
    </main>
  );
}
