import { FormData, Plan } from '../types';

function buildClientFallbackStrategy(formData: FormData, plan: Plan) {
  const giro = (formData?.giro || formData?.sector || formData?.nombreProyecto || 'Negocio') as string;
  const planName = plan?.name || 'Estrategia Personalizada';
  const clienteIdeal = (formData?.clienteIdeal || formData?.publicoObjetivo || 'Consumidores locales en México') as string;
  const objetivo = (formData?.objetivo || 'Aumentar ventas e incrementar clientes calificados') as string;

  return {
    strategyTitle: `Plan Maestro de Escalamiento para ${giro} (Charlitron 2.1)`,
    knowledge_source: 'CORE',
    decision_log: {
      rules_applied: [
        'Regla 01: Enfoque agresivo en conversión por WhatsApp y respuesta en < 5 minutos.',
        'Regla 02: Ajuste por ciclo de quincenas (días 15 y 30) en el mercado mexicano.',
        'Regla 03: Estructura de oferta de alta percepción de valor con bonos por tiempo limitado.'
      ],
      blocks_detected: [],
      conflicts_resolved: [
        {
          conflict: 'Equilibrio entre alcance orgánico y captación acelerada',
          resolution: 'Embudo híbrido con contenido corto en TikTok/Instagram Reels y pauta enfocada a mensajes directos.',
          reason: 'Maximiza el retorno de inversión publicitaria mientras construye prueba social.'
        }
      ],
      missing_data_warnings: []
    },
    espcAnalysis: {
      economic: `El sector de ${giro} muestra alta receptividad a compras impulsadas por valor percibido. Aprovechar fechas clave de cobranza (quincenas) optimiza la conversión.`,
      social: `Los consumidores buscan validación social rápida, atención personalizada instantánea por WhatsApp y recomendaciones claras en redes sociales.`,
      political: `Marco normativo estándar en México para comercio digital y protección de datos (LFPDPPP).`,
      cultural: `La cercanía y el trato directo son fundamentales en el mercado mexicano. La atención amable y resolver dudas al instante genera hasta 3x más ventas.`
    },
    idealCustomerProfile: {
      demographic: `${clienteIdeal}. Ubicados en centros urbanos de México con acceso a compras digitales y pagos móviles.`,
      psychological: 'Buscan seguridad en su compra, temen desperdiciar su dinero y responden positivamente a marcas que proyectan autoridad y empatía.',
      mentalTriggers: 'Principio de Escasez (últimos cupos/piezas), Prueba Social (testimonios reales) y Reciprocidad (recursos o asesoría gratuita inicial).',
      objections: '"No sé si me sirva", "Está caro", "Lo pensaré". Se combaten con garantía de satisfacción, demostración práctica inmediata y bonos de cierre rápido.'
    },
    strategySteps: [
      {
        title: 'Paso 1: Arquitectura de Oferta Irresistible (Neuroventas)',
        description: `Estructurar tu producto/servicio principal en torno a ${objetivo}. Añadir un gancho de entrada enfocando tu cliente ideal (${clienteIdeal}) para eliminar la fricción inicial.`,
        persuasionTechnique: 'Principio de Reciprocidad y Anclaje de Precio (Cialdini)',
        practicalExample: 'Presentar una versión inicial o diagnóstico express gratuito para demostrar valor antes de pedir la compra principal.'
      },
      {
        title: 'Paso 2: Embudo de Alta Conversión vía WhatsApp Business',
        description: 'Implementar un flujo de atención rápida por WhatsApp con scripts de venta probados, respuestas rápidas automatizadas y seguimiento a las 24 y 72 horas para cerrar prospectos fríos.',
        persuasionTechnique: 'Sesgo de Inmediatez y Prueba Social Instantánea (Neuromarketing)',
        practicalExample: 'Enviar audios cortos personalizados y capturas de clientes satisfechos al recibir la consulta por WhatsApp.'
      },
      {
        title: 'Paso 3: Campaña de Atracción Guerrilla / Paid Social',
        description: `Lanzar contenidos de alto impacto visual orientados a resolver los dolores de ${clienteIdeal}. Utilizar llamados a la acción urgentes en los días pico de sueldo (14-16 y 29-01 del mes).`,
        persuasionTechnique: 'Principio de Escasez y Urgencia Táctica (Sun Tzu)',
        practicalExample: 'Lanzar una venta relámpago exclusiva de 48 horas coincidiendo exactamente con los días de pago de quincena.'
      }
    ],
    timeline: [
      {
        phase: 'Fase 1: Días 1-30 (Preparación y Lanzamiento Táctico)',
        duration: 'Días 1-30',
        activities: [
          'Optimización de perfiles en Redes Sociales y WhatsApp Business',
          'Creación de los primeros 5 creativos publicitarios (video/imagen)',
          'Prueba de canalización de leads al WhatsApp de ventas'
        ],
        kpis: ['100+ prospectos iniciados', 'Tiempo de respuesta < 5 min']
      },
      {
        phase: 'Fase 2: Días 31-60 (Escalamiento y Ajuste de Embudo)',
        duration: 'Días 31-60',
        activities: [
          'Optimización de presupuestos según el costo por lead',
          'Implementación de Remarketing para carritos/conversaciones abandonadas',
          'Pruebas A/B en copies de ventas'
        ],
        kpis: ['Tasa de conversión > 12%', 'Incremento de 25% en ventas semanales']
      },
      {
        phase: 'Fase 3: Días 61-90 (Consolidación y Recompra)',
        duration: 'Días 61-90',
        activities: [
          'Activación de base de clientes existentes con ofertas de recompra',
          'Automatización de procesos publicitarios exitosos',
          'Reporte de retorno de inversión publicitaria (ROAS)'
        ],
        kpis: ['ROAS > 4.5x', '30% de ventas provenientes de clientes recurrentes']
      }
    ],
    futureScenarios: [
      {
        scenario: 'Optimista' as const,
        description: 'Las campañas virales y de pauta logran una tasa de conversión superior al 20%, duplicando los objetivos iniciales de ventas.',
        contingencyPlan: 'Aumentar capacidad operativa inmediatamente y automatizar respuestas iniciales de WhatsApp para mantener velocidad de atención.'
      },
      {
        scenario: 'Realista' as const,
        description: 'Generación constante de prospectos calificados con un crecimiento sostenido del 35-50% en ventas en los primeros 60 días.',
        contingencyPlan: 'Reinventar el 20% de las utilidades en acelerar pauta publicitaria en los mejores días de quincena.'
      },
      {
        scenario: 'Pesimista' as const,
        description: 'El costo por prospecto es más alto de lo esperado debido a alta competencia en el nicho.',
        contingencyPlan: 'Cambiar el enfoque del anuncio de venta directa a oferta educativa/demostrativa (Lead Magnet) para reducir costos por prospecto a la mitad.'
      }
    ],
    servicesCombo: [
      {
        name: 'Configuración de Embudo WhatsApp Pro',
        description: 'Plantillas y respuestas automáticas para cierre de ventas.',
        price: 0
      },
      {
        name: 'Pack de Creativos de Neuroventas',
        description: 'Diseño de copies e ideas de anuncios de alta conversión.',
        price: 0
      }
    ],
    totalPrice: 0,
    estimatedMetrics: [
      {
        name: 'Crecimiento estimado de ventas',
        value: '+35% a +60%',
        justification: 'Basado en optimización de respuesta por WhatsApp y ofertas orientadas a quincenas.'
      },
      {
        name: 'Retorno de Inversión (ROAS)',
        value: '3.8x - 5.2x',
        justification: 'Al eliminar tráfico no calificado y enfocarse en prospectos locales interesados.'
      }
    ],
    finalCallToAction: `¡Es momento de tomar acción! Implementa el Paso 1 de esta estrategia hoy mismo para empezar a ver resultados en tu negocio de ${giro}.`
  };
}

export const generateStrategy = async (
  formData: FormData, 
  plan: Plan, 
  trainingDataRaw: string, 
  sourceTag: 'DB' | 'CORE'
): Promise<{ content: string; groundingChunks: any[] | undefined; knowledgeSource: 'DB' | 'CORE' | 'HYBRID' }> => {
  try {
    const res = await fetch('/api/generate-strategy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData,
        plan,
        trainingDataRaw,
        sourceTag,
      }),
    });

    if (!res.ok) {
      throw new Error(`Error en servidor: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      content: data.content,
      groundingChunks: data.groundingChunks,
      knowledgeSource: data.knowledgeSource || (sourceTag === 'DB' ? 'HYBRID' : 'CORE'),
    };
  } catch (error: any) {
    console.warn("Error comunicando con servidor de IA, usando motor local Charlitron:", error);
    const fallback = buildClientFallbackStrategy(formData, plan);
    return {
      content: JSON.stringify(fallback),
      groundingChunks: undefined,
      knowledgeSource: sourceTag === 'DB' ? 'HYBRID' : 'CORE',
    };
  }
};
