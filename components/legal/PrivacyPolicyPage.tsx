import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <h1>AVISO DE PRIVACIDAD INTEGRAL</h1>
      <p className="lead text-gray-600">Última actualización: 25 de octubre de 2025</p>

      <h2>I. IDENTIDAD Y DOMICILIO DEL RESPONSABLE</h2>
      <ul>
        <li><strong>Responsable:</strong> Charlitron</li>
        <li><strong>Domicilio:</strong> Lanzagorta 330, San Luis Potosí, México</li>
        <li><strong>Correo electrónico:</strong> <a href="mailto:ventas@charlitron.com">ventas@charlitron.com</a></li>
        <li><strong>Sitio web:</strong> <a href="https://charlitron.com" target="_blank" rel="noopener noreferrer">charlitron.com</a></li>
      </ul>

      <h2>II. DATOS PERSONALES QUE RECABAMOS</h2>
      <p>Recabamos las siguientes categorías de datos personales:</p>
      <p><strong>a) Datos de identificación:</strong></p>
      <ul>
        <li>Nombre completo</li>
        <li>Correo electrónico</li>
        <li>Teléfono (opcional)</li>
      </ul>
      <p><strong>b) Datos comerciales:</strong></p>
      <ul>
        <li>Nombre de negocio</li>
        <li>Giro comercial</li>
        <li>Ciudad de operación</li>
        <li>Presupuesto de marketing</li>
        <li>Objetivos comerciales</li>
      </ul>
      <p><strong>c) Datos financieros:</strong></p>
      <ul>
        <li>Datos de pago (procesados por Stripe/MercadoPago, no almacenados por nosotros)</li>
        <li>Historial de transacciones</li>
      </ul>
      <p><strong>d) Datos técnicos:</strong></p>
      <ul>
        <li>Dirección IP</li>
        <li>Tipo de navegador y dispositivo</li>
        <li>Cookies y localStorage</li>
        <li>Interacciones con la plataforma</li>
      </ul>

      <h2>III. FINALIDADES DEL TRATAMIENTO</h2>
      <p><strong>FINALIDADES PRIMARIAS (necesarias para el servicio):</strong></p>
      <ol>
        <li>Generar estrategias de marketing personalizadas mediante inteligencia artificial</li>
        <li>Procesar pagos y emitir comprobantes fiscales</li>
        <li>Gestionar su cuenta de usuario</li>
        <li>Proporcionar soporte técnico y atención al cliente</li>
        <li>Cumplir con obligaciones fiscales y legales</li>
      </ol>
      <p><strong>FINALIDADES SECUNDARIAS (opcionales, puede oponerse):</strong></p>
      <ol>
        <li>Mejorar algoritmos de IA mediante análisis agregado de datos</li>
        <li>Enviar comunicaciones comerciales sobre nuevas funcionalidades</li>
        <li>Realizar estudios estadísticos y de mercado</li>
        <li>Personalizar la experiencia del usuario</li>
      </ol>
      <p>Si no desea que sus datos sean tratados para finalidades secundarias, puede manifestarlo a: <a href="mailto:ventas@charlitron.com">ventas@charlitron.com</a></p>

      <h2>IV. TRANSFERENCIA DE DATOS PERSONALES</h2>
      <p>Sus datos personales pueden ser transferidos y tratados por terceros ubicados dentro y fuera de México:</p>
      <p><strong>Nacionales:</strong></p>
      <ul>
        <li>MercadoPago - Procesamiento de pagos</li>
      </ul>
      <p><strong>Internacionales:</strong></p>
      <ul>
        <li>Supabase Inc. (Estados Unidos) - Almacenamiento de base de datos</li>
        <li>Google LLC (Estados Unidos) - Procesamiento de inteligencia artificial</li>
        <li>Stripe Inc. (Estados Unidos) - Procesamiento de pagos</li>
      </ul>
      <p>Todas las transferencias se realizan bajo contratos de protección de datos que garantizan el nivel de protección requerido por la legislación mexicana.</p>

      <h2>V. DERECHOS ARCO Y REVOCACIÓN DEL CONSENTIMIENTO</h2>
      <p>Usted tiene derecho a:</p>
      <ul>
        <li><strong>Acceder</strong> a sus datos personales que poseemos</li>
        <li><strong>Rectificar</strong> datos inexactos o incompletos</li>
        <li><strong>Cancelar</strong> el uso de sus datos cuando considere que no se requieren</li>
        <li><strong>Oponerse</strong> al tratamiento de sus datos para fines específicos</li>
      </ul>
      <p>Para ejercer sus derechos ARCO, debe enviar solicitud a:</p>
      <ul>
        <li><strong>Correo electrónico:</strong> <a href="mailto:ventas@charlitron.com">ventas@charlitron.com</a></li>
        <li><strong>Domicilio:</strong> Lanzagorta 330, San Luis Potosí, México</li>
      </ul>
      <p><strong>Plazo de respuesta:</strong> 20 días hábiles<br />
      <strong>Información requerida:</strong></p>
      <ul>
        <li>Nombre completo</li>
        <li>Correo electrónico registrado</li>
        <li>Descripción clara del derecho a ejercer</li>
        <li>Documentos que acrediten su identidad</li>
      </ul>
      <p>Asimismo, puede revocar el consentimiento otorgado para el tratamiento de sus datos personales en cualquier momento.</p>

      <h2>VI. COOKIES Y TECNOLOGÍAS DE RASTREO</h2>
      <p>Utilizamos las siguientes tecnologías:</p>
      <p><strong>Cookies esenciales:</strong></p>
      <ul>
        <li>Autenticación de sesión</li>
        <li>Carrito de compra</li>
        <li>Preferencias de usuario</li>
      </ul>
      <p><strong>Cookies analíticas:</strong></p>
      <ul>
        <li>Google Analytics (tráfico y comportamiento)</li>
        <li>Métricas de rendimiento</li>
      </ul>
      <p><strong>LocalStorage:</strong></p>
      <ul>
        <li>Conocimiento de entrenamiento de IA</li>
        <li>Configuraciones personalizadas</li>
        <li>Cache temporal</li>
      </ul>
      <p>Puede configurar su navegador para rechazar cookies, aunque esto puede limitar algunas funcionalidades del servicio.</p>

      <h2>VII. MEDIDAS DE SEGURIDAD</h2>
      <p>Implementamos medidas de seguridad técnicas, físicas y administrativas para proteger sus datos personales contra daño, pérdida, alteración, destrucción o acceso no autorizado.</p>

      <h2>VIII. CAMBIOS AL AVISO DE PRIVACIDAD</h2>
      <p>Nos reservamos el derecho de efectuar modificaciones o actualizaciones al presente aviso de privacidad. Las modificaciones estarán disponibles en: charlitron.com/legal/aviso-privacidad</p>
    </>
  );
};

export default PrivacyPolicyPage;
