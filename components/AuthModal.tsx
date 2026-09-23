import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Google } from './icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const translateError = (err: any): string => {
    const rawMsg = err?.error_description || err?.message || err?.toString() || '';
    if (rawMsg.includes('Invalid login credentials')) {
      return 'Correo o contraseña incorrectos. Si te acabas de registrar, por favor confirma tu correo desde tu bandeja de entrada.';
    }
    if (rawMsg.includes('Email not confirmed')) {
      return 'Debes confirmar tu correo electrónico antes de ingresar. Por favor revisa tu bandeja de entrada o la carpeta de spam.';
    }
    if (rawMsg.includes('User already registered') || rawMsg.includes('already exists')) {
      return 'Este correo electrónico ya está registrado. Por favor cambia a la pestaña "Iniciar Sesión".';
    }
    if (rawMsg.includes('Password should be at least')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (rawMsg.includes('rate limit') || rawMsg.includes('Rate limit')) {
      return 'Demasiados intentos en poco tiempo. Por favor espera un par de minutos antes de volver a intentarlo.';
    }
    if (rawMsg.includes('Failed to fetch') || rawMsg.includes('NetworkError')) {
      return 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.';
    }
    return rawMsg || 'Ocurrió un error. Por favor verifica tus datos e intenta de nuevo.';
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const cleanEmail = email.trim();

    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: window.location.href.split('?')[0],
        });
        if (error) throw error;
        setMessage('Te hemos enviado un correo con instrucciones para restablecer tu contraseña. Revisa tu bandeja de entrada y spam.');
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password
        });
        if (error) throw error;
        
        // Supabase returns user with empty identities if email is already registered
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError('Este correo ya está registrado en Charlitron. Por favor cambia a "Iniciar Sesión".');
        } else {
          setMessage('¡Registro exitoso! Te enviamos un enlace de confirmación a tu correo. Por favor verifícalo para iniciar sesión.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (error) throw error;
        // On success, App.tsx onAuthStateChange handles closing modal and state
      }
    } catch (err: any) {
      setError(translateError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href.split('?')[0],
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(translateError(err));
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setMessage(null);
    setLoading(false);
    setEmail('');
    setPassword('');
    setMode('login');
    onClose();
  };
  
  const handleModeChange = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    setError(null);
    setMessage(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative animate-slide-up">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {mode === 'forgot' ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h2>
            <p className="text-sm text-gray-600 mb-6">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
          </div>
        ) : (
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              type="button"
              onClick={() => handleModeChange('login')}
              className={`flex-1 py-2 text-center font-semibold transition-colors ${mode === 'login' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Iniciar Sesión
            </button>
            <button 
              type="button"
              onClick={() => handleModeChange('signup')}
              className={`flex-1 py-2 text-center font-semibold transition-colors ${mode === 'signup' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Registrarse
            </button>
          </div>
        )}
        
        <form onSubmit={handleAuthAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="tu@email.com"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password-auth" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleModeChange('forgot')}
                    className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password-auth"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 pr-10 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>
          )}
          
          {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-md">{error}</p>}
          {message && <p className="text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-md">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-lg py-3 rounded-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading && <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>}
            {loading 
              ? 'Procesando...' 
              : mode === 'forgot'
              ? 'Enviar correo de recuperación'
              : mode === 'login' 
              ? 'Iniciar Sesión' 
              : 'Crear Cuenta'}
          </button>
        </form>

        {mode === 'forgot' ? (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Volver a Iniciar Sesión
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">O</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
            >
              <Google className="w-5 h-5"/>
              {loading ? 'Redirigiendo...' : 'Continuar con Google'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;