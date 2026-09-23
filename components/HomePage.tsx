import React, { useState, useRef, useEffect } from 'react';
import { CHARLITRON_LOGO_URL } from '../constants';
import { Zap, ChartBar, Rocket, Star, Briefcase, TrendingUp } from './icons';

interface HomePageProps {
  onStart: () => void;
  onAdminAccess: () => void;
  videoUrl: string;
}

const caseStudies = [
    { name: 'Coca-Cola', description: 'Promotoría estratégica para aumentar ventas.', link: 'https://www.charlitron.com/post/caso-de-%C3%A9xito-charlitron-coca-cola-1' },
    { name: 'OXXO', description: 'Activación con Dron publicitario nunca antes visto.', link: 'https://www.charlitron.com/post/caso-de-%C3%A9xito-charlitron-oxxo-dron-publicitario-cliente-oxxo' },
    { name: 'Provident', description: 'Caravana con alto impacto para planeación y ejecución.', link: 'https://www.charlitron.com/post/caso-de-%C3%A9xito-charlitron-provident' },
    { name: 'Knorr', description: 'Campaña de posicionamiento de marca para Mi Arroz.', link: 'https://www.charlitron.com/post/caso-de-%C3%A9xito-charlitron-knorr-mi-arroz' },
    { name: 'Hellmann\'s', description: 'Campaña real para superar metas de venta.', link: 'https://www.charlitron.com/post/caso-de-%C3%A9xito-charlitron-hellmann-s-mayonesa' },
    { name: 'Wings Mask', description: 'Posicionamiento como restaurante temático con edecanes.', link: 'https://www.charlitron.com/post/caso-de-%C3%A9xito-charlitron-wings-mask' },
];

const HomePage: React.FC<HomePageProps> = ({ onStart, onAdminAccess, videoUrl }) => {
  const [logoClickCount, setLogoClickCount] = useState(0);
  const clickTimeout = useRef<number | null>(null);

  const handleLogoClick = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }

    const newClickCount = logoClickCount + 1;
    setLogoClickCount(newClickCount);

    if (newClickCount === 5) {
      onAdminAccess();
      setLogoClickCount(0);
    } else {
      clickTimeout.current = window.setTimeout(() => {
        setLogoClickCount(0);
      }, 1500); // Reset after 1.5 seconds
    }
  };

  const isYoutubeVideo = videoUrl && videoUrl.includes('youtube.com/embed');

  return (
    <div className="text-center animate-fade-in">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto">
        <div 
          className="w-24 h-24 mx-auto mb-6 cursor-pointer"
          onClick={handleLogoClick}
          title="Admin Access"
        >
          <img src={CHARLITRON_LOGO_URL} alt="Charlitron Logo" />
        </div>
        <div className="inline-block bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
          Para agencias, departamentos de marketing y negocios que buscan escalar sus ventas.
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
          Charlitron: Tu Generador de Estrategias de Marketing IA
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          El primer estratega IA que piensa como un experto en ventas, no como un robot. Obtén un plan de acción real, no plantillas.
        </p>

        {/* Credibility Section */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="inline-block bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl shadow-md p-4">
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 sm:gap-x-6 text-sm sm:text-base font-semibold text-gray-800">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span>+10 años de experiencia</span>
              </div>
              <div className="hidden sm:block text-gray-300">|</div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-500" />
                <span>20+ industrias</span>
              </div>
              <div className="hidden sm:block text-gray-300">|</div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <span>Campañas millonarias</span>
              </div>
            </div>
          </div>
          <p className="mt-6 text-base text-gray-600 leading-relaxed">
            Esta IA fue entrenada con estrategias reales en <strong>Retail, Industria, Salud y Deportes</strong> para marcas como <strong>Coca-Cola, OXXO, y Provident</strong>. No genera plantillas: crea planes de acción probados en el campo de batalla del marketing mexicano.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-xl py-4 px-8 sm:px-12 rounded-lg transition-transform transform hover:scale-105 shadow-xl shadow-amber-400/40"
          >
            GENERAR MI ESTRATEGIA
          </button>
          <a
            href="https://www.charlitron.com/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white hover:bg-gray-100 text-gray-800 font-bold py-4 px-12 rounded-lg border-2 border-gray-200 transition-colors"
          >
            VER CASOS DE ÉXITO
          </a>
        </div>
      </div>

       {/* Video Section */}
       <div className="max-w-4xl mx-auto mt-24">
         <h2 className="text-3xl font-bold text-gray-900">Ve a Charlitron en Acción</h2>
         <p className="mt-2 text-gray-600">Descubre en 90 segundos cómo transformamos datos en estrategias ganadoras.</p>
         <div className="mt-8 aspect-video w-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl border-4 border-gray-200">
          {isYoutubeVideo ? (
            <iframe
              className="w-full h-full"
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video
              className="w-full h-full object-cover"
              src={videoUrl}
              controls
              autoPlay
              muted
              loop
            >
              Tu navegador no soporta el tag de video.
            </video>
          )}
         </div>
       </div>

      {/* Feature Cards Section */}
      <div className="max-w-5xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4 mb-3">
                  <div className="bg-amber-100 p-2 rounded-full text-amber-600"><Zap className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-gray-900">Velocidad y Precisión</h3>
              </div>
              <p className="text-gray-600">Obtén en minutos un plan de acción que a una agencia tradicional le tomaría semanas.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4 mb-3">
                  <div className="bg-amber-100 p-2 rounded-full text-amber-600"><ChartBar className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-gray-900">Análisis Predictivo</h3>
              </div>
              <p className="text-gray-600">Recibe proyecciones y ROI basados en datos reales del mercado mexicano.</p>
          </div>
           <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4 mb-3">
                  <div className="bg-amber-100 p-2 rounded-full text-amber-600"><Rocket className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-gray-900">Tu Estrategia, Tu Control</h3>
              </div>
              <p className="text-gray-600">Sin mensualidades. Paga por un resultado, no por un servicio.</p>
          </div>
      </div>
      
       {/* Case Studies Section */}
      <div id="casos-exito" className="max-w-6xl mx-auto mt-24">
         <h2 className="text-3xl font-bold text-gray-900">Resultados Reales con Marcas Líderes</h2>
         <p className="mt-2 text-gray-600">Nuestra metodología ha sido probada en el campo de batalla.</p>
         <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map(study => (
                <a 
                    href={study.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    key={study.name} 
                    className="bg-white p-6 rounded-lg border border-gray-200 text-left transition-transform transform hover:-translate-y-2 hover:shadow-xl"
                >
                    <h3 className="text-2xl font-bold text-gray-900">{study.name}</h3>
                    <p className="text-gray-600 mt-2">{study.description}</p>
                    <span className="text-amber-600 font-semibold mt-4 inline-block">Ver caso completo →</span>
                </a>
            ))}
         </div>
      </div>
      
      {/* Logos Section */}
       <div className="max-w-5xl mx-auto mt-24">
         <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">UNA CREACIÓN DE</p>
         <div className="mt-6 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-gray-500 font-bold">
            <span>CHARLITRON</span>
            <span>+</span>
            <span>AMANDA B2</span>
            <span>&</span>
            <span>ALONDRA ESPACIAL</span>
         </div>
       </div>

    </div>
  );
};

export default HomePage;