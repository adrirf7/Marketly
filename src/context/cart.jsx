import { useReducer, createContext } from 'react';
import { cartReducer, cartInitialState } from '../reducers/cart.js';

export const CartContext = createContext();

/**
 * Hook personalizado para manejar el reducer del carrito
 * @returns {Object} Estado y funciones para manipular el carrito
 */
function useCartReducer() {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);

  const addToCart = (product) =>
    dispatch({
      type: 'ADD_TO_CART',
      payload: product,
    });

  const removeFromCart = (product) =>
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: product,
    });

  const decreaseQuantity = (product) =>
    dispatch({
      type: 'DECREASE_QUANTITY',
      payload: product,
    });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return { state, addToCart, removeFromCart, decreaseQuantity, clearCart };
}

/**
 * Provider del contexto del carrito
 * Proporciona acceso al estado del carrito y sus funciones
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export function CartProvider({ children }) {
  const { state, addToCart, removeFromCart, decreaseQuantity, clearCart } =
    useCartReducer();

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
