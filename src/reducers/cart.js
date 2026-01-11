/**
 * Estado inicial del carrito
 * Se recupera del localStorage si existe
 */
export const cartInitialState = typeof window !== "undefined" ? JSON.parse(window.localStorage.getItem("cart")) || [] : [];

/**
 * Tipos de acciones disponibles para el carrito
 */
export const CART_ACTION_TYPES = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  CLEAR_CART: "CLEAR_CART",
  DECREASE_QUANTITY: "DECREASE_QUANTITY",
};

/**
 * Actualiza el localStorage con el estado actual del carrito
 * @param {Array} state - Estado actual del carrito
 */
export const updateLocalStorage = (state) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("cart", JSON.stringify(state));
  }
};

/**
 * Mapeo de acciones con sus correspondientes funciones de actualización
 */
const UPDATE_STATE_BY_ACTION = {
  /**
   * Añade un producto al carrito o incrementa su cantidad
   */
  [CART_ACTION_TYPES.ADD_TO_CART]: (state, action) => {
    const productId = action.payload._id || action.payload.id;
    const productInCartIndex = state.findIndex((item) => (item._id || item.id) === productId);

    if (productInCartIndex >= 0) {
      // Producto ya existe, incrementar cantidad usando spread operator
      const newState = [
        ...state.slice(0, productInCartIndex),
        {
          ...state[productInCartIndex],
          quantity: state[productInCartIndex].quantity + 1,
        },
        ...state.slice(productInCartIndex + 1),
      ];

      updateLocalStorage(newState);
      return newState;
    }

    // Producto nuevo, añadir con cantidad 1
    const newState = [
      ...state,
      {
        ...action.payload,
        quantity: 1,
      },
    ];

    updateLocalStorage(newState);
    return newState;
  },

  /**
   * Elimina un producto completamente del carrito
   */
  [CART_ACTION_TYPES.REMOVE_FROM_CART]: (state, action) => {
    const productId = action.payload._id || action.payload.id;
    const newState = state.filter((item) => (item._id || item.id) !== productId);
    updateLocalStorage(newState);
    return newState;
  },

  /**
   * Vacía completamente el carrito
   */
  [CART_ACTION_TYPES.CLEAR_CART]: () => {
    updateLocalStorage([]);
    return [];
  },

  /**
   * Decrementa la cantidad de un producto o lo elimina si queda en 1
   */
  [CART_ACTION_TYPES.DECREASE_QUANTITY]: (state, action) => {
    const productId = action.payload._id || action.payload.id;
    const productInCartIndex = state.findIndex((item) => (item._id || item.id) === productId);

    if (productInCartIndex >= 0) {
      const currentQuantity = state[productInCartIndex].quantity;

      // Si solo queda 1, eliminar el producto
      if (currentQuantity === 1) {
        const newState = state.filter((item) => (item._id || item.id) !== productId);
        updateLocalStorage(newState);
        return newState;
      }

      // Decrementar cantidad
      const newState = [
        ...state.slice(0, productInCartIndex),
        {
          ...state[productInCartIndex],
          quantity: currentQuantity - 1,
        },
        ...state.slice(productInCartIndex + 1),
      ];

      updateLocalStorage(newState);
      return newState;
    }

    return state;
  },
};

/**
 * Reducer principal del carrito
 * @param {Array} state - Estado actual del carrito
 * @param {Object} action - Acción a ejecutar con type y payload
 * @returns {Array} Nuevo estado del carrito
 */
export const cartReducer = (state, action) => {
  const { type: actionType } = action;
  const updateState = UPDATE_STATE_BY_ACTION[actionType];
  return updateState ? updateState(state, action) : state;
};
