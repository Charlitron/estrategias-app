import React, { forwardRef } from 'react';
import { StrategyResult } from '../types';
import { CHARLITRON_LOGO_URL } from '../constants';

interface PdfDocumentProps {
  result: StrategyResult;
}

const PdfDocument = forwardRef<HTMLDivElement, PdfDocumentProps>(({ result }, ref) => {
  if (!result) return null;

  return (
    <div ref={ref} className="bg-white p-12 font-sans text-gray-800" style={{ fontFamily: 'Inter, sans-serif', width: '800px' }}>
      <header className="flex justify-between items-center pb-8 border-b border-gray-200">
        <img
          src={CHARLITRON_LOGO_URL}
          alt="Charlitron Logo"
          className="w-24 h-24"
        />
        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-900">Estrategia de Marketing</h1>
          <p className="text-gray-500">Generado el: {new Date().toLocaleDateString('es-MX')}</p>
        </div>
      </header>

      <main className="my-10">
        <div className="text-center mb-10">
          <p className="text-amber-600 text-lg font-semibold">Tu Plan de Acción Personalizado</p>
          <h2 className="text-4xl font-black tracking-tight text-gray-900 mt-2">{result.strategyTitle}</h2>
        </div>

        {result.espcAnalysis && (
            <div className="mb-10 p-8 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-amber-400 pl-4">Análisis de Contexto (ESPC)</h3>
                <div className="space-y-3 text-sm">
                    <p><strong>Económico:</strong> {result.espcAnalysis.economic}</p>
                    <p><strong>Social:</strong> {result.espcAnalysis.social}</p>
                    <p><strong>Político:</strong> {result.espcAnalysis.political}</p>
                    <p><strong>Cultural:</strong> {result.espcAnalysis.cultural}</p>
                </div>
            </div>
        )}

        <div className="mb-10 p-8 bg-gray-50 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-amber-400 pl-4">Estrategia en 3 Pasos</h3>
          <div className="space-y-6">
            {(result.strategySteps || []).map((step, index) => (
              <div key={index}>
                <h4 className="font-bold text-lg text-amber-600">{`Paso ${index + 1}: ${step.title}`}</h4>
                <p className="text-gray-700 mt-1 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {result.timeline && (
            <div className="mb-10 p-8 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-amber-400 pl-4">Cronograma Táctico</h3>
                <div className="space-y-6">
                    {result.timeline.map((phase, index) => (
                        <div key={index}>
                            <h4 className="font-bold text-lg text-amber-700">{phase.phase} ({phase.duration})</h4>
                            <div className="mt-2 pl-4 text-sm">
                                <p className="font-semibold text-gray-700">Actividades:</p>
                                <ul className="list-disc list-inside text-gray-600 space-y-1 mt-1">
                                    {phase.activities.map((act, i) => <li key={i}>{act}</li>)}
                                </ul>
                                <p className="font-semibold text-gray-700 mt-2">KPIs:</p>
                                <ul className="list-disc list-inside text-gray-600 space-y-1 mt-1">
                                    {phase.kpis.map((kpi, i) => <li key={i}>{kpi}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        <div className="p-8 border-2 border-amber-400 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-amber-400 pl-4">Cotización Detallada</h3>
          <div className="space-y-4 mb-6">
            {(result.servicesCombo || []).map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <p className="font-semibold text-gray-900 text-lg">${item.price.toLocaleString('es-MX')}</p>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-gray-300 my-6"></div>
          <div className="flex justify-end items-center text-right">
              <div>
                <p className="text-gray-500 font-semibold">TOTAL A INVERTIR:</p>
                <p className="text-4xl font-extrabold text-amber-600">${result.totalPrice.toLocaleString('es-MX')} <span className="text-2xl font-bold text-gray-800">MXN</span></p>
                <p className="text-xs text-gray-500 mt-1">*Costos aproximados, pueden variar.</p>
              </div>
          </div>
        </div>
        
        <div className="my-10 p-8 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-amber-400 pl-4">Métricas Estimadas</h3>
            <div className="space-y-4">
            {(result.estimatedMetrics || []).map((metric, index) => (
                <div key={index}>
                    <p className="font-bold text-gray-800">{metric.name}: <span className="text-amber-600 font-extrabold">{metric.value}</span></p>
                    <p className="text-xs text-gray-500 mt-1">{metric.justification}</p>
                </div>
            ))}
            </div>
        </div>
        
        {result.futureScenarios && (
            <div className="mb-10 p-8 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-amber-400 pl-4">Planificación de Escenarios</h3>
                <div className="space-y-6">
                    {result.futureScenarios.map((scenario, index) => (
                        <div key={index}>
                            <h4 className="font-bold text-lg text-gray-800">{scenario.scenario}</h4>
                            <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                            <p className="text-sm font-semibold text-gray-700 mt-2">Plan de Contingencia:</p>
                            <p className="text-xs text-gray-500 mt-1">{scenario.contingencyPlan}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {result.groundingSources && result.groundingSources.length > 0 && (
          <div className="mt-10 p-8 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-amber-400 pl-4">Fuentes de Información</h3>
             <div className="space-y-2 text-sm">
                {result.groundingSources.map((source, index) => (
                  <div key={index}>
                    <p className="font-semibold text-gray-800">{source.title}</p>
                    <p className="text-xs text-blue-600 break-all">{source.uri}</p>
                  </div>
                ))}
              </div>
          </div>
        )}

        <div className="text-center mt-12 bg-amber-100 p-6 rounded-lg border border-amber-200">
            <p className="text-xl font-bold text-amber-800">{result.finalCallToAction}</p>
        </div>
      </main>

      <footer className="text-center text-gray-500 text-xs mt-10 border-t border-gray-200 pt-6">
        <p>&copy; {new Date().getFullYear()} Charlitron. Todos los derechos reservados.</p>
        <p>Este documento es una propuesta generada por IA y debe ser considerada como una guía estratégica.</p>
      </footer>
    </div>
  );
});

export default PdfDocument;