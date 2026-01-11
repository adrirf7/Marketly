import { useState, useId, useRef, useEffect } from 'react';
import { useFilters } from '../../hooks/useFilters.js';

/**
 * Componente de dropdown para filtros de ordenar y filtrar
 */
export function FilterDropdown() {
  const { filters, setFilters } = useFilters();
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);

  const minPriceFilterId = useId();
  const maxPriceFilterId = useId();
  const minDiscountFilterId = useId();
  const sortById = useId();

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutId) clearTimeout(timeoutId);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      const id = setTimeout(() => setIsOpen(false), 200);
      setTimeoutId(id);
    }
  };

  const handleToggleDropdown = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      // En desktop, permitir toggle manual además del hover
      setIsOpen(!isOpen);
    }
  };

  const handleChangeMinPrice = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      minPrice: event.target.value,
    }));
  };

  const handleChangeMaxPrice = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      maxPrice: event.target.value,
    }));
  };

  const handleChangeMinDiscount = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      minDiscount: event.target.value,
    }));
  };

  const handleChangeSortBy = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      sortBy: event.target.value,
    }));
  };

  return (
    <div 
      className="relative inline-block" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleToggleDropdown}
        className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        <span className="hidden sm:inline">Ordenar y filtrar</span>
        <span className="sm:hidden">Filtros</span>
        <svg className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay semi-transparente solo para móvil */}
          {isMobile && (
            <div 
              className="fixed inset-0 bg-gray-900/20 z-[45]" 
              onClick={() => setIsOpen(false)} 
            />
          )}

          {/* Panel de filtros */}
          <div className={`${
            isMobile 
              ? 'fixed left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl z-[50]' 
              : 'absolute top-full left-0 mt-2 w-80 z-50'
          } bg-white shadow-xl border border-gray-200 overflow-hidden`}>
            
            {/* Header móvil */}
            {isMobile && (
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Filtros y Ordenación</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className={`${isMobile ? 'max-h-[calc(85vh-120px)] overflow-y-auto' : ''} p-4 space-y-4`}>
              {/* Ordenar */}
              <div>
                <label htmlFor={sortById} className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  id={sortById}
                  onChange={handleChangeSortBy}
                  value={filters.sortBy}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none cursor-pointer bg-white"
                >
                  <option value="default">Por defecto</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="rating-desc">Mejor valorados</option>
                  <option value="name-asc">Nombre: A-Z</option>
                  <option value="name-desc">Nombre: Z-A</option>
                  <option value="discount-desc">Mayor descuento</option>
                </select>
              </div>

              {/* Rango de Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de precio
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id={minPriceFilterId}
                    min="0"
                    max="3000"
                    placeholder="Mín"
                    onChange={handleChangeMinPrice}
                    value={filters.minPrice}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    id={maxPriceFilterId}
                    min="0"
                    max="3000"
                    placeholder="Máx"
                    onChange={handleChangeMaxPrice}
                    value={filters.maxPrice}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Descuento Mínimo */}
              <div>
                <label htmlFor={minDiscountFilterId} className="block text-sm font-medium text-gray-700 mb-2">
                  Descuento mínimo: {filters.minDiscount}%
                </label>
                <input
                  type="range"
                  id={minDiscountFilterId}
                  min="0"
                  max="100"
                  step="5"
                  onChange={handleChangeMinDiscount}
                  value={filters.minDiscount}
                  className="w-full accent-black"
                />
              </div>
            </div>

            {/* Footer móvil con botón aplicar */}
            {isMobile && (
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Aplicar filtros
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
