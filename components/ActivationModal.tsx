import React, { useState } from 'react';
import { StrategyResult } from '../types';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
  strategyResult: StrategyResult | null;
}

const ActivationModal: React.FC<ActivationModalProps> = ({ isOpen, onClose, onSubmit, strategyResult }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!strategyResult) {
      alert("Error: No se pudo encontrar la información de la estrategia. Por favor, intenta de nuevo.");
      return;
    }

    // IMPORTANTE: Número de WhatsApp del negocio.
    const businessWhatsappNumber = '524444237092'; 

    const message = `¡Hola Charlitron! 👋\n\nQuiero activar esta estrategia:\n\n*Estrategia:* ${strategyResult.strategyTitle}\n*Inversión Total:* $${strategyResult.totalPrice.toLocaleString('es-MX')} MXN\n\nMis datos de contacto son:\n*Nombre:* ${formData.name}\n*Email:* ${formData.email}\n*Teléfono:* ${formData.phone}\n\n¡Espero su contacto para arrancar!`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${businessWhatsappNumber}&text=${encodeURIComponent(message)}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, '_blank');

    // Llamar a las funciones originales para actualizar la UI
    onSubmit(formData); // Esto muestra el mensaje de "Gracias" en la página de resultados.
    onClose(); // Esto cierra el modal.
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">¡Activemos tu estrategia!</h2>
          <p className="text-gray-600 mt-2">Un especialista se pondrá en contacto contigo para arrancar.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre completo</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              onChange={handleChange}
              className="mt-1 w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              onChange={handleChange}
              className="mt-1 w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono (WhatsApp)</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              onChange={handleChange}
              className="mt-1 w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Ej: 55 1234 5678"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-lg py-3 px-10 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-amber-400/30 mt-4"
          >
            Enviar y Activar por WhatsApp
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-4">Al enviar, serás redirigido a WhatsApp para iniciar la conversación.</p>
      </div>
    </div>
  );
};

export default ActivationModal;