import React, { useState, useEffect } from 'react';
import { Plan, FormData } from '../types';
import { ArrowLeft } from './icons';

interface FormPageProps {
  plan: Plan;
  onBack: () => void;
  onSubmit: (formData: FormData, plan: Plan) => void;
  isLoading: boolean;
  initialData: FormData | null;
}

const FormPage: React.FC<FormPageProps> = ({ plan, onBack, onSubmit, isLoading, initialData }) => {
  const [formData, setFormData] = useState<FormData>(initialData || {});
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pre-fill form if initialData exists
    if(initialData) {
        setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'number' ? (value ? parseFloat(value) : undefined) : value,
    }));
     if (value.trim()) {
      setError('');
    }
  };

  const totalSteps = plan.formFields.length;
  const currentField = plan.formFields[currentStep];

  const handleNext = () => {
    if (!formData[currentField.id]) {
      setError(`Por favor, completa el campo "${currentField.label}".`);
      return;
    }
    setError('');
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // This is the last step, so submit the form
      onSubmit(formData, plan);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Volver a los planes
        </button>
        
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-8">
                <p className="text-amber-600 font-semibold">PLAN SELECCIONADO: {plan.name}</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cuéntanos sobre tu negocio</h1>
                <p className="text-gray-600 mt-2">Paso {currentStep + 1} de {totalSteps}</p>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                <div 
                    className="bg-amber-400 h-2 rounded-full transition-all duration-300 ease-in-out" 
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>

            <div className="space-y-6 min-h-[220px]">
                <div key={currentField.id} className="animate-slide-in-left">
                    <label htmlFor={currentField.id} className="block text-lg font-semibold text-gray-800 mb-3 text-center">
                        {currentField.label}
                    </label>
                    {currentField.type === 'textarea' ? (
                        <textarea
                            id={currentField.id}
                            rows={4}
                            className="w-full border border-gray-300 rounded-md py-3 px-4 text-lg focus:ring-amber-500 focus:border-amber-500"
                            placeholder={currentField.placeholder}
                            onChange={handleChange}
                            value={(formData[currentField.id] as string) || ''}
                            autoFocus
                        />
                    ) : (
                        <input
                            id={currentField.id}
                            type={currentField.type}
                            className="w-full border border-gray-300 rounded-md py-3 px-4 text-lg focus:ring-amber-500 focus:border-amber-500"
                            placeholder={currentField.placeholder}
                            onChange={handleChange}
                            value={(formData[currentField.id] as string | number) || ''}
                            step={currentField.type === 'number' ? 'any' : undefined}
                            autoFocus
                        />
                    )}
                </div>
            </div>
            
            {error && (
                <div className="bg-red-100 border border-red-200 text-red-800 text-sm p-3 rounded-md my-4">
                    {error}
                </div>
            )}

            <div className="pt-4 flex justify-between items-center">
                <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Atrás
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                    className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-lg py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-amber-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading 
                        ? 'Guardando...' 
                        : (currentStep === totalSteps - 1 ? 'Guardar y Continuar' : 'Siguiente')}
                </button>
            </div>
        </div>
    </div>
  );
};

export default FormPage;
