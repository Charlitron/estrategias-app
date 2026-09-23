import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Charlitron</h4>
            <p className="text-sm text-gray-600">Tu estratega de marketing IA, entrenado con experiencia real para el mercado mexicano.</p>
          </div>
           <div>
            <h4 className="font-bold text-gray-900 mb-2">Compañía</h4>
            <ul className="space-y-1">
                <li><a href="https://www.charlitron.com/blog" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-amber-600">Casos de Éxito</a></li>
                <li><a href="https://www.charlitron.com/contacto" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-amber-600">Contacto</a></li>
            </ul>
          </div>
           <div>
            <h4 className="font-bold text-gray-900 mb-2">Legal</h4>
            <ul className="space-y-1">
                <li><button onClick={() => onNavigate('legal/terminos-condiciones')} className="text-sm text-gray-600 hover:text-amber-600 text-left">Términos y Condiciones</button></li>
                <li><button onClick={() => onNavigate('legal/aviso-privacidad')} className="text-sm text-gray-600 hover:text-amber-600 text-left">Aviso de Privacidad</button></li>
                <li><button onClick={() => onNavigate('legal/politica-cookies')} className="text-sm text-gray-600 hover:text-amber-600 text-left">Política de Cookies</button></li>
                <li><button onClick={() => onNavigate('legal/uso-responsable-ia')} className="text-sm text-gray-600 hover:text-amber-600 text-left">Uso Responsable de IA</button></li>
            </ul>
          </div>
           <div>
            <h4 className="font-bold text-gray-900 mb-2">Creado por</h4>
             <ul className="space-y-1 text-sm text-gray-600">
                <li>Charlitron</li>
                <li>Amanda B2</li>
                <li>Alondra Espacial</li>
             </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-8 border-t border-gray-200 pt-6">
          &copy; {new Date().getFullYear()} Charlitron. Todos los derechos reservados. Domicilio: Lanzagorta 330, San Luis Potosí, México.
        </div>
      </div>
    </footer>
  );
};

export default Footer;