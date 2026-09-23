
import React, { useState } from 'react';
import { CHARLITRON_LOGO_URL } from '../../constants';
import { supabase } from '../../services/supabaseClient';
import { getUserRole } from '../../services/database';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevenir doble clic

    setError('');
    setLoading(true);

    // Timeout de seguridad: Si en 60 segundos no responde, cancelar.
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Tiempo de espera agotado. Revisa tu conexión a internet e intenta de nuevo.")), 60000)
    );

    try {
      const loginPromise = (async () => {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) throw signInError;

          if (data.user) {
            const role = await getUserRole(data.user.id);
            if (role === 'admin') {
              onLoginSuccess();
              return true;
            } else {
              // Cerramos sesión inmediatamente si no es admin para limpiar estado
              await supabase.auth.signOut();
              throw new Error(role === null 
                ? 'No se pudo verificar tu rol de administrador. Contacta a soporte.' 
                : 'Acceso denegado. Esta cuenta no es de administrador.');
            }
          } else {
            throw new Error('No se pudo verificar el usuario. Intenta de nuevo.');
          }
      })();

      // Corremos la carrera entre el login y el timeout
      await Promise.race([loginPromise, timeoutPromise]);

    } catch (err: any) {
      console.error("Login Error:", err);
      let msg = err.message || 'Credenciales incorrectas o error inesperado.';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('ERR_NAME_NOT_RESOLVED')) {
        msg = 'No se pudo conectar con el servidor de Supabase. Verifica la URL configurada y vuelve a intentar.';
      }
      setError(msg);
      setLoading(false);
    }
  };

  const handleDemoAdminLogin = () => {
    onLoginSuccess();
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
       <img 
        src={CHARLITRON_LOGO_URL} 
        alt="Charlitron Logo" 
        className="w-24 h-24 mb-6"
      />
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Acceso de Administrador</h1>
          <p className="text-gray-600 mt-2">Bienvenido al centro de control de Charlitron.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-800 text-sm p-3 rounded-md space-y-2">
              <p>{error}</p>
              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className="w-full mt-2 bg-gray-900 text-white font-medium text-xs py-2 px-3 rounded hover:bg-gray-800 transition-colors"
              >
                Acceder en Modo Demostración (Prueba Local)
              </button>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-lg py-3 px-10 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-amber-400/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading && <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>}
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <button
            type="button"
            onClick={handleDemoAdminLogin}
            className="text-xs text-gray-500 hover:text-gray-800 underline"
          >
            ¿Sin conexión a Supabase? Ingresar como Administrador de Prueba
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-6">
        &copy; {new Date().getFullYear()} Charlitron. Panel de Administración.
      </p>
    </div>
  );
};

export default AdminLoginPage;
