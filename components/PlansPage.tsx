import React from 'react';
import { Plan } from '../types';
import { CheckCircle, ArrowLeft } from './icons';

interface PlansPageProps {
  plans: Plan[];
  onSelectPlan: (plan: Plan) => void;
  onBack: () => void;
}

const PlansPage: React.FC<PlansPageProps> = ({ plans, onSelectPlan, onBack }) => {
  return (
    <div className="animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Volver al Inicio
        </button>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">Elige tu nivel y activa tu estrategia hoy.</h1>
        <p className="text-lg text-gray-600 mt-2">Cada plan está diseñado para una necesidad específica. Sin sorpresas.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div 
            key={plan.name} 
            className={`bg-white border-2 rounded-xl p-6 md:p-8 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.name === 'Plus' ? 'border-amber-400 shadow-amber-400/20' : 'border-gray-200'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            >
            
            {plan.name === 'Plus' && (
                <div className="text-center mb-4">
                    <span className="bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase">Más Popular</span>
                </div>
            )}
            
            <h2 className="text-3xl font-bold text-gray-900 text-center">{plan.name}</h2>
            <p className="text-5xl font-extrabold text-gray-900 text-center my-4">
              ${plan.price.toLocaleString('es-MX')}
              <span className="text-lg font-medium text-gray-500"> MXN</span>
            </p>
            <p className="text-gray-700 text-center min-h-[40px]">{plan.description}</p>
            
            <ul className="my-8 space-y-3 flex-grow">
              {plan.features.map(feature => (
                <li key={feature} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPlan(plan)}
              className={`w-full mt-auto font-bold py-3 px-6 rounded-lg text-lg transition-colors ${
                plan.name === 'Plus' 
                ? 'bg-amber-400 text-gray-900 hover:bg-amber-500' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Elegir este plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansPage;