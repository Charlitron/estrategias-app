import React from 'react';

interface CookieBannerProps {
  onAccept: () => void;
  onNavigate: (path: string) => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onNavigate }) => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 animate-slide-up"
      style={{ animationDuration: '0.3s' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-700 text-center sm:text-left">
          Utilizamos cookies y tecnologías similares para mejorar tu experiencia y analizar nuestro tráfico. Al continuar, aceptas nuestro uso de cookies.{' '}
          <button 
            onClick={() => onNavigate('legal/politica-cookies')} 
            className="font-semibold text-amber-600 hover:underline"
          >
            Leer más
          </button>
        </p>
        <button
          onClick={onAccept}
          className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-lg text-sm flex-shrink-0"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;