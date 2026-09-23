import React, { useState, useEffect } from 'react';
import AdminAnalyticsPage from './AdminAnalyticsPage';
import AdminSettingsPage from './AdminSettingsPage';
import AdminTrainingPage from './AdminTrainingPage';
import { Plan } from '../../types';
import { getKnowledgeCount } from '../../services/database';

interface AdminDashboardProps {
  onLogout: () => void;
  onAdminGenerateStrategy: () => void;
  initialPlans: Plan[];
  initialVideoUrl: string;
  onPlansUpdate: (plans: Plan[]) => void;
  onVideoUrlUpdate: (url: string) => void;
}

type AdminTab = 'dashboard' | 'settings' | 'training';

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onAdminGenerateStrategy,
  initialPlans,
  initialVideoUrl,
  onPlansUpdate,
  onVideoUrlUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [knowledgeItemCount, setKnowledgeItemCount] = useState(0);

  const fetchCount = async () => {
    const count = await getKnowledgeCount();
    setKnowledgeItemCount(count);
  };

  useEffect(() => {
    fetchCount();
  }, []);


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <button
            onClick={onLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="overflow-x-auto">
                <div className="flex space-x-8 -mb-px flex-nowrap">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'dashboard'
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'settings'
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Ajustes
                </button>
                <button
                    onClick={() => setActiveTab('training')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === 'training'
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Entrenamiento IA
                    {knowledgeItemCount > 0 && (
                        <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                            activeTab === 'training' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-700'
                        }`}>
                            {knowledgeItemCount}
                        </span>
                    )}
                </button>
                </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {activeTab === 'dashboard' && <AdminAnalyticsPage onAdminGenerateStrategy={onAdminGenerateStrategy} />}
          {activeTab === 'settings' && (
            <AdminSettingsPage
              initialPlans={initialPlans}
              initialVideoUrl={initialVideoUrl}
              onPlansUpdate={onPlansUpdate}
              onVideoUrlUpdate={onVideoUrlUpdate}
            />
          )}
          {activeTab === 'training' && (
            <AdminTrainingPage
              onCountChange={setKnowledgeItemCount}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;