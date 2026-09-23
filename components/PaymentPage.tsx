
import React, { useState, useEffect, useRef } from 'react';
import { Plan, User } from '../types';
import { ArrowLeft, ShieldCheck, CreditCard, QrCode } from './icons';
import { createStripeCheckoutSession } from '../services/database';

interface PaymentPageProps {
  plan: Plan;
  user: User;
  onBack: () => void;
  onPaymentSuccess: () => void; // Para flujo manual QR / Dev
}

const QR_CODE_IMAGE_URL = 'https://suusxdmjdrhcfimbkasy.supabase.co/storage/v1/object/public/public_assets/qr-bbva.jpg';

const PaymentPage: React.FC<PaymentPageProps> = ({ plan, user, onBack, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qr'>('card');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stripeCheckoutUrl, setStripeCheckoutUrl] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] = useState('Copiar Enlace');
  const [paymentLinkGenerated, setPaymentLinkGenerated] = useState(false);
  const [qrImageError, setQrImageError] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);

  // Secret bypass for development/testing
  const [secretClickCount, setSecretClickCount] = useState(0);
  const secretClickTimeout = useRef<number | null>(null);

  const handlePay = async () => {
    setError(null);
    setIsLoading(true);

    if (!hasAcceptedTerms) {
      setError("Debes aceptar los Términos y Condiciones y la Política de Privacidad.");
      setIsLoading(false);
      return;
    }

    try {
        if (!user.email) {
            throw new Error("No se pudo obtener tu correo electrónico para el pago.");
        }
        // IMPORTANTE: Pasamos el ID del usuario para que Stripe lo vincule
        const sessionData = await createStripeCheckoutSession(plan.name, plan.price, user.email, user.id);
        if (sessionData && sessionData.checkoutUrl) {
            setStripeCheckoutUrl(sessionData.checkoutUrl);
            setPaymentLinkGenerated(true); 
            // En modo normal, redirigimos automáticamente para evitar pasos extra
            if (!isDevMode) {
                window.location.href = sessionData.checkoutUrl;
            }
        } else {
            throw new Error("No se pudo obtener la URL de pago desde el servidor.");
        }
    } catch (err: any) {
        console.error("Error en handlePay:", err);
        if (err.message && err.message.includes("500")) {
             setError("Error del servidor de pago (500). Es probable que falte configurar la 'STRIPE_SECRET_KEY' en los secretos de Supabase Edge Functions.");
        } else {
             setError(err.message || "Ocurrió un error al procesar el pago.");
        }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDevGenerate = async () => {
      // Solo visible en modo DEV
      onPaymentSuccess();
  };

  const handleCopyUrl = () => {
    if (stripeCheckoutUrl) {
        navigator.clipboard.writeText(stripeCheckoutUrl).then(() => {
            setCopyButtonText('¡Copiado!');
            setTimeout(() => setCopyButtonText('Copiar Enlace'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setError('No se pudo copiar el enlace. Por favor, cópialo manualmente.');
        });
    }
  };
  
  const handleSecretClick = () => {
    if (secretClickTimeout.current) {
      clearTimeout(secretClickTimeout.current);
    }
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);

    if (newCount >= 5) {
      setSecretClickCount(0);
      setIsDevMode(true);
      setPaymentLinkGenerated(true);
      setStripeCheckoutUrl('https://charlitron.com/dev-bypass-mode');
      setCopyButtonText('Modo Dev');
      setError(null); 
    } else {
         secretClickTimeout.current = window.setTimeout(() => {
            setSecretClickCount(0);
        }, 2000);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
       <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Volver y editar datos
      </button>

      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 select-none" title="Confirma tu compra">
        <div className="text-center mb-6 cursor-pointer" onClick={handleSecretClick}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Confirma tu compra</h1>
          <p className="text-gray-600 mt-1">Estás a un paso de generar tu estrategia.</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
           <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-amber-800">PLAN SELECCIONADO</p>
              <p className="text-xl font-bold text-gray-900">{plan.name}</p>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-gray-900">
              ${plan.price.toLocaleString('es-MX')}
              <span className="text-base font-medium text-gray-500"> MXN</span>
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Pagar con:</p>
          <div className="grid grid-cols-2 gap-2 border border-gray-200 rounded-lg p-1 bg-gray-100">
            <button
              onClick={() => { setPaymentMethod('card'); if(!isDevMode) { setPaymentLinkGenerated(false); setError(null); } }}
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors text-sm font-semibold ${
                paymentMethod === 'card' ? 'bg-white shadow-sm text-gray-800' : 'bg-transparent text-gray-500 hover:bg-white/50'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Pagar con Tarjeta
            </button>
            <button
              onClick={() => setPaymentMethod('qr')}
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors text-sm font-semibold ${
                paymentMethod === 'qr' ? 'bg-white shadow-sm text-gray-800' : 'bg-transparent text-gray-500 hover:bg-white/50'
              }`}
            >
              <QrCode className="w-5 h-5" />
              Pagar con Código QR
            </button>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="mt-6 animate-fade-in">
            {!paymentLinkGenerated ? (
              <>
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
                    He leído y acepto los Términos y Condiciones y la Política de Privacidad.
                  </label>
                </div>
                <button
                  onClick={handlePay}
                  disabled={!hasAcceptedTerms || isLoading}
                  className="w-full mt-6 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-lg py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Redirigiendo a Stripe...' : 'Pagar y Continuar'}
                </button>
              </>
            ) : (
                <div className={`mt-6 p-4 rounded-lg text-center animate-fade-in border ${isDevMode ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
                    {isDevMode ? (
                        <>
                            <p className="text-sm font-bold text-yellow-800 mb-3">🔓 MODO DESARROLLADOR ACTIVADO</p>
                             <button
                                onClick={handleDevGenerate}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg py-3 rounded-lg transition-all"
                              >
                                Simular Pago y Generar
                              </button>
                        </>
                    ) : (
                        <p className="text-sm text-blue-800">Redirigiendo a pasarela de pago segura...</p>
                    )}
                </div>
            )}
            
            {error && (
              <div className="mt-4 bg-red-100 border border-red-200 text-red-800 text-sm p-3 rounded-md">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Pago seguro procesado por Stripe.
            </div>
          </div>
        )}
        
        {paymentMethod === 'qr' && (
          <div className="mt-6 text-center animate-fade-in">
            <p className="text-gray-700 mb-4">Escanea el código para realizar tu pago. Una vez completado, dale click al botón de abajo.</p>
            <div className="mx-auto rounded-lg border border-gray-200 max-w-xs w-full p-2 bg-white flex items-center justify-center min-h-[256px]">
              {qrImageError ? (
                <div className="text-sm text-red-700 bg-red-50 p-4 rounded-md">
                  <p className="font-bold mb-2">Error al cargar la imagen QR.</p>
                  <p className="font-semibold mt-3">Verifica que el bucket 'public_assets' sea público en Supabase.</p>
                </div>
              ) : (
                <img src={QR_CODE_IMAGE_URL} alt="Código QR para pago" className="w-full h-full object-contain" onError={() => setQrImageError(true)} />
              )}
            </div>
            <button
                  onClick={onPaymentSuccess}
                  className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-3 rounded-lg transition-all"
            >
                  Ya realicé el pago
            </button>
            <p className="text-xs text-gray-500 mt-2">La activación manual puede tardar hasta 24 horas en verificarse.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
