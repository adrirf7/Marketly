import { useContext } from "react";
import { FiltersContext } from "../context/filter.jsx";

/**
 * Hook personalizado para manejar filtros de productos
 * @returns {Object} Objeto con filtros actuales y funciones para filtrar
 */
export function useFilters() {
  const { filters, setFilters } = useContext(FiltersContext);

  /**
   * Filtra productos según los criterios establecidos
   * @param {Array} products - Array de productos a filtrar
   * @returns {Array} Productos filtrados y ordenados
   */
  const filterProducts = (products) => {
    // Primero filtrar
    const filtered = products.filter((product) => {
      const matchesMinPrice = product.price >= filters.minPrice;
      const matchesMaxPrice = product.price <= filters.maxPrice;
      const matchesCategory = filters.category === "all" || product.category === filters.category;
      const matchesBrand = !filters.brand || product.brand === filters.brand;
      const matchesSearch =
        filters.search === "" || product.title.toLowerCase().includes(filters.search.toLowerCase()) || product.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesDiscount = product.discountPercentage >= filters.minDiscount;

      const matchesFastShipping =
        !filters.fastShipping || product.shippingInformation?.toLowerCase().includes("overnight") || product.shippingInformation?.toLowerCase().includes("1-2 business days");

      return matchesMinPrice && matchesMaxPrice && matchesCategory && matchesBrand && matchesSearch && matchesDiscount && matchesFastShipping;
    });

    // Luego ordenar
    const sorted = [...filtered];

    switch (filters.sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "discount-desc":
        sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      default:
        // 'default' - no ordenar, mantener orden original
        break;
    }

    return sorted;
  };

  return { filters, filterProducts, setFilters };
}
