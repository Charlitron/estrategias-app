import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const CORE_CHARLITRON_RULES = `
- Tu nombre es CHARLITRON 2.1.
- Eres un ESTRATEGA DE NEGOCIOS Y ARQUITECTO DE VENTAS con 20 años de experiencia en psicología oscura (aplicada con ética), neuromarketing, persuasión de alto impacto (Cialdini) y estrategia militar aplicada a negocios (Sun Tzu).
- Tu misión es generar un plan de acción PERSONALIZADO, agresivo y táctico enfocado en flujo de efectivo rápido para el mercado mexicano y latinoamericano.
- Siempre utilizas el marco ESPC (Económico, Social, Político, Cultural) para entender el entorno.
- Diseñas el PERFIL DEL CLIENTE IDEAL analizando miedos profundos, deseos reprimidos, gatillos mentales clave y cómo derribar sus objeciones principales.
- Estructuras la ESTRATEGA EN PASOS TÁCTICOS especificando la Acción Concreta, la Técnica de Persuasión utilizada y un Ejemplo Práctico de aplicación real.
- Diseñas un CRONOGRAMA TÁCTICO A 90 DÍAS dividido en 3 fases de 30 días con actividades clave y KPIs cuantificables.
- Si el presupuesto es bajo, priorizas Guerrilla Marketing, Redes Orgánicas y conversión directa por WhatsApp.
- Si el presupuesto es alto, priorizas Omnicanalidad, Paid Social y Escalamiento acelerado.
- Hablas con seguridad, autoridad de mentor senior, pragmatismo y cero teoría genérica.
- Reglas Éticas: Usas psicología del consumidor y persuasión avanzada siempre con ética, promoviendo el valor real del negocio sin manipulación dañina.
`;

const jsonSchemaForPrompt = `{
  "strategyTitle": "Título potente (<10 palabras).",
  "knowledge_source": "Indica 'DB' si usaste datos externos o 'CORE' si solo usaste tu ADN.",
  "decision_log": {
      "rules_applied": ["Lista de reglas activadas (especialmente las 'Hard Rules' si las hubo)."],
      "blocks_detected": ["Condiciones de bloqueo encontradas."],
      "conflicts_resolved": [{"conflict": "...", "resolution": "...", "reason": "..."}],
      "missing_data_warnings": ["Avisos si falta info."]
  },
  "espcAnalysis": {
    "economic": "Contexto económico actual y poder adquisitivo.",
    "social": "Tendencias sociales y necesidades emocionales.",
    "political": "Contexto político y regulaciones legales.",
    "cultural": "Factores culturales y hábitos de consumo locales."
  },
  "idealCustomerProfile": {
    "demographic": "Edad, ubicación, nivel socioeconómico.",
    "psychological": "Miedos, deseos profundos, patrones de compra.",
    "mentalTriggers": "Gatillos mentales clave (escasez, urgencia, prueba social, etc.).",
    "objections": "Objeciones principales y estrategia ética para superarlas."
  },
  "strategySteps": [
    { 
      "title": "Paso 1: [Nombre del paso]", 
      "description": "Acción concreta y ejecutable.",
      "persuasionTechnique": "Técnica de persuasión específica (Neuromarketing, Cialdini o Sun Tzu).",
      "practicalExample": "Ejemplo práctico de aplicación real."
    },
    { 
      "title": "Paso 2: [Nombre del paso]", 
      "description": "Acción concreta y ejecutable.",
      "persuasionTechnique": "Técnica de persuasión específica.",
      "practicalExample": "Ejemplo práctico de aplicación real."
    },
    { 
      "title": "Paso 3: [Nombre del paso]", 
      "description": "Acción concreta y ejecutable.",
      "persuasionTechnique": "Técnica de persuasión específica.",
      "practicalExample": "Ejemplo práctico de aplicación real."
    }
  ],
  "timeline": [
    { "phase": "Fase 1: Días 1-30", "duration": "Días 1-30", "activities": ["Actividad 1", "Actividad 2", "Actividad 3"], "kpis": ["KPI 1", "KPI 2"] },
    { "phase": "Fase 2: Días 31-60", "duration": "Días 31-60", "activities": ["Actividad 1", "Actividad 2", "Actividad 3"], "kpis": ["KPI 1", "KPI 2"] },
    { "phase": "Fase 3: Días 61-90", "duration": "Días 61-90", "activities": ["Actividad 1", "Actividad 2", "Actividad 3"], "kpis": ["KPI 1", "KPI 2"] }
  ],
  "futureScenarios": [
     { "scenario": "Optimista", "description": "Si todo sale bien (ingresos e impacto).", "contingencyPlan": "Plan de aceleración." },
     { "scenario": "Realista", "description": "Resultados normales esperados.", "contingencyPlan": "Plan de optimización constante." },
     { "scenario": "Pesimista", "description": "Si ocurren bloqueos o baja conversión.", "contingencyPlan": "Plan de contingencia táctico." }
  ],
  "servicesCombo": [
    { "name": "Servicio o Paquete Recomendado", "description": "Qué incluye detalladamente.", "price": 0 }
  ],
  "totalPrice": 0,
  "estimatedMetrics": [
    { "name": "Métrica", "value": "...", "justification": "..." }
  ],
  "finalCallToAction": "Llamado a la acción inspirador como mentor de negocios."
}`;

function buildFallbackStrategy(formData: any, plan: any) {
  const giro = formData?.giro || formData?.sector || formData?.nombreProyecto || 'Negocio';
  const planName = plan?.name || 'Estrategia Personalizada';
  const clienteIdeal = formData?.clienteIdeal || formData?.publicoObjetivo || 'Consumidores locales en México';
  const presupuesto = formData?.presupuesto || 'Flexible';
  const objetivo = formData?.objetivo || 'Aumentar ventas e incrementar clientes calificados';

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
        scenario: 'Optimista',
        description: 'Las campañas virales y de pauta logran una tasa de conversión superior al 20%, duplicando los objetivos iniciales de ventas.',
        contingencyPlan: 'Aumentar capacidad operativa inmediatamente y automatizar respuestas iniciales de WhatsApp para mantener velocidad de atención.'
      },
      {
        scenario: 'Realista',
        description: 'Generación constante de prospectos calificados con un crecimiento sostenido del 35-50% en ventas en los primeros 60 días.',
        contingencyPlan: 'Reinvertir el 20% de las utilidades en acelerar pauta publicitaria en los mejores días de quincena.'
      },
      {
        scenario: 'Pesimista',
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", engine: "Charlitron 2.1" });
  });

  app.post("/api/generate-strategy", async (req, res) => {
    try {
      const { formData, plan, trainingDataRaw, sourceTag } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

      if (!apiKey) {
        console.warn("API Key de Gemini no encontrada en el servidor. Generando estrategia con motor alternativo Charlitron.");
        const fallback = buildFallbackStrategy(formData, plan);
        return res.json({
          content: JSON.stringify(fallback),
          groundingChunks: undefined,
          knowledgeSource: sourceTag === 'DB' ? 'HYBRID' : 'CORE'
        });
      }

      const formDetails = Object.entries(formData || {})
        .map(([key, value]) => `- ${key}: ${value || 'No especificado'}`)
        .join('\n');

      const currentDate = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      const dynamicKnowledge = trainingDataRaw 
        ? `
REGLAS INQUEBRANTABLES (OBLIGATORIAS):
- Todo contenido marcado como "Regla de Bloqueo" o "Hard Rule" es LEY ABSOLUTA.
- No sugerir alternativas si una regla bloquea una acción.

CASOS DE ÉXITO (REFERENCIA):
- Usar solo como analogía contextual, nunca como justificación si contradicen reglas.

PRINCIPIOS Y METODOLOGÍAS:
- Aplicar solo si no violan reglas duras.

BASE DE CONOCIMIENTO:
${trainingDataRaw}
`
        : `
MODO SUPERVIVENCIA:
No se cargó conocimiento externo. Usa solo CORE.
`;

      const prompt = `
        INSTRUCCIONES MAESTRAS DE IDENTIDAD:
        ${CORE_CHARLITRON_RULES}
        
        ==============================================
        CONTEXTO Y CONOCIMIENTO ESPECÍFICO:
        HOY ES: ${currentDate}
        ${dynamicKnowledge}

        ==============================================
        DATOS DEL PROYECTO ACTUAL:
        - Plan: ${plan?.name || 'General'}
        - Información Proporcionada:
        ${formDetails}

        ==============================================
        MISIÓN:
        Fusiona tu criterio experto con las reglas anteriores. Si hay 'Hard Rules' en la base externa, cúmplelas a rajatabla.
        Responde estrictamente en JSON en español.
        \`\`\`json
        ${jsonSchemaForPrompt}
        \`\`\`
      `;

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.6,
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      return res.json({
        content: responseText,
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
        knowledgeSource: sourceTag === 'DB' ? 'DB' : 'CORE'
      });

    } catch (error: any) {
      console.error("Error al generar con Gemini API:", error);
      const fallback = buildFallbackStrategy(req.body?.formData, req.body?.plan);
      return res.json({
        content: JSON.stringify(fallback),
        groundingChunks: undefined,
        knowledgeSource: 'CORE'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
