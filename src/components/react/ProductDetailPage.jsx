import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Cart } from './Cart';
import { CartProvider } from '../../context/cart';
import { FiltersProvider } from '../../context/filter';
import UserMenu from './UserMenu';

// Componente de carrusel con miniaturas
const ImageGallery = ({ images, title }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <img
        src={`https://placehold.co/600x600/4c51bf/white?text=${encodeURIComponent(
          title
        )}&font=roboto`}
        alt={title}
        className="w-full h-96 object-cover rounded-lg"
      />
    );
  }

  const handleImageError = (e) => {
    e.target.src = `https://placehold.co/600x600/4c51bf/white?text=${encodeURIComponent(
      title
    )}&font=roboto`;
  };

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <img
          src={images[currentImageIndex]}
          alt={`${title} ${currentImageIndex + 1}`}
          onError={handleImageError}
          className="w-full h-full object-contain"
        />
        
        {/* Botones de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagen anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagen siguiente"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Indicador de posición */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all hover:opacity-75 ${
                index === currentImageIndex
                  ? 'border-black'
                  : 'border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const productId = window.location.pathname.split('/').pop();
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.data);
      }
    } catch (error) {
      // Error al cargar producto
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <CartProvider>
        <FiltersProvider>
          <Header onCartClick={() => setIsCartOpen(!isCartOpen)}>
            <UserMenu onLogout={handleLogout} />
          </Header>
          <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
              <p className="text-gray-600 text-lg">Cargando producto...</p>
            </div>
          </div>
          <Footer />
        </FiltersProvider>
      </CartProvider>
    );
  }

  if (!product) {
    return (
      <CartProvider>
        <FiltersProvider>
          <Header onCartClick={() => setIsCartOpen(!isCartOpen)}>
            <UserMenu onLogout={handleLogout} />
          </Header>
          <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
            <a href="/" className="text-black underline">Volver al inicio</a>
          </div>
          <Footer />
        </FiltersProvider>
      </CartProvider>
    );
  }

  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <CartProvider>
      <FiltersProvider>
        <Header onCartClick={() => setIsCartOpen(!isCartOpen)}>
          <UserMenu onLogout={handleLogout} />
        </Header>
        <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <a href="/" className="text-gray-500 hover:text-black">Inicio</a>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galería de imágenes */}
            <div>
              <ImageGallery images={product.images} title={product.title} />
            </div>

            {/* Información del producto */}
            <div>
              {product.brand && (
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {product.brand}
                </p>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Precio */}
              <div className="mb-6">
                {hasDiscount ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-red-600">
                      ${discountedPrice}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-bold rounded">
                      -{product.discountPercentage.toFixed(0)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`w-5 h-5 ${
                        index < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews?.length || 0} reseñas)
                </span>
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Descripción</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Especificaciones */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Especificaciones</h2>
                <div className="space-y-3">
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peso:</span>
                      <span className="font-medium">{product.weight}g</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensiones:</span>
                      <span className="font-medium">
                        {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} cm
                      </span>
                    </div>
                  )}
                  {product.warrantyInformation && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Garantía:</span>
                      <span className="font-medium">{product.warrantyInformation}</span>
                    </div>
                  )}
                  {product.shippingInformation && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Envío:</span>
                      <span className="font-medium">{product.shippingInformation}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reseñas */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reseñas de clientes</h2>

            {/* Lista de reseñas */}
            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, index) => (
                  <div key={review._id || index} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {review.reviewerName}
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, starIndex) => (
                            <svg
                              key={starIndex}
                              className={`w-4 h-4 ${
                                starIndex < review.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay reseñas todavía
                </p>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </FiltersProvider>
    </CartProvider>
  );
}
