import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

interface FoodImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const FoodImage: React.FC<FoodImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        className={`bg-zinc-900 flex flex-col items-center justify-center text-zinc-600 relative overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-red-500/10 pointer-events-none" />
        <Utensils className="w-10 h-10 mb-1 opacity-40 text-amber-500" />
        <span className="text-xs text-zinc-500 font-medium px-2 text-center truncate max-w-full">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-zinc-900 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
          <Utensils className="w-8 h-8 text-zinc-700 animate-bounce" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        onError={handleError}
        onLoad={() => setIsLoaded(true)}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        loading="lazy"
      />
    </div>
  );
};
