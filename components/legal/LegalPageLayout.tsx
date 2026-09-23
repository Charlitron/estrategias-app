import React, { useEffect } from 'react';
import { ArrowLeft } from '../icons';

interface LegalPageLayoutProps {
  children: React.ReactNode;
  onBack: () => void;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ children, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-gray-600 hover:text-amber-600 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la aplicación
        </button>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-gray-200">
        <article className="prose prose-lg max-w-none prose-h1:font-bold prose-h1:text-gray-900 prose-h2:font-semibold prose-h2:text-gray-800 prose-a:text-amber-600 hover:prose-a:text-amber-700">
          {children}
        </article>
      </div>
    </div>
  );
};

export default LegalPageLayout;
