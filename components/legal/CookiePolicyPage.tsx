import React from 'react';

const CookiePolicyPage: React.FC = () => {
  return (
    <>
      <h1>POLÍTICA DE COOKIES</h1>
      <p className="lead text-gray-600">Última actualización: 25 de octubre de 2025</p>

      <h2>1. ¿QUÉ SON LAS COOKIES?</h2>
      <p>
        Las cookies son pequeños archivos de texto que los sitios web que visita colocan en su dispositivo. Se utilizan ampliamente para que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
      </p>

      <h2>2. ¿CÓMO UTILIZAMOS LAS COOKIES?</h2>
      <p>
        En Charlitron, utilizamos cookies y tecnologías similares para mejorar su experiencia y la funcionalidad de nuestro servicio. A continuación, se detallan los tipos de cookies que utilizamos:
      </p>
      <ul>
        <li>
          <strong>Cookies Esenciales:</strong> Estas cookies son estrictamente necesarias para proporcionarle los servicios disponibles a través de nuestro sitio web y para utilizar algunas de sus funciones, como el acceso a áreas seguras, la gestión de su sesión de usuario y el procesamiento de pagos. Sin estas cookies, los servicios que ha solicitado no se pueden proporcionar.
        </li>
        <li>
          <strong>Cookies de Rendimiento y Analíticas:</strong> Estas cookies recopilan información que se utiliza de forma agregada para ayudarnos a comprender cómo se utiliza nuestro sitio web o qué tan efectivas son nuestras campañas de marketing, o para ayudarnos a personalizar nuestro sitio web para usted. Utilizamos Google Analytics para analizar el tráfico y el comportamiento de los usuarios.
        </li>
      </ul>
      
      <h2>3. OTRAS TECNOLOGÍAS DE SEGUIMIENTO: LOCALSTORAGE</h2>
      <p>
        Además de las cookies, utilizamos la tecnología <strong>LocalStorage</strong> del navegador. A diferencia de las cookies, LocalStorage permite almacenar mayores cantidades de datos y estos no se envían al servidor con cada solicitud. En Charlitron, lo utilizamos para:
      </p>
      <ul>
        <li>
            <strong>Guardar el conocimiento de entrenamiento de IA:</strong> La información que proporciona en la sección "Entrenamiento IA" se almacena de forma segura en el LocalStorage de su navegador para que persista entre sesiones y no tenga que volver a ingresarla.
        </li>
        <li>
            <strong>Almacenar configuraciones y preferencias:</strong> Guardamos sus ajustes y preferencias para personalizar su experiencia.
        </li>
      </ul>

      <h2>4. COOKIES DE TERCEROS</h2>
      <p>
        Utilizamos servicios de terceros que también pueden establecer cookies en su dispositivo. Estos terceros incluyen:
      </p>
      <ul>
        <li>
          <strong>Procesadores de pago (Stripe, MercadoPago):</strong> Para procesar los pagos de forma segura y prevenir fraudes.
        </li>
        <li>
          <strong>Google Analytics:</strong> Para recopilar datos estadísticos anónimos sobre el uso del sitio.
        </li>
        <li>
          <strong>Google Gemini API:</strong> El servicio de IA puede utilizar cookies o tecnologías de seguimiento para su funcionamiento interno y mejora del servicio.
        </li>
      </ul>
      <p>
        No controlamos el uso de estas cookies de terceros. Le recomendamos que revise las políticas de privacidad de estos proveedores para obtener más información.
      </p>

      <h2>5. CÓMO GESTIONAR LAS COOKIES</h2>
      <p>
        Tiene derecho a decidir si acepta o rechaza las cookies. Puede ejercer sus preferencias de cookies configurando o modificando los controles de su navegador web. Si elige rechazar las cookies, aún puede usar nuestro sitio web, aunque su acceso a algunas funcionalidades y áreas puede estar restringido. Como los medios a través de los cuales puede rechazar las cookies a través de los controles de su navegador varían de un navegador a otro, debe visitar el menú de ayuda de su navegador para obtener más información.
      </p>

      <h2>6. CAMBIOS A ESTA POLÍTICA</h2>
      <p>
        Podemos actualizar esta Política de Cookies de vez en cuando para reflejar, por ejemplo, cambios en las cookies que utilizamos o por otras razones operativas, legales o reglamentarias. Por lo tanto, le pedimos que vuelva a visitar esta Política de Cookies con regularidad para mantenerse informado sobre nuestro uso de cookies y tecnologías relacionadas.
      </p>

      <h2>7. CONTACTO</h2>
      <p>
        Si tiene alguna pregunta sobre nuestro uso de cookies u otras tecnologías, envíenos un correo electrónico a:
      </p>
      <ul>
        <li><strong>Correo electrónico:</strong> <a href="mailto:ventas@charlitron.com">ventas@charlitron.com</a></li>
      </ul>
    </>
  );
};

export default CookiePolicyPage;
