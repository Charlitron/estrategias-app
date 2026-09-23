import React, { useState, useEffect } from 'react';
import { Plan, FormField } from '../../types';

interface EditPlanModalProps {
  isOpen: boolean;
  plan: Plan;
  onClose: () => void;
  onSave: (plan: Plan) => void;
}

const EditPlanModal: React.FC<EditPlanModalProps> = ({ isOpen, plan, onClose, onSave }) => {
  const [formData, setFormData] = useState<Plan>(plan);

  useEffect(() => {
    setFormData(plan);
  }, [plan]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleFormFieldChange = (index: number, field: keyof FormField, value: string) => {
    const newFormFields = [...formData.formFields];
    (newFormFields[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, formFields: newFormFields }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full my-8 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Editar Plan: {plan.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Plan</label>
            <input type="text" name="name" value={formData.name} readOnly className="mt-1 w-full bg-gray-100 border-gray-300 rounded-md py-2 px-3 text-gray-600 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio (MXN)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-amber-500 focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-amber-500 focus:border-amber-500" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Características</h3>
            {formData.features.map((feature, index) => (
                <input 
                    key={index}
                    type="text" 
                    value={feature} 
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-amber-500 focus:border-amber-500 mb-2" 
                />
            ))}
            {/* Functionality to add/remove features can be added here */}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Campos del Formulario</h3>
            <div className="space-y-4">
            {formData.formFields.map((field, index) => (
                <div key={index} className="p-3 border rounded-md bg-gray-50 space-y-2">
                    <input value={field.label} onChange={e => handleFormFieldChange(index, 'label', e.target.value)} className="w-full text-sm font-semibold border-gray-200 rounded-md" />
                    <input value={field.placeholder} onChange={e => handleFormFieldChange(index, 'placeholder', e.target.value)} className="w-full text-xs text-gray-600 border-gray-200 rounded-md" />
                </div>
            ))}
            </div>
             {/* Functionality to add/remove form fields can be added here */}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlanModal;
