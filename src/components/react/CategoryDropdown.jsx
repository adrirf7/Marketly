import { useState, useRef, useEffect, useId } from 'react';
import { useFilters } from '../../hooks/useFilters.js';

/**
 * Componente de dropdown para categorías con submenú de marcas
 */
export function CategoryDropdown() {
  const { filters, setFilters } = useFilters();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategoryForMobile, setSelectedCategoryForMobile] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const dropdownRef = useRef(null);
  const categoryFilterId = useId();
  const [isMobile, setIsMobile] = useState(false);

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
        setHoveredCategory(null);
        setSelectedCategoryForMobile(null);
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
      const id = setTimeout(() => {
        setIsOpen(false);
        setHoveredCategory(null);
      }, 200);
      setTimeoutId(id);
    }
  };

  const handleToggleDropdown = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
      setSelectedCategoryForMobile(null);
    } else {
      // En desktop, permitir toggle manual además del hover
      setIsOpen(!isOpen);
    }
  };

  const handleChangeCategory = (category, brand = null) => {
    setFilters((prevState) => ({
      ...prevState,
      category: category,
      brand: brand,
    }));
    setIsOpen(false);
    setHoveredCategory(null);
    setSelectedCategoryForMobile(null);
  };

  const handleCategoryClickMobile = (category) => {
    if (category.brands.length > 0) {
      setSelectedCategoryForMobile(category.value);
    } else {
      handleChangeCategory(category.value, null);
    }
  };

  const categories = [
    { 
      value: 'all', 
      label: 'Todas las categorías',
      brands: []
    },
    { 
      value: 'beauty', 
      label: 'Belleza',
      brands: ['Chic Cosmetics', 'Essence', 'Glamour Beauty', 'Nail Couture', 'Velvet Touch']
    },
    { 
      value: 'fragrances', 
      label: 'Fragancias',
      brands: ['Calvin Klein', 'Chanel', 'Dior', 'Dolce & Gabbana', 'Gucci']
    },
    { 
      value: 'furniture', 
      label: 'Muebles',
      brands: ['Annibale Colombo', 'Bath Trends', 'Furniture Co.', 'Knoll']
    },
    { 
      value: 'groceries', 
      label: 'Comestibles',
      brands: ['Daily Harvest', 'Fresh Farms', 'Green Market', 'Nature Valley', 'Organic Select']
    },
  ];

  const currentCategory = categories.find(cat => cat.value === filters.category)?.label || 'Todas las categorías';

  return (
    <div 
      className="relative inline-block" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleToggleDropdown}
        className="flex items-center gap-0 xs:gap-0.5 md:gap-2 px-1 xs:px-1.5 sm:px-3 md:px-4 py-0.5 xs:py-1 sm:py-2 text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
      >
        <svg className="w-0 xs:w-3 sm:w-4 md:w-5 h-0 xs:h-3 sm:h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="hidden sm:inline">{currentCategory}</span>
        <span className="sm:hidden">Cat</span>
        <svg className={`w-0 xs:w-2 sm:w-3 md:w-4 h-0 xs:h-2 sm:h-3 md:h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Menú principal */}
          <div className={`${
            isMobile 
              ? 'fixed inset-x-0 bottom-0 max-h-[90vh] rounded-t-2xl z-[50] overflow-hidden w-screen' 
              : 'absolute top-full left-0 mt-2 w-56 z-50 overflow-visible'
          } bg-white shadow-xl border border-gray-200`}>
            
            {/* Header móvil */}
            {isMobile && (
              <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {selectedCategoryForMobile ? 'Selecciona una marca' : 'Selecciona una categoría'}
                </h3>
                {selectedCategoryForMobile && (
                  <button
                    onClick={() => setSelectedCategoryForMobile(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            <div className={`${isMobile ? 'max-h-[calc(90vh-80px)] overflow-y-auto' : ''} py-2`}>
              {/* Vista de marcas en móvil */}
              {isMobile && selectedCategoryForMobile ? (
                <>
                  <button
                    onClick={() => handleChangeCategory(selectedCategoryForMobile, null)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                  >
                    Todas las marcas
                  </button>
                  {categories.find(cat => cat.value === selectedCategoryForMobile)?.brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleChangeCategory(selectedCategoryForMobile, brand)}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors ${
                        filters.brand === brand ? 'bg-gray-50 font-medium text-black' : 'text-gray-700'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </>
              ) : (
                /* Lista de categorías */
                categories.map((category) => (
                  <div
                    key={category.value}
                    className="relative"
                    onMouseEnter={() => !isMobile && setHoveredCategory(category.value)}
                    onMouseLeave={() => !isMobile && setHoveredCategory(null)}
                  >
                    <button
                      onClick={() => isMobile ? handleCategoryClickMobile(category) : handleChangeCategory(category.value, null)}
                      className={`w-full text-left px-4 py-2 md:py-2 text-sm hover:bg-gray-100 transition-colors flex items-center justify-between ${
                        filters.category === category.value ? 'bg-gray-50 font-medium text-black' : 'text-gray-700'
                      }`}
                    >
                      {category.label}
                      {category.brands.length > 0 && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>

                    {/* Submenú de marcas - solo desktop */}
                    {!isMobile && hoveredCategory === category.value && category.brands.length > 0 && (
                      <div 
                        className="absolute left-full top-0 ml-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[60]"
                      >
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                          Marcas
                        </div>
                        <button
                          onClick={() => handleChangeCategory(category.value, null)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-gray-700"
                        >
                          Todas las marcas
                        </button>
                        {category.brands.map((brand) => (
                          <button
                            key={brand}
                            onClick={() => handleChangeCategory(category.value, brand)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                              filters.brand === brand ? 'bg-gray-50 font-medium text-black' : 'text-gray-700'
                            }`}
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
