import { createContext, useState } from 'react';

export const FiltersContext = createContext();

/**
 * Provider del contexto de filtros
 * Maneja el estado de los filtros de productos
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export function FiltersProvider({ children }) {
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 0,
    maxPrice: 3000,
    brand: null,
    search: '',
    minDiscount: 0,
    fastShipping: false,
    sortBy: 'default',
  });

  return (
    <FiltersContext.Provider
      value={{
        filters,
        setFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}
