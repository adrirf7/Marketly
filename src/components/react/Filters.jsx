import { useId } from 'react';
import { useFilters } from '../../hooks/useFilters.js';

/**
 * Componente de filtros para productos
 * Permite filtrar por precio, categoría, marca, búsqueda, envío, descuento y ordenar
 */
export function Filters() {
  const { filters, setFilters } = useFilters();

  const minPriceFilterId = useId();
  const maxPriceFilterId = useId();
  const categoryFilterId = useId();
  const brandFilterId = useId();
  const searchFilterId = useId();
  const minDiscountFilterId = useId();
  const fastShippingId = useId();
  const sortById = useId();

  const handleChangeMinPrice = (event) => {
    const value = event.target.value;
    setFilters((prevState) => ({
      ...prevState,
      minPrice: value,
    }));
  };

  const handleChangeMaxPrice = (event) => {
    const value = event.target.value;
    setFilters((prevState) => ({
      ...prevState,
      maxPrice: value,
    }));
  };

  const handleChangeCategory = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      category: event.target.value,
    }));
  };

  const handleChangeBrand = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      brand: event.target.value,
    }));
  };

  const handleChangeSearch = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      search: event.target.value,
    }));
  };

  const handleChangeMinDiscount = (event) => {
    const value = event.target.value;
    setFilters((prevState) => ({
      ...prevState,
      minDiscount: value,
    }));
  };

  const handleToggleFastShipping = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      fastShipping: event.target.checked,
    }));
  };

  const handleChangeSortBy = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      sortBy: event.target.value,
    }));
  };

  return (
    <section className="flex flex-wrap items-center gap-3 px-3 py-4">
      {/* Búsqueda */}
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          id={searchFilterId}
          placeholder="Buscar productos..."
          onChange={handleChangeSearch}
          value={filters.search}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Categoría */}
      <div className="flex items-center gap-2">
        <label
          htmlFor={categoryFilterId}
          className="text-xs font-medium text-gray-700 whitespace-nowrap"
        >
          Categoría:
        </label>
        <select
          id={categoryFilterId}
          onChange={handleChangeCategory}
          value={filters.category}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none cursor-pointer bg-white"
        >
          <option value="all">Todas</option>
          <option value="beauty">Belleza</option>
          <option value="fragrances">Fragancias</option>
          <option value="furniture">Muebles</option>
          <option value="groceries">Comestibles</option>
        </select>
      </div>

      {/* Rango de Precio */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-700 whitespace-nowrap">
          Precio:
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            id={minPriceFilterId}
            min="0"
            max="3000"
            placeholder="Mín"
            onChange={handleChangeMinPrice}
            value={filters.minPrice}
            className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
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
            className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Descuento Mínimo */}
      <div className="flex items-center gap-2">
        <label
          htmlFor={minDiscountFilterId}
          className="text-xs font-medium text-gray-700 whitespace-nowrap"
        >
          Descuento:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            id={minDiscountFilterId}
            min="0"
            max="100"
            step="5"
            onChange={handleChangeMinDiscount}
            value={filters.minDiscount}
            className="w-24 accent-black"
          />
          <span className="text-xs text-gray-600 w-10">
            {filters.minDiscount}%
          </span>
        </div>
      </div>

      {/* Envío Rápido */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={fastShippingId}
          onChange={handleToggleFastShipping}
          checked={filters.fastShipping}
          className="w-4 h-4 accent-black cursor-pointer"
        />
        <label
          htmlFor={fastShippingId}
          className="text-xs font-medium text-gray-700 whitespace-nowrap cursor-pointer"
        >
          Envío rápido
        </label>
      </div>

      {/* Ordenar */}
      <div className="flex items-center gap-2">
        <label
          htmlFor={sortById}
          className="text-xs font-medium text-gray-700 whitespace-nowrap"
        >
          Ordenar:
        </label>
        <select
          id={sortById}
          onChange={handleChangeSortBy}
          value={filters.sortBy}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none cursor-pointer bg-white"
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
    </section>
  );
}