import { useState, useId } from 'react';
import { CategoryDropdown } from './CategoryDropdown.jsx';
import { FilterDropdown } from './FilterDropdown.jsx';
import { MarketlyLogo, CartIcon } from './Icons.jsx';
import { useCart } from '../../hooks/useCart.js';
import { useFilters } from '../../hooks/useFilters.js';

/**
 * Componente del encabezado de la aplicación
 * Contiene dos niveles: logo/búsqueda/user/cart y categorías/filtros
 */
export function Header({ onCartClick, children }) {
  const { cart } = useCart();
  const { filters, setFilters } = useFilters();
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const searchFilterId = useId();

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleChangeSearch = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      search: event.target.value,
    }));
  };

  const handleToggleFastShipping = () => {
    setFilters((prevState) => ({
      ...prevState,
      fastShipping: !prevState.fastShipping,
    }));
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      {/* Nivel 1: Logo, Búsqueda, Usuario, Carrito */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-1 sm:px-4 py-1.5 sm:py-3">
          <div className="flex items-center gap-0 sm:gap-2 md:gap-4">
            <a href="/" className="flex-shrink-0 scale-75 sm:scale-100 origin-left">
              <MarketlyLogo />
            </a>
            
            {/* Buscador desktop - oculto en móvil */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
              <input
                type="text"
                id={searchFilterId}
                placeholder="Buscar productos..."
                onChange={handleChangeSearch}
                value={filters.search}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center gap-0 sm:gap-2 md:gap-3 ml-auto flex-shrink-0">
              {/* Botón de búsqueda móvil */}
              <button
                className="md:hidden p-0 sm:p-2.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                onClick={() => setShowSearchMobile(!showSearchMobile)}
                aria-label="Buscar"
              >
                <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {children}
              
              <button
                className="relative p-0 sm:p-2.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                onClick={onCartClick}
                aria-label="Abrir carrito"
              >
                <CartIcon />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] sm:text-xs font-bold rounded-full w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center shadow-lg">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Barra de búsqueda móvil expandible */}
          {showSearchMobile && (
            <div className="md:hidden mt-3 animate-fade-in">
              <input
                type="text"
                placeholder="Buscar productos..."
                onChange={handleChangeSearch}
                value={filters.search}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Nivel 2: Categorías, Filtros, Envío rápido */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-1 sm:px-4 py-1.5 sm:py-2 md:py-3">
          <div className="flex items-center gap-0.5 sm:gap-2 md:gap-4">
            <CategoryDropdown />
            <FilterDropdown />
            
            {/* Botón toggle de envío rápido */}
            <button
              onClick={handleToggleFastShipping}
              className={`flex items-center gap-0.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-xs md:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                filters.fastShipping
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
              </svg>
              <span className="hidden sm:inline">Envío rápido</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
