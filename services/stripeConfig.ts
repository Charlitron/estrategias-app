// This file can hold Stripe related configurations.
// The secret key MUST be set as an environment variable in your Supabase project settings.
// DO NOT PASTE YOUR SECRET KEY HERE.

const STRIPE_CONFIG = {
    // IMPORTANTE: Reemplaza esta clave de prueba con tu clave pública "Live" de Stripe.
    // Tu clave pública de producción empieza con "pk_live_...".
    publishableKey: 'TU_LLAVE_PUBLICA_LIVE_DE_STRIPE_AQUI',
};

export default STRIPE_CONFIG;