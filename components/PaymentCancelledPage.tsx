import React from 'react';
import { ArrowLeft } from './icons';

interface PaymentCancelledPageProps {
  onGoToPlans: () => void;
}

const PaymentCancelledPage: React.FC<PaymentCancelledPageProps> = ({ onGoToPlans }) => {
  return (
    <div className="max-w-lg mx-auto text-center bg-white p-10 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
      <div className="w-20 h-20 bg-red-100 text-red-500 mx-auto rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mt-6">Pago Cancelado</h1>
      <p className="text-gray-600 mt-3">
        Parece que has cancelado el proceso de pago. No se ha realizado ningún cargo.
      </p>
      <p className="text-gray-600 mt-2">
        Si fue un error, puedes volver e intentarlo de nuevo.
      </p>
      <button
        onClick={onGoToPlans}
        className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
      >
        <ArrowLeft className="w-5 h-5"/>
        Volver a los Planes
      </button>
    </div>
  );
};

export default PaymentCancelledPage;
