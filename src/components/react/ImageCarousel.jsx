import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons.jsx';

/**
 * Componente de carrusel de imágenes para productos
 */
export function ImageCarousel({ images, title, onImageClick }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <img
        src={`https://placehold.co/400x300/4c51bf/white?text=${encodeURIComponent(
          title
        )}&font=roboto`}
        alt={title}
        onClick={onImageClick}
        className="w-full h-80 object-cover rounded-lg cursor-pointer"
      />
    );
  }

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (e) => {
    e.target.src = `https://placehold.co/400x300/4c51bf/white?text=${encodeURIComponent(
      title
    )}&font=roboto`;
  };

  return (
    <div className="relative group">
      <img
        src={images[currentImageIndex]}
        alt={`${title} ${currentImageIndex + 1}`}
        onError={handleImageError}
        onClick={onImageClick}
        className="w-full h-80 object-cover rounded-lg cursor-pointer"
      />
      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            onClick={handlePrevImage}
            aria-label="Imagen anterior"
          >
            <ChevronLeftIcon />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            onClick={handleNextImage}
            aria-label="Imagen siguiente"
          >
            <ChevronRightIcon />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? 'bg-white w-6'
                    : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
