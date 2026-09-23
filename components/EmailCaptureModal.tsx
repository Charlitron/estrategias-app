import React, { useState } from 'react';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  onNavigate: (path: string) => void;
}

const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({ isOpen, onClose, onSubmit, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && hasAcceptedTerms) {
      onSubmit(email);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">¡Excelente elección!</h2>
          <p className="text-gray-600 mt-2">¿A qué correo te enviaremos el acceso una vez confirmado tu pago?</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="lead-email" className="sr-only">Correo electrónico</label>
            <input
              type="email"
              name="email"
              id="lead-email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="tu@email.com"
              autoFocus
            />
          </div>
          
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={hasAcceptedTerms}
              onChange={(e) => setHasAcceptedTerms(e.target.checked)}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="terms" className="ml-3 block text-xs text-gray-600">
              He leído y acepto los{' '}
              <button type="button" onClick={() => onNavigate('/legal/terminos-condiciones')} className="font-medium text-amber-600 hover:underline focus:outline-none">
                  Términos y Condiciones
              </button>
              {' '}y la{' '}
              <button type="button" onClick={() => onNavigate('/legal/aviso-privacidad')} className="font-medium text-amber-600 hover:underline focus:outline-none">
                  Política de Privacidad
              </button>
              .
            </label>
          </div>

          <button
            type="submit"
            disabled={!hasAcceptedTerms}
            className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-lg py-3 px-10 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-amber-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
          >
            Continuar al pago
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-4">No te enviaremos spam. Solo lo necesario para tu estrategia.</p>
      </div>
    </div>
  );
};

export default EmailCaptureModal;