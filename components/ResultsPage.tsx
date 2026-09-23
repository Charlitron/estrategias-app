
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { StrategyResult, DecisionLog } from '../types';
import ActivationModal from './ActivationModal';
import { CheckCircle, TrendingUp, Users, Clock, Star, Pencil, Zap, Dollar, Briefcase, Brain, AlertTriangle, Scale, Calendar } from './icons';
import { CHARLITRON_LOGO_URL } from '../constants';

interface ResultsPageProps {
  result: StrategyResult | null;
  isLoading: boolean;
  error: string | null;
  onRestart: () => void;
  onEdit: () => void;
  onFeedbackSubmit: (rating: number, comment: string) => void;
}

const PLAN_PRICES: Record<string, number> = {
  'Básico': 500,
  'Plus': 1000,
  'Premium': 2000,
};

const getEffectivePrice = (result: StrategyResult): number => {
  if (Number(result.totalPrice) > 0) return Number(result.totalPrice);
  return PLAN_PRICES[result.planName] || Number(result.servicesCombo?.[0]?.price) || 0;
};

const LoadingSpinner: React.FC = () => {
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Analizando tu mercado local...",
    "Consultando principios de neuroventas...",
    "Buscando tendencias actuales en la web...",
    "Identificando arquetipos de tu cliente ideal...",
    "Diseñando un embudo de conversión a medida...",
    "Calculando el Retorno de Inversión (ROI) potencial...",
    "Afinando los últimos detalles creativos..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prevStep) => (prevStep + 1) % loadingMessages.length);
    }, 2500); 

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      <h2 className="text-2xl font-bold text-gray-900 mt-6">Tu estratega IA está trabajando...</h2>
      <div className="text-gray-600 mt-2 min-h-[2.5em] flex items-center justify-center w-full max-w-sm">
        <p key={loadingStep} className="animate-fade-in">
          {loadingMessages[loadingStep]}
        </p>
      </div>
    </div>
  );
};

const ErrorDisplay: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="text-center bg-red-50 border border-red-200 p-8 rounded-lg">
    <h2 className="text-2xl font-bold text-red-800">¡Oh no! Algo salió mal.</h2>
    <p className="text-red-700 mt-2">{message}</p>
    <button
      onClick={onRetry}
      className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
    >
      Volver a empezar
    </button>
  </div>
);

const ReasoningModal: React.FC<{ isOpen: boolean; onClose: () => void; log: DecisionLog, source?: string }> = ({ isOpen, onClose, log, source }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 rounded-xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full relative animate-slide-up border border-slate-700 text-slate-100 max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                    <Brain className="w-8 h-8 text-indigo-400" />
                    <div>
                        <h2 className="text-2xl font-bold text-white">Lógica del Motor Charlitron</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                source === 'DB' ? 'bg-green-500/20 text-green-400' : 
                                source === 'HYBRID' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                                {source === 'DB' ? 'BASE DE DATOS COMPLETA' : source === 'HYBRID' ? 'HÍBRIDO (DB + CORE)' : 'ADN CORE LOCAL'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {log.conflicts_resolved && log.conflicts_resolved.length > 0 && (
                        <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-amber-500">
                             <div className="flex items-center gap-2 mb-3">
                                <Scale className="w-5 h-5 text-amber-500" />
                                <h3 className="font-bold text-amber-500 uppercase tracking-wider text-sm">Conflictos Resueltos</h3>
                            </div>
                            <div className="space-y-4">
                                {log.conflicts_resolved.map((conflict, i) => (
                                    <div key={i} className="bg-slate-900 p-3 rounded border border-slate-700">
                                        <p className="text-sm font-semibold text-white mb-1">⚡ {conflict.conflict}</p>
                                        <div className="text-xs text-slate-300">
                                            <p><span className="text-indigo-400 font-bold">Resolución:</span> {conflict.resolution}</p>
                                            <p className="mt-1"><span className="text-slate-500">Razón:</span> {conflict.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {log.blocks_detected && log.blocks_detected.length > 0 ? (
                        <div className="bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
                             <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <h3 className="font-bold text-red-500 uppercase tracking-wider text-sm">Bloqueos Detectados</h3>
                            </div>
                            <ul className="space-y-2">
                                {log.blocks_detected.map((block, i) => (
                                    <li key={i} className="text-sm text-red-200 flex items-start gap-2">
                                        <span className="mt-1">⛔</span> {block}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="bg-green-900/20 rounded-lg p-3 border border-green-800 text-center">
                            <p className="text-xs text-green-400">✅ No se detectaron bloqueos críticos.</p>
                        </div>
                    )}

                    {log.rules_applied && log.rules_applied.length > 0 && (
                         <div>
                             <h3 className="font-bold text-slate-400 uppercase tracking-wider text-xs mb-3">Reglas Aplicadas</h3>
                             <ul className="space-y-2">
                                 {log.rules_applied.map((rule, i) => (
                                     <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                         <span className="text-indigo-500 mt-1">✓</span> {rule}
                                     </li>
                                 ))}
                             </ul>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const ResultsPage: React.FC<ResultsPageProps> = ({ result, isLoading, error, onRestart, onEdit, onFeedbackSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivationSubmitted, setIsActivationSubmitted] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleDownloadPdf = async () => {
    if (!result) return;
    setIsDownloadingPdf(true);
  
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;
  
      const checkPageBreak = (contentHeight: number) => {
        if (y + contentHeight > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
      };
  
      const getImageBase64 = async (url: string): Promise<string> => {
          const response = await fetch(url);
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
          });
      };
  
      const logoBase64 = await getImageBase64(CHARLITRON_LOGO_URL);
      pdf.addImage(logoBase64, 'PNG', margin, margin, 24, 24);
  
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text('Estrategia de Marketing', pageWidth - margin, margin + 10, { align: 'right' });
      pdf.text(`Generado el: ${new Date().toLocaleDateString('es-MX')}`, pageWidth - margin, margin + 15, { align: 'right' });
  
      y = margin + 35;
      pdf.setDrawColor(230, 230, 230);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 15;
  
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(17, 24, 39);
      const titleLines = pdf.splitTextToSize(result.strategyTitle, contentWidth);
      checkPageBreak(titleLines.length * 10);
      pdf.text(titleLines, pageWidth / 2, y, { align: 'center' });
      y += titleLines.length * 10 + 5;
  
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(202, 138, 4);
      pdf.text('Tu Plan de Acción Personalizado', pageWidth / 2, y, { align: 'center' });
      y += 15;
  
      const drawSectionHeader = (title: string) => {
          checkPageBreak(20);
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(17, 24, 39);
          pdf.setFillColor(252, 211, 77);
          pdf.rect(margin, y - 5, 3, 8, 'F');
          pdf.text(title, margin + 5, y);
          y += 10;
      };
      
      const drawBodyText = (text: string, options: { isListItem?: boolean, size?: number } = {}) => {
          const { isListItem = false, size = 10 } = options;
          pdf.setFontSize(size);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(55, 65, 81);
          const textLines = pdf.splitTextToSize(text, contentWidth - (isListItem ? 5 : 0));
          checkPageBreak(textLines.length * (size * 0.4));
          pdf.text(textLines, margin + (isListItem ? 5 : 0), y);
          y += textLines.length * (size * 0.4) + 3;
      };
      
      const drawKeyValue = (key: string, value: string) => {
          const text = `${key}: ${value}`;
          const lines = pdf.splitTextToSize(text, contentWidth);
          checkPageBreak(lines.length * 5);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(31, 41, 55);
          const keyWidth = pdf.getStringUnitWidth(`${key}: `) * 10 / pdf.internal.scaleFactor;
          pdf.text(`${key}: `, margin, y);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(55, 65, 81);
          pdf.text(value, margin + keyWidth, y, { maxWidth: contentWidth - keyWidth });
          y += lines.length * 5 + 2;
      };
  
      if (result.espcAnalysis) {
          drawSectionHeader('Análisis de Contexto (ESPC)');
          drawKeyValue('Económico', result.espcAnalysis.economic);
          drawKeyValue('Social', result.espcAnalysis.social);
          drawKeyValue('Político', result.espcAnalysis.political);
          drawKeyValue('Cultural', result.espcAnalysis.cultural);
          y += 5;
      }

      if (result.idealCustomerProfile) {
          drawSectionHeader('Perfil del Cliente Ideal (Psicología y Neuromarketing)');
          drawKeyValue('Demográfico', result.idealCustomerProfile.demographic);
          drawKeyValue('Psicológico', result.idealCustomerProfile.psychological);
          drawKeyValue('Gatillos Mentales', result.idealCustomerProfile.mentalTriggers);
          drawKeyValue('Objeciones & Cierre', result.idealCustomerProfile.objections);
          y += 5;
      }
  
      if (result.strategySteps) {
          drawSectionHeader('Estrategia en 3 Pasos');
          result.strategySteps.forEach((step, index) => {
              checkPageBreak(20);
              pdf.setFontSize(12);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(202, 138, 4);
              pdf.text(step.title.startsWith('Paso') ? step.title : `Paso ${index + 1}: ${step.title}`, margin, y);
              y += 6;
              drawBodyText(step.description);
              if (step.persuasionTechnique) {
                drawBodyText(`Técnica de Persuasión: ${step.persuasionTechnique}`);
              }
              if (step.practicalExample) {
                drawBodyText(`Ejemplo Práctico: ${step.practicalExample}`);
              }
              y += 3;
          });
          y += 5;
      }
      
      if(result.timeline){
          drawSectionHeader('Cronograma Táctico (90 Días)');
          result.timeline.forEach(phase => {
              checkPageBreak(25);
              pdf.setFontSize(12);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(146, 64, 14);
              pdf.text(`${phase.phase} (${phase.duration})`, margin, y);
              y += 6;
  
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'bold');
              pdf.text('Actividades Clave:', margin, y);
              y+= 5;
              phase.activities.forEach(act => drawBodyText(`• ${act}`, { isListItem: true }));
  
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'bold');
              pdf.text('KPIs a Medir:', margin, y);
              y+= 5;
              phase.kpis.forEach(kpi => drawBodyText(`• ${kpi}`, { isListItem: true }));
              y += 5;
          });
      }

      if (result.futureScenarios) {
          drawSectionHeader('Escenarios de Futuro');
          result.futureScenarios.forEach(scenario => {
              checkPageBreak(20);
              pdf.setFontSize(11);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(31, 41, 55);
              pdf.text(`${scenario.scenario}:`, margin, y);
              y += 5;
              drawBodyText(scenario.description, { size: 9 });
              pdf.setFont('helvetica', 'bold');
              pdf.text('Plan de Contingencia:', margin, y);
              y += 5;
              drawBodyText(scenario.contingencyPlan, { size: 9 });
              y += 5;
          });
      }
  
      if (result.servicesCombo) {
          const effectivePrice = getEffectivePrice(result);
          drawSectionHeader('Cotización Detallada');
          result.servicesCombo.forEach(item => {
              checkPageBreak(15);
              pdf.setFontSize(11);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(31, 41, 55);
              const itemPrice = Number(item.price) > 0 ? item.price : effectivePrice;
              const priceText = `$${itemPrice.toLocaleString('es-MX')}`;
              const priceWidth = pdf.getStringUnitWidth(priceText) * 11 / pdf.internal.scaleFactor;
              pdf.text(item.name, margin, y, { maxWidth: contentWidth - priceWidth - 5 });
              pdf.text(priceText, pageWidth - margin, y, { align: 'right' });
              y += 5;
              drawBodyText(item.description, { size: 9 });
          });
          y += 5;
          pdf.setDrawColor(200);
          pdf.line(margin, y, pageWidth - margin, y);
          y += 10;
          
          checkPageBreak(20);
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(100);
          pdf.text('TOTAL A INVERTIR:', pageWidth - margin, y, { align: 'right' });
          y += 8;
  
          pdf.setFontSize(20);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(202, 138, 4);
          pdf.text(`$${effectivePrice.toLocaleString('es-MX')} MXN`, pageWidth - margin, y, { align: 'right' });
          y += 15;
      }
  
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(150);
          pdf.text(`Página ${i} de ${pageCount} | © ${new Date().getFullYear()} Charlitron`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
  
      pdf.save(`Estrategia-Charlitron-${new Date().toISOString().slice(0, 10)}.pdf`);
  
    } catch (err) {
      console.error("Error generating native PDF:", err);
      alert("Hubo un problema al generar el PDF.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };
  
  const handleActivationSubmit = (data: { name: string; email: string; phone: string }) => {
    setIsActivationSubmitted(true);
  };

  const onFeedbackFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Por favor, selecciona una calificación.");
      return;
    }
    onFeedbackSubmit(rating, feedbackComment);
    setFeedbackSubmitted(true);
  };

  const metricIcons: { [key: string]: React.ReactNode } = {
    default: <TrendingUp className="w-8 h-8 text-amber-500" />,
    roi: <TrendingUp className="w-8 h-8 text-green-500" />,
    interaccion: <Users className="w-8 h-8 text-blue-500" />,
    tiempo: <Clock className="w-8 h-8 text-purple-500" />,
  };
  
  const scenarioIcons: { [key: string]: React.ReactNode } = {
      'Optimista': <TrendingUp className="w-8 h-8 text-green-500"/>,
      'Realista': <CheckCircle className="w-8 h-8 text-blue-500"/>,
      'Pesimista': <Zap className="w-8 h-8 text-red-500"/>
  };

  const getMetricIcon = (metricName: string) => {
    const lowerName = metricName.toLowerCase();
    if (lowerName.includes('roi')) return metricIcons.roi;
    if (lowerName.includes('interacción')) return metricIcons.interaccion;
    if (lowerName.includes('tiempo')) return metricIcons.tiempo;
    return metricIcons.default;
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorDisplay message={error} onRetry={onRestart} />;
    }

    if (result) {
      return (
        <div className="animate-fade-in pb-20">
          <div className="text-center mb-6">
            <p className="text-amber-600 text-lg font-semibold flex items-center justify-center gap-2">
                ¡Listo! Charlitron ha terminado.
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">PDF-PRICE-FIX</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    result.knowledge_source === 'DB' ? 'bg-green-500/20 text-green-500' : 
                    result.knowledge_source === 'HYBRID' ? 'bg-amber-500/20 text-amber-600' : 'bg-blue-500/20 text-blue-600'
                }`}>
                    {result.knowledge_source === 'DB' ? 'USO DE DB TOTAL' : result.knowledge_source === 'HYBRID' ? 'HÍBRIDO' : 'ADN CORE'}
                </span>
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mt-2">{result.strategyTitle}</h1>
            
            <div className="mt-4 flex justify-center">
                <button 
                    onClick={() => setIsReasoningOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 transition-transform transform hover:scale-105"
                >
                    <Brain className="w-4 h-4" />
                    Auditoría del Cerebro IA
                </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
            {result.espcAnalysis && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-amber-400 pl-4">Análisis de Contexto (ESPC)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <Dollar className="w-7 h-7 text-green-600 flex-shrink-0 mt-1"/>
                        <div><strong className="text-gray-800">Económico:</strong> <span className="text-gray-600">{result.espcAnalysis.economic}</span></div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <Users className="w-7 h-7 text-blue-600 flex-shrink-0 mt-1"/>
                        <div><strong className="text-gray-800">Social:</strong> <span className="text-gray-600">{result.espcAnalysis.social}</span></div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <Briefcase className="w-7 h-7 text-indigo-600 flex-shrink-0 mt-1"/>
                        <div><strong className="text-gray-800">Político:</strong> <span className="text-gray-600">{result.espcAnalysis.political}</span></div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <Star className="w-7 h-7 text-amber-600 flex-shrink-0 mt-1"/>
                        <div><strong className="text-gray-800">Cultural:</strong> <span className="text-gray-600">{result.espcAnalysis.cultural}</span></div>
                    </div>
                </div>
              </div>
            )}

            {result.idealCustomerProfile && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-amber-400 pl-4">Perfil del Cliente Ideal (Psicología y Neuromarketing)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-100">
                        <strong className="text-amber-900 block mb-1">Perfil Demográfico:</strong>
                        <p className="text-gray-700 text-sm">{result.idealCustomerProfile.demographic}</p>
                    </div>
                    <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
                        <strong className="text-indigo-900 block mb-1">Perfil Psicológico (Miedos & Deseos):</strong>
                        <p className="text-gray-700 text-sm">{result.idealCustomerProfile.psychological}</p>
                    </div>
                    <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100">
                        <strong className="text-purple-900 block mb-1">Gatillos Mentales Clave:</strong>
                        <p className="text-gray-700 text-sm">{result.idealCustomerProfile.mentalTriggers}</p>
                    </div>
                    <div className="p-4 bg-red-50/50 rounded-lg border border-red-100">
                        <strong className="text-red-900 block mb-1">Objeciones & Cierre Ético:</strong>
                        <p className="text-gray-700 text-sm">{result.idealCustomerProfile.objections}</p>
                    </div>
                </div>
              </div>
            )}

            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-amber-400 pl-4">Estrategia en 3 Pasos</h3>
              <div className="space-y-6">
                {(result.strategySteps || []).map((step, index) => (
                  <div key={index} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-lg text-amber-700">{step.title.startsWith('Paso') ? step.title : `Paso ${index + 1}: ${step.title}`}</h4>
                    <p className="text-gray-800 font-medium mt-2">{step.description}</p>
                    {step.persuasionTechnique && (
                      <div className="mt-3 text-sm bg-amber-100/60 text-amber-900 p-3 rounded-lg border border-amber-200">
                        <strong>🎯 Técnica de Persuasión:</strong> {step.persuasionTechnique}
                      </div>
                    )}
                    {step.practicalExample && (
                      <div className="mt-2 text-sm bg-blue-50 text-blue-900 p-3 rounded-lg border border-blue-100">
                        <strong>💡 Ejemplo Práctico:</strong> {step.practicalExample}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {result.timeline && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-amber-400 pl-4">Cronograma Táctico</h3>
                <div className="space-y-6">
                    {result.timeline.map((phase, index) => (
                        <div key={index} className="border-l-2 border-amber-200 pl-6 relative">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-amber-400 rounded-full border-2 border-white"></div>
                            <h4 className="font-bold text-lg text-amber-700">{phase.phase} <span className="text-gray-400 font-normal text-sm ml-2">({phase.duration})</span></h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Actividades</p>
                                    <ul className="text-sm text-gray-600 list-disc list-inside">
                                        {phase.activities.map((act, i) => <li key={i}>{act}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">KPIs Clave</p>
                                    <ul className="text-sm text-gray-600 list-disc list-inside">
                                        {phase.kpis.map((kpi, i) => <li key={i}>{kpi}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {result.futureScenarios && (
                <div className="mb-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-amber-400 pl-4">Escenarios de Crecimiento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {result.futureScenarios.map((scenario, index) => (
                            <div key={index} className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex flex-col h-full">
                                <div className="mb-3">{scenarioIcons[scenario.scenario]}</div>
                                <h4 className="font-bold text-gray-900">{scenario.scenario}</h4>
                                <p className="text-xs text-gray-600 mt-2 flex-grow">{scenario.description}</p>
                                <div className="mt-4 pt-3 border-t border-gray-200">
                                    <p className="text-[10px] font-black text-amber-600 uppercase">Contingencia</p>
                                    <p className="text-[11px] text-gray-500 italic mt-1">{scenario.contingencyPlan}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-amber-400 pl-4">Cotización Detallada</h3>
              <div className="space-y-4 mb-6">
                {(result.servicesCombo || []).map((item, index) => (
                  <div key={index} className="flex justify-between items-start border-b border-gray-100 pb-3">
                    <div className="pr-4">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <p className="font-semibold text-gray-900 text-lg whitespace-nowrap">${(Number(item.price) > 0 ? item.price : getEffectivePrice(result)).toLocaleString('es-MX')}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-center text-right mt-6">
                  <div>
                    <p className="text-gray-500 font-semibold">TOTAL A INVERTIR:</p>
                    <p className="text-4xl font-extrabold text-amber-600">${getEffectivePrice(result).toLocaleString('es-MX')} <span className="text-2xl font-bold text-gray-800">MXN</span></p>
                  </div>
              </div>
            </div>
            
            <div className="border-t-2 border-dashed border-gray-200 my-10"></div>

            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-amber-400 pl-4">Métricas Estimadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {(result.estimatedMetrics || []).map((metric, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-center items-center h-12 mb-2">
                        {getMetricIcon(metric.name)}
                    </div>
                    <p className="font-bold text-gray-800">{metric.name}</p>
                    <p className="text-2xl font-extrabold text-amber-600 my-1">{metric.value}</p>
                    <p className="text-xs text-gray-500">{metric.justification}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12 bg-amber-100 p-6 rounded-lg border border-amber-200">
                <p className="text-xl font-bold text-amber-800">{result.finalCallToAction}</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            {isActivationSubmitted ? (
               <div className="w-full bg-green-100 border border-green-200 text-green-800 font-bold text-lg py-4 px-10 rounded-lg transition-colors flex items-center justify-center gap-3">
                 <CheckCircle className="w-6 h-6"/>
                 ¡Gracias! Te contactaremos pronto.
               </div>
            ) : (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-lg py-4 px-10 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-amber-400/30"
                >
                    Activar Estrategia
                </button>
            )}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloadingPdf ? 'Generando PDF...' : 'Descargar PDF'}
            </button>
          </div>

          {/* Feedback Section */}
          <div className="max-w-4xl mx-auto mt-12 bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
             {!feedbackSubmitted ? (
                <form onSubmit={onFeedbackFormSubmit}>
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-4">¿Te gustó esta estrategia?</h3>
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform transform hover:scale-125"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`w-10 h-10 ${
                                        star <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                    <textarea
                        placeholder="Déjanos un comentario o sugerencia para mejorar a Charlitron..."
                        className="w-full border border-gray-200 rounded-lg p-4 text-sm focus:ring-amber-400 focus:border-amber-400 min-h-[100px]"
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                    />
                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-8 rounded-lg transition-colors"
                        >
                            Enviar Comentarios
                        </button>
                    </div>
                </form>
             ) : (
                <div className="text-center py-4 animate-fade-in">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-gray-900">¡Gracias por tu retroalimentación!</h4>
                    <p className="text-gray-500 text-sm mt-1">Nos ayudas a que Charlitron sea más inteligente cada día.</p>
                </div>
             )}
          </div>

          {result.decision_log && (
            <ReasoningModal 
                isOpen={isReasoningOpen}
                onClose={() => setIsReasoningOpen(false)}
                log={result.decision_log}
                source={result.knowledge_source}
            />
          )}

          <ActivationModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleActivationSubmit}
            strategyResult={result}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      {renderContent()}
    </div>
  );
};

export default ResultsPage;
