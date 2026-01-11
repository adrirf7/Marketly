import { useContext } from "react";
import { CartContext } from "../context/cart.jsx";

/**
 * Hook personalizado para acceder al contexto del carrito
 * @returns {Object} Contexto del carrito con métodos y estado
 * @throws {Error} Si se usa fuera del CartProvider
 */
export const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }

  return context;
};
