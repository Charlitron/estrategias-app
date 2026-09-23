import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { savePaymentRecord } from '../services/database';

interface PaymentSuccessPageProps {
  user: User | null;
  onPaymentSuccess: () => void;
}

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ user, onPaymentSuccess }) => {
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const intentString = localStorage.getItem('charlitron_payment_intent');
        if (!intentString) {
          throw new Error("No se encontró la intención de pago. Si ya pagaste, contacta a soporte.");
        }

        const intent = JSON.parse(intentString);

        if (!user || user.id !== intent.userId) {
          throw new Error("La sesión del usuario no coincide con la intención de pago. Por favor, inicia sesión de nuevo.");
        }

        // Save the payment record to the database
        // Fix: Added the missing 'amount' argument to the 'savePaymentRecord' function call.
        const paymentSaved = await savePaymentRecord(user.id, intent.planName, intent.planPrice);
        if (!paymentSaved) {
            throw new Error("Hubo un problema al registrar tu pago en nuestro sistema. Por favor, contacta a soporte con tu comprobante de pago.");
        }

        // Cleanup and proceed
        localStorage.removeItem('charlitron_payment_intent');
        setVerificationStatus('success');

        // Redirect after a delay
        setTimeout(() => {
          onPaymentSuccess();
        }, 3000);

      } catch (error: any) {
        setErrorMessage(error.message);
        setVerificationStatus('error');
      }
    };

    verifyPayment();
  }, [user, onPaymentSuccess]);

  const renderContent = () => {
    switch (verificationStatus) {
        case 'verifying':
            return (
                <>
                    <h1 className="text-3xl font-bold text-gray-900 mt-6">Verificando tu Pago...</h1>
                    <p className="text-gray-600 mt-3">Estamos confirmando tu compra. Por favor, espera un momento.</p>
                    <div className="mt-8">
                        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                </>
            );
        case 'success':
            return (
                 <>
                    <div className="w-20 h-20 bg-green-100 text-green-500 mx-auto rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mt-6">¡Pago Exitoso!</h1>
                    <p className="text-gray-600 mt-3">Tu pago ha sido procesado y verificado correctamente. Gracias por tu confianza.</p>
                    <p className="text-gray-600 mt-2">En un momento serás redirigido al formulario para generar tu estrategia.</p>
                </>
            );
        case 'error':
             return (
                <>
                    <div className="w-20 h-20 bg-red-100 text-red-500 mx-auto rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mt-6">Error de Verificación</h1>
                    <p className="text-red-700 bg-red-50 p-4 rounded-md mt-3">{errorMessage}</p>
                </>
            );
    }
  }


  return (
    <div className="max-w-lg mx-auto text-center bg-white p-10 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
      {renderContent()}
    </div>
  );
};

export default PaymentSuccessPage;
