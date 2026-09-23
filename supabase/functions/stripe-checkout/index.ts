
// @deno-types="https://esm.sh/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || Deno.env.get('STRIPE_API_KEY');
    
    if (!STRIPE_SECRET_KEY) {
       return new Response(JSON.stringify({ error: "Error de Configuración: Falta la clave secreta de Stripe." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400, 
      });
    }

    const { planName, planPrice, customerEmail, siteUrl, userId } = await req.json();

    if (!siteUrl || !planName || !planPrice || !customerEmail || !userId) {
      return new Response(JSON.stringify({ error: "Faltan datos requeridos (userId, plan, etc)." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    let cleanSiteUrl = siteUrl;
    if (cleanSiteUrl.endsWith('/')) {
        cleanSiteUrl = cleanSiteUrl.slice(0, -1);
    }

    // Creamos la sesión con METADATOS. Esto es clave para el Webhook.
    // success_url incluye session_id para validación rápida en frontend
    const params = new URLSearchParams({
      'customer_email': customerEmail,
      'payment_method_types[0]': 'card',
      'line_items[0][price_data][currency]': 'mxn',
      'line_items[0][price_data][product_data][name]': `Plan ${planName} - Charlitron`,
      'line_items[0][price_data][product_data][description]': `Acceso al generador de estrategias IA.`,
      'line_items[0][price_data][unit_amount]': String(Math.round(planPrice * 100)),
      'line_items[0][quantity]': '1',
      'mode': 'payment',
      'success_url': `${cleanSiteUrl}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${cleanSiteUrl}?payment_cancelled=true`,
      'metadata[user_id]': userId,      // <--- IMPORTANTE: Vincula el pago al usuario en Stripe
      'metadata[plan_name]': planName   // <--- IMPORTANTE: Guardamos qué compró
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const stripeSession = await response.json();

    if (!response.ok) {
      throw new Error(stripeSession.error?.message || 'Error al comunicarse con Stripe.');
    }

    return new Response(JSON.stringify({ checkoutUrl: stripeSession.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
    
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
