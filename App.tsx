
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './services/supabaseClient';
import { User, Plan, FormData, StrategyResult, Feedback, GroundingSource, KnowledgeItem } from './types';
import { PLANS as INITIAL_PLANS } from './constants';
import { generateStrategy } from './services/geminiService';
import { saveStrategy, saveFeedback, getKnowledge, savePaymentRecord, getUserRole, getAppSettings, updateAppSettings, verifyPaymentInDb } from './services/database';

import HomePage from './components/HomePage';
import PlansPage from './components/PlansPage';
import FormPage from './components/FormPage';
import ResultsPage from './components/ResultsPage';
import AuthModal from './components/AuthModal';
import PaymentPage from './components/PaymentPage';
import PaymentCancelledPage from './components/PaymentCancelledPage';
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';

// Legal Pages
import LegalPageLayout from './components/legal/LegalPageLayout';
import TermsAndConditionsPage from './components/legal/TermsAndConditionsPage';
import PrivacyPolicyPage from './components/legal/PrivacyPolicyPage';
import CookiePolicyPage from './components/legal/CookiePolicyPage';
import ResponsibleAIUsePage from './components/legal/ResponsibleAIUsePage';

type Page = 
  | 'home' 
  | 'plans' 
  | 'form' 
  | 'results' 
  | 'payment'
  | 'paymentCancelled'
  | 'adminLogin'
  | 'adminDashboard'
  | 'legal/terminos-condiciones'
  | 'legal/aviso-privacidad'
  | 'legal/politica-cookies'
  | 'legal/uso-responsable-ia';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [strategyResult, setStrategyResult] = useState<StrategyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [videoUrl, setVideoUrl] = useState<string>('https://www.youtube.com/embed/videoseries?list=PL-I9-T1pYvL1s3hYh9Ynp0593wR-S2a87');

  const [cookieConsent, setCookieConsent] = useState(() => localStorage.getItem('cookie_consent') === 'true');

  const loggingOutRef = useRef(false);

  const handleLogout = useCallback(async () => {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;

    try {
        // Limpieza de Storage
        localStorage.removeItem('charlitron-auth-token');
        localStorage.removeItem('charlitron_pending_form_data');
        localStorage.removeItem('charlitron_pending_plan');
        localStorage.removeItem('pending_action');
        
        // Cierre de sesión seguro en Supabase (evita rejections o bloqueos si la red falla)
        await Promise.race([
            supabase.auth.signOut().catch(() => {}),
            new Promise((resolve) => setTimeout(resolve, 300))
        ]);
    } catch (e) {
        console.warn("Sesión limpiada localmente:", e);
    } finally {
        setUser(null);
        setIsAdmin(false);
        setPage('home');
        setSelectedPlan(null);
        setFormData(null);
        setStrategyResult(null);
        setError(null);
        loggingOutRef.current = false;
    }
  }, []);

  useEffect(() => {
    const fetchAndSetSettings = async () => {
      const settings = await getAppSettings();
      if (settings) {
        setPlans(settings.plans);
        setVideoUrl(settings.videoUrl);
      }
    };
    fetchAndSetSettings();
  }, []);

  const checkAdminRole = useCallback(async (user: User | null) => {
    if (user) {
        const role = await getUserRole(user.id);
        if (role === 'admin') {
            setIsAdmin(true);
            return true;
        }
    }
    setIsAdmin(false);
    return false;
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        setPage('home');
        return;
      }

      setUser(currentUser);
      
      if (currentUser) {
        await checkAdminRole(currentUser);
      }

      const pendingAction = localStorage.getItem('pending_action');
      if (currentUser && pendingAction === 'continue_to_payment') {
          localStorage.removeItem('pending_action');
          setPage('payment');
      } else if (currentUser) {
        setIsAuthModalOpen(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [checkAdminRole]);

  const handleGenerateAfterPaymentConfirmation = useCallback(async (sessionId?: string) => {
    setPage('results');
    setIsLoading(true);
    setError(null);

    const savedFormDataString = localStorage.getItem('charlitron_pending_form_data');
    const savedPlanString = localStorage.getItem('charlitron_pending_plan');

    if (!savedFormDataString || !savedPlanString) {
      setError("Error: Datos no encontrados. Por favor inicia de nuevo.");
      setIsLoading(false);
      return;
    }
    
    try {
        let currentUser: User | null = null;
        try {
            const { data } = await supabase.auth.getSession();
            currentUser = data?.session?.user ?? null;
        } catch (e) {
            console.warn("Supabase auth no disponible, procediendo sin guardar en BD.");
        }

        const savedFormData = JSON.parse(savedFormDataString);
        const savedPlan = JSON.parse(savedPlanString);

        setFormData(savedFormData);
        setSelectedPlan(savedPlan);
        
        if (sessionId && currentUser) {
            try {
                let verified = await verifyPaymentInDb(currentUser.id, sessionId);
                if (!verified && !isAdmin) {
                    console.warn("No se pudo verificar pago en BD, procediendo de todos modos.");
                }
            } catch (e) {
                console.warn("Verificación de pago saltada por falta de conexión.");
            }
        }

        // MOTOR DE INFERENCIA HÍBRIDO
        const vertical = (savedFormData.giro as string)?.toLowerCase() || 'general';
        const { items: knowledgeItems, source: dbSource } = await getKnowledge(vertical as any);
        
        const trainingData = knowledgeItems.map(item => 
            `${item.is_hard_rule ? '[REGLA CRÍTICA]' : ''} ${item.content}`
        ).join('\n---\n');
        
        const { content, groundingChunks, knowledgeSource } = await generateStrategy(savedFormData, savedPlan, trainingData, dbSource);
        
        let cleanedJsonString = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) cleanedJsonString = jsonMatch[1];

        const parsedResult = JSON.parse(cleanedJsonString.trim());
        const groundingSources: GroundingSource[] = (groundingChunks ?? [])
            .map((chunk: any) => chunk.web)
            .filter(Boolean)
            .map((source: any) => ({ title: source.title, uri: source.uri }));
        
        const completeResult: StrategyResult = {
            ...parsedResult,
            planName: savedPlan.name,
            generatedAt: new Date().toISOString(),
            groundingSources: groundingSources.length > 0 ? groundingSources : undefined,
            knowledge_source: knowledgeSource
        };
        
        if (currentUser) {
            const savedResult = await saveStrategy(completeResult, currentUser.id);
            setStrategyResult(savedResult || completeResult);
        } else {
            setStrategyResult(completeResult);
        }

    } catch (err: any) {
        console.error("Error Crítico:", err);
        setError("El motor Charlitron tuvo un hipo. Reintenta o contacta a soporte si persiste.");
    } finally {
        setIsLoading(false);
    }
  }, [isAdmin]);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('payment_success') === 'true';
    const sessionId = params.get('session_id');
    
    if (isSuccess && sessionId) {
      handleGenerateAfterPaymentConfirmation(sessionId);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [handleGenerateAfterPaymentConfirmation]);

  const handleStart = () => { setPage('plans'); setStrategyResult(null); setError(null); };
  const handleSelectPlan = (plan: Plan) => { setSelectedPlan(plan); setPage('form'); };

  const handleContinueToPayment = (data: FormData, plan: Plan) => {
    setFormData(data);
    setSelectedPlan(plan);
    localStorage.setItem('charlitron_pending_form_data', JSON.stringify(data));
    localStorage.setItem('charlitron_pending_plan', JSON.stringify(plan));
    if (!user) { localStorage.setItem('pending_action', 'continue_to_payment'); setIsAuthModalOpen(true); } else { setPage('payment'); }
  };

  const handleRestart = () => { setPage('home'); setSelectedPlan(null); setFormData(null); setStrategyResult(null); setError(null); };
  const handleEdit = () => { if (selectedPlan && formData) { setPage('form'); } else { handleRestart(); } };
  const handleFeedbackSubmit = async (rating: number, comment: string) => { if (user && strategyResult?.id) await saveFeedback({ user_id: user.id, strategy_id: strategyResult.id, rating, comment }); };
  const handleAdminAccess = () => setPage('adminLogin');
  const handleAdminLoginSuccess = () => { setIsAdmin(true); setPage('adminDashboard'); };
  const handleAdminGenerateStrategy = () => { const premiumPlan = plans.find(p => p.name === 'Premium') || plans[0]; setSelectedPlan(premiumPlan); setPage('form'); };
  const navigate = (path: Page) => setPage(path);
  const handleManualPaymentSuccess = () => handleGenerateAfterPaymentConfirmation(undefined);

  const renderPage = () => {
    if (page.startsWith('legal/')) {
        let LegalContent;
        switch(page) {
            case 'legal/terminos-condiciones': LegalContent = <TermsAndConditionsPage />; break;
            case 'legal/aviso-privacidad': LegalContent = <PrivacyPolicyPage />; break;
            case 'legal/politica-cookies': LegalContent = <CookiePolicyPage />; break;
            case 'legal/uso-responsable-ia': LegalContent = <ResponsibleAIUsePage />; break;
            default: LegalContent = <p>Página no encontrada.</p>;
        }
        return <LegalPageLayout onBack={handleRestart}>{LegalContent}</LegalPageLayout>;
    }
    
    switch (page) {
      case 'home': return <HomePage onStart={handleStart} onAdminAccess={handleAdminAccess} videoUrl={videoUrl} />;
      case 'plans': return <PlansPage plans={plans} onSelectPlan={handleSelectPlan} onBack={handleRestart} />;
      case 'form': return <FormPage plan={selectedPlan!} onBack={() => setPage('plans')} onSubmit={handleContinueToPayment} isLoading={isLoading} initialData={formData} />;
      case 'results': return <ResultsPage result={strategyResult} isLoading={isLoading} error={error} onRestart={handleRestart} onEdit={handleEdit} onFeedbackSubmit={handleFeedbackSubmit}/>;
      case 'payment': return <PaymentPage plan={selectedPlan!} user={user!} onBack={() => setPage('form')} onPaymentSuccess={handleManualPaymentSuccess} />;
      case 'paymentCancelled': return <PaymentCancelledPage onGoToPlans={() => setPage('plans')} />;
      case 'adminLogin': return <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} />;
      case 'adminDashboard': return <AdminDashboard onLogout={handleLogout} onAdminGenerateStrategy={handleAdminGenerateStrategy} initialPlans={plans} initialVideoUrl={videoUrl} onPlansUpdate={setPlans} onVideoUrlUpdate={setVideoUrl} />;
      default: return <HomePage onStart={handleStart} onAdminAccess={handleAdminAccess} videoUrl={videoUrl} />;
    }
  };

  const isAdminPage = page === 'adminLogin' || (page === 'adminDashboard' && isAdmin);

  return (
    <div className={`bg-gray-50 min-h-screen font-sans text-gray-800 ${isAdminPage ? '' : 'flex flex-col'}`}>
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <button onClick={handleRestart} className="font-bold text-lg text-gray-800">CHARLITRON</button>
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden sm:block truncate max-w-xs">{user.email}</span>
                <button onClick={handleLogout} className="text-sm font-semibold text-gray-600 hover:text-amber-600">Cerrar Sesión</button>
              </div>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm">Entrar</button>
            )}
          </div>
        </div>
      </header>
      <main className={`container mx-auto px-4 py-8 sm:py-16 ${isAdminPage ? '' : 'flex-grow'}`}>
        {renderPage()}
      </main>
      {!isAdminPage && <Footer onNavigate={navigate} />}
      {!cookieConsent && !isAdminPage && <CookieBanner onAccept={() => {setCookieConsent(true); localStorage.setItem('cookie_consent', 'true');}} onNavigate={navigate} />}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default App;
