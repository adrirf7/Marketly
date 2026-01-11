import { CartIcon, ClearCartIcon, RemoveFromCartIcon } from './Icons.jsx';
import { useCart } from '../../hooks/useCart.js';

/**
 * Componente para un ítem individual del carrito
 */
function CartItem({
  thumbnail,
  price,
  title,
  quantity,
  addToCart,
  decreaseQuantity,
  removeFromCart,
}) {
  return (
    <li className="border-b border-gray-200 py-4 last:border-b-0">
      <div className="flex gap-4">
        <img
          src={thumbnail}
          alt={title}
          className="w-20 h-20 object-cover rounded-md"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <strong className="text-sm font-semibold text-gray-900 line-clamp-2">
              {title}
            </strong>
            <span className="text-lg font-bold text-indigo-600 mt-1 block">
              ${price}
            </span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
              <button
                onClick={decreaseQuantity}
                className="w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded transition-colors font-semibold"
                aria-label="Disminuir cantidad"
              >
                -
              </button>
              <span className="min-w-[2rem] text-center font-medium text-gray-900">
                {quantity}
              </span>
              <button
                onClick={addToCart}
                className="w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded transition-colors font-semibold"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            <button
              onClick={removeFromCart}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar producto"
              aria-label="Eliminar del carrito"
            >
              <RemoveFromCartIcon />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * Componente del carrito de compras
 * Muestra los productos agregados y permite modificar cantidades
 */
export function Cart({ isOpen, setIsOpen }) {
  const { cart, clearCart, addToCart, removeFromCart, decreaseQuantity } =
    useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Backdrop semitransparente */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel del carrito */}
      <aside
        className={`fixed top-0 right-0 w-screen sm:w-full sm:max-w-md h-screen max-h-screen bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header del carrito */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <CartIcon />
            Carrito
            {itemCount > 0 && (
              <span className="text-sm font-normal text-gray-600">
                ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})
              </span>
            )}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        {/* Contenido del carrito */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <CartIcon />
              <p className="mt-4 text-gray-500 text-lg">Tu carrito está vacío</p>
              <p className="mt-2 text-sm text-gray-400">
                Agrega productos para comenzar tu compra
              </p>
            </div>
          ) : (
            <ul className="py-4">
              {cart.map((product) => (
                <CartItem
                  key={product.id}
                  addToCart={() => addToCart(product)}
                  decreaseQuantity={() => decreaseQuantity(product)}
                  removeFromCart={() => removeFromCart(product)}
                  {...product}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer del carrito */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <ClearCartIcon />
                Vaciar
              </button>
              <button className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md">
                Comprar
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
