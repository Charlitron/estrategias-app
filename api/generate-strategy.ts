import { GoogleGenAI } from '@google/genai';

type RequestLike = {
  method?: string;
  body?: {
    formData?: Record<string, unknown>;
    plan?: { name?: string; price?: number };
    trainingDataRaw?: string;
    sourceTag?: 'DB' | 'CORE';
  };
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
};

function fallbackStrategy(formData: Record<string, unknown>, plan: { name?: string; price?: number }) {
  const giro = String(formData?.giro || 'Negocio');
  const objective = String(formData?.objetivo || 'Aumentar ventas y conseguir clientes');
  const customer = String(formData?.clienteIdeal || 'Clientes locales');
  const planName = plan?.name || 'seleccionado';
  const price = Number(plan?.price) || 0;

  return {
    strategyTitle: `Plan de crecimiento para ${giro}`,
    knowledge_source: 'CORE',
    decision_log: {
      rules_applied: ['Respuesta de contingencia por indisponibilidad temporal de Gemini.'],
      blocks_detected: [],
      conflicts_resolved: [],
      missing_data_warnings: ['La estrategia fue generada con el motor de contingencia.']
    },
    espcAnalysis: {
      economic: `Priorizar acciones con retorno medible para ${giro}.`,
      social: `Comunicar beneficios claros para ${customer}.`,
      political: 'Verificar las normas aplicables al sector y a la publicidad digital.',
      cultural: 'Adaptar mensajes, canales y ofertas al contexto local.'
    },
    idealCustomerProfile: {
      demographic: customer,
      psychological: 'Busca una solución confiable y fácil de implementar.',
      mentalTriggers: 'Prueba social, claridad de beneficios y urgencia ética.',
      objections: 'Resolver dudas con demostraciones, garantías y casos reales.'
    },
    strategySteps: [
      {
        title: 'Paso 1: Definir una oferta clara',
        description: `Alinear la oferta con el objetivo: ${objective}.`,
        persuasionTechnique: 'Propuesta de valor',
        practicalExample: 'Crear una oferta de entrada con beneficio y precio visibles.'
      },
      {
        title: 'Paso 2: Activar captación directa',
        description: 'Usar el canal donde ya se encuentra el cliente ideal y medir cada contacto.',
        persuasionTechnique: 'Prueba social',
        practicalExample: 'Publicar contenido útil con llamada a WhatsApp y seguimiento rápido.'
      },
      {
        title: 'Paso 3: Medir y optimizar',
        description: 'Revisar semanalmente prospectos, conversiones y costo de adquisición.',
        persuasionTechnique: 'Optimización continua',
        practicalExample: 'Conservar los anuncios que convierten y pausar los que no generan contactos.'
      }
    ],
    timeline: [
      { phase: 'Fase 1: Días 1-30', duration: 'Días 1-30', activities: ['Definir oferta', 'Preparar canales', 'Publicar contenido'], kpis: ['20 prospectos', 'Tiempo de respuesta menor a 5 minutos'] },
      { phase: 'Fase 2: Días 31-60', duration: 'Días 31-60', activities: ['Probar mensajes', 'Dar seguimiento', 'Mejorar conversión'], kpis: ['12% de conversión', '25% más contactos calificados'] },
      { phase: 'Fase 3: Días 61-90', duration: 'Días 61-90', activities: ['Escalar lo que funciona', 'Crear recompra', 'Medir retorno'], kpis: ['ROAS positivo', 'Clientes recurrentes'] }
    ],
    futureScenarios: [
      { scenario: 'Optimista', description: 'La oferta convierte por encima de lo esperado.', contingencyPlan: 'Aumentar capacidad y presupuesto gradualmente.' },
      { scenario: 'Realista', description: 'El negocio crece de forma constante.', contingencyPlan: 'Optimizar el canal con mejor conversión.' },
      { scenario: 'Pesimista', description: 'El costo por prospecto sube.', contingencyPlan: 'Volver a contenido orgánico y ajustar la oferta.' }
    ],
    servicesCombo: [{
      name: `Generación de estrategia ${planName}`,
      description: 'Estrategia personalizada generada para tu negocio.',
      price
    }],
    totalPrice: price,
    estimatedMetrics: [{ name: 'Crecimiento estimado', value: 'Por definir', justification: 'Requiere datos reales de conversión.' }],
    finalCallToAction: 'Implementa el primer paso y mide los resultados desde hoy.'
  };
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { formData = {}, plan = {}, trainingDataRaw = '', sourceTag = 'CORE' } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      content: JSON.stringify(fallbackStrategy(formData, plan)),
      knowledgeSource: sourceTag === 'DB' ? 'HYBRID' : 'CORE'
    });
  }

  try {
    const projectDetails = Object.entries(formData)
      .map(([key, value]) => `- ${key}: ${value || 'No especificado'}`)
      .join('\n');
    const price = Number(plan.price) || 0;
    const prompt = `Genera una estrategia de negocio personalizada en JSON válido y en español.

Negocio y datos del formulario:
${projectDetails}

Plan contratado: ${plan.name || 'General'}
Precio del plan: ${price} MXN

Base de conocimiento del administrador:
${trainingDataRaw || 'No hay conocimiento externo; usa criterios generales.'}

Reglas obligatorias:
- Personaliza el contenido para el giro, ciudad, objetivo, presupuesto y cliente ideal recibidos.
- No repitas una estrategia genérica si los datos del proyecto son diferentes.
- El precio cobrado por generar esta estrategia es exactamente ${price} MXN.
- servicesCombo debe contener un solo concepto llamado Generación de estrategia ${plan.name || 'seleccionada'} con price ${price}.
- totalPrice debe ser exactamente ${price}.
- Devuelve exactamente las propiedades strategyTitle, knowledge_source, decision_log, espcAnalysis, idealCustomerProfile, strategySteps, timeline, futureScenarios, servicesCombo, totalPrice, estimatedMetrics y finalCallToAction.
- No incluyas Markdown ni texto fuera del JSON.`;

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.8, responseMimeType: 'application/json' }
    });
    const generated = JSON.parse(response.text || '{}');
    generated.servicesCombo = [{
      name: `Generación de estrategia ${plan.name || 'seleccionada'}`,
      description: 'Estrategia personalizada generada para tu negocio.',
      price
    }];
    generated.totalPrice = price;

    return res.status(200).json({
      content: JSON.stringify(generated),
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
      knowledgeSource: sourceTag === 'DB' ? 'DB' : 'CORE'
    });
  } catch (error) {
    console.error('Error al generar con Gemini en Vercel:', error);
    return res.status(200).json({
      content: JSON.stringify(fallbackStrategy(formData, plan)),
      knowledgeSource: 'CORE'
    });
  }
}
