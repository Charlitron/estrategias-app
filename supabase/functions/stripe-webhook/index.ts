
// @deno-types="https://esm.sh/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";
import nodemailer from "npm:nodemailer@6.9.13";

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req: Request) => {
  const signature = req.headers.get("Stripe-Signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Webhook Error: Missing signature or secret", { status: 400 });
  }

  let event;
  try {
    const body = await req.text();
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret, undefined, cryptoProvider);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Inicializar Supabase Admin
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    const userId = session.metadata?.user_id;
    const planName = session.metadata?.plan_name;
    const customerEmail = session.customer_details?.email || session.customer_email; // Obtener email real de Stripe
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
    const sessionId = session.id;

    if (userId && planName) {
        console.log(`Procesando pago verificado para: ${customerEmail}`);
        
        // 1. Guardar en Base de Datos
        const { error } = await supabaseAdmin
            .from('payments')
            .insert({
                user_id: userId,
                plan_name: planName,
                amount: amountTotal,
                status: 'verified',
                stripe_session_id: sessionId
            });

        if (error) {
            console.error('Error insertando pago en Supabase:', error);
            return new Response("Database Error", { status: 500 });
        }

        // ---------------------------------------------------------
        // 2. Notificar a Telegram (Al Admin - TÚ)
        // ---------------------------------------------------------
        try {
            const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
            const chatId = Deno.env.get('TELEGRAM_CHAT_ID');

            if (botToken && chatId) {
                const message = `
💰 <b>¡NUEVA VENTA CONFIRMADA!</b>

👤 <b>Cliente:</b> ${customerEmail}
💎 <b>Plan:</b> ${planName}
💵 <b>Monto:</b> $${amountTotal} MXN
📅 <b>Fecha:</b> ${new Date().toLocaleString('es-MX')}

<i>Charlitron System</i> 🤖
                `;
                
                await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });
                console.log("Notificación enviada a Telegram");
            }
        } catch (telegramError) {
            console.error("Error enviando a Telegram:", telegramError);
        }

        // ---------------------------------------------------------
        // 3. Enviar Correo al Cliente (Vía GMAIL SMTP - Google Workspace)
        // ---------------------------------------------------------
        try {
            const gmailPassword = Deno.env.get('GMAIL_APP_PASSWORD');
            
            if (gmailPassword && customerEmail) {
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: "ventas@charlitron.com", // Tu correo de Google Workspace
                        pass: gmailPassword, // La contraseña de aplicación de 16 dígitos
                    },
                });

                const emailHtml = `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #d97706;">¡Pago Confirmado! 🚀</h1>
                    <p>Hola,</p>
                    <p>Hemos recibido tu pago exitosamente para el <strong>Plan ${planName}</strong>.</p>
                    <p>Tu estrategia está lista para ser generada. Si cerraste la ventana, puedes regresar a la plataforma e iniciar sesión para verla.</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                      <p style="margin: 0;"><strong>Monto:</strong> $${amountTotal} MXN</p>
                      <p style="margin: 0;"><strong>Referencia:</strong> ${sessionId.slice(-8)}</p>
                    </div>
                    <p>Gracias por confiar en Charlitron.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666;">Si necesitas factura, responde a este correo con tus datos fiscales.</p>
                  </div>
                `;

                await transporter.sendMail({
                    from: '"Charlitron" <ventas@charlitron.com>',
                    to: customerEmail,
                    subject: `Confirmación de Pago - Plan ${planName}`,
                    html: emailHtml,
                });

                console.log("Correo enviado vía Gmail a:", customerEmail);
            } else {
                console.warn("Falta GMAIL_APP_PASSWORD o el email del cliente para enviar correo.");
            }
        } catch (emailError) {
            console.error("Error enviando correo Gmail:", emailError);
        }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
