import { Plan } from './types';

export const CHARLITRON_LOGO_URL = 'https://static.wixstatic.com/media/7fb206_893f39bbcc1d4a469839dce707985bf7~mv2.png/v1/fill/w_314,h_314,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/charlitron-logo.png';

export const PLANS: Plan[] = [
  {
    name: 'Básico',
    price: 500,
    description: 'La forma más rápida de obtener una estrategia clara y un presupuesto.',
    features: [
      'Estrategia de marketing generada por IA',
      'Cotización instantánea de servicios',
      'Plan de acción claro y conciso',
      'Descargable en formato PDF',
    ],
    formFields: [
      { id: 'giro', label: 'Giro de tu negocio', type: 'text', placeholder: 'Ej: Restaurante de comida italiana, Tienda de ropa online' },
      { id: 'ciudad', label: 'Ciudad principal de operación', type: 'text', placeholder: 'Ej: Ciudad de México' },
      { id: 'objetivo', label: '¿Cuál es tu principal objetivo comercial ahora mismo?', type: 'textarea', placeholder: 'Ej: Aumentar las ventas online un 20% en 3 meses' },
      { id: 'presupuesto', label: 'Presupuesto de marketing mensual (MXN)', type: 'number', placeholder: 'Ej: 5000' },
    ],
  },
  {
    name: 'Plus',
    price: 1000,
    description: 'Ideal para negocios que buscan una guía experta y un toque personal.',
    features: [
      'Todo lo del plan Básico',
      'Diagnóstico de negocio personalizado',
      'Breve asesoría estratégica de un experto',
      'Recomendaciones de branding inicial',
    ],
    formFields: [
      { id: 'giro', label: 'Giro de tu negocio', type: 'text', placeholder: 'Ej: Restaurante de comida italiana, Tienda de ropa online' },
      { id: 'ciudad', label: 'Ciudad principal de operación', type: 'text', placeholder: 'Ej: Ciudad de México' },
      { id: 'objetivo', label: '¿Cuál es tu principal objetivo comercial ahora mismo?', type: 'textarea', placeholder: 'Ej: Aumentar las ventas online un 20% en 3 meses' },
      { id: 'presupuesto', label: 'Presupuesto de marketing mensual (MXN)', type: 'number', placeholder: 'Ej: 15000' },
      { id: 'clienteIdeal', label: 'Describe a tu cliente ideal', type: 'textarea', placeholder: 'Ej: Mujeres de 25-35 años, interesadas en moda sostenible...' },
      { id: 'canales', label: '¿Qué canales de marketing usas actualmente?', type: 'text', placeholder: 'Ej: Instagram, Facebook Ads' },
    ],
  },
  {
    name: 'Premium',
    price: 2000,
    description: 'El servicio completo con revisión humana para una estrategia impecable.',
    features: [
      'Todo lo del plan Plus',
      'Estrategia editable y colaborativa',
      'Revisión y ajuste por un estratega senior',
      'PDF con el branding de tu negocio',
    ],
    formFields: [
      { id: 'giro', label: 'Giro de tu negocio', type: 'text', placeholder: 'Ej: Restaurante de comida italiana, Tienda de ropa online' },
      { id: 'ciudad', label: 'Ciudad principal de operación', type: 'text', placeholder: 'Ej: Ciudad de México' },
      { id: 'objetivo', label: '¿Cuál es tu principal objetivo comercial ahora mismo?', type: 'textarea', placeholder: 'Ej: Aumentar las ventas online un 20% en 3 meses' },
      { id: 'presupuesto', label: 'Presupuesto de marketing mensual (MXN)', type: 'number', placeholder: 'Ej: 30000' },
      { id: 'clienteIdeal', label: 'Describe a tu cliente ideal', type: 'textarea', placeholder: 'Ej: Mujeres de 25-35 años, interesadas en moda sostenible...' },
      { id: 'canales', label: '¿Qué canales de marketing usas actualmente?', type: 'text', placeholder: 'Ej: Instagram, Facebook Ads, Google Ads, Eventos' },
      { id: 'historiaNegocio', label: 'Cuenta brevemente la historia y valores de tu negocio', type: 'textarea', placeholder: 'Lo que te hace único...' },
      { id: 'colores', label: 'Colores y estilo visual de tu marca', type: 'text', placeholder: 'Ej: Tonos tierra, minimalista, vibrante' },
      { id: 'tonoMarca', label: 'Tono de comunicación de tu marca', type: 'text', placeholder: 'Ej: Amigable, profesional, irreverente' },
    ],
  },
];