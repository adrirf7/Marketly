/**
 * Componente Footer
 * Muestra información sobre el proyecto
 */
export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          E-commerce desarrollado con{' '}
          <span className="text-indigo-600">Astro</span> +{' '}
          <span className="text-indigo-600">React</span> ⚛️ +{' '}
          <span className="text-indigo-600">MongoDB</span> － <span>Adrirf7</span>
        </h4>
        <h5 className="text-sm text-gray-600">
          Shopping Cart con useContext & useReducer + Tailwind CSS
        </h5>
      </div>
    </footer>
  );
}
