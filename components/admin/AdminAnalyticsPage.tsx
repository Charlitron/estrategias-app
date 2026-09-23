import React, { useState, useEffect } from 'react';
import { StrategyResult, Feedback } from '../../types';
import { TrendingUp, Calendar, Star } from '../icons';
import { supabase } from '../../services/supabaseClient';

interface AdminAnalyticsPageProps {
  onAdminGenerateStrategy: () => void;
}

type FetchedStrategy = {
  id: string;
  plan_name: string;
  strategy_data: StrategyResult;
  created_at: string;
};

type FetchedFeedback = {
    rating: number;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number }> = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4">
    <div className="bg-amber-100 text-amber-600 rounded-full p-3">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// Mock data for the chart - This remains as mock data for now.
const chartData = [
  { day: 'Lun', count: 4 },
  { day: 'Mar', count: 7 },
  { day: 'Mié', count: 5 },
  { day: 'Jue', count: 11 },
  { day: 'Vie', count: 9 },
  { day: 'Sáb', count: 15 },
  { day: 'Dom', count: 12 },
];

const AnalyticsChart: React.FC = () => {
    const maxCount = Math.max(...chartData.map(d => d.count), 1); // Avoid division by zero
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Estrategias Generadas (Últimos 7 días)</h3>
        <div className="flex justify-between items-end h-48 space-x-2">
          {chartData.map(data => (
            <div key={data.day} className="flex-1 flex flex-col items-center justify-end">
              <div
                className="w-full bg-amber-300 hover:bg-amber-400 rounded-t-md transition-colors"
                style={{ height: `${(data.count / maxCount) * 100}%` }}
                title={`${data.count} estrategias`}
              ></div>
              <p className="text-xs text-gray-500 mt-2">{data.day}</p>
            </div>
          ))}
        </div>
      </div>
    );
};


const AdminAnalyticsPage: React.FC<AdminAnalyticsPageProps> = ({ onAdminGenerateStrategy }) => {
  const [strategies, setStrategies] = useState<FetchedStrategy[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    mostPopularPlan: 'N/A',
    satisfactionRate: 'N/A'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch strategies and feedbacks in parallel for better performance
        const [strategiesResponse, feedbacksResponse] = await Promise.all([
            supabase.from('strategies').select('*').order('created_at', { ascending: false }),
            supabase.from('feedbacks').select('rating')
        ]);

        if (strategiesResponse.error) throw new Error(`Al cargar estrategias: ${strategiesResponse.error.message}`);
        if (feedbacksResponse.error) throw new Error(`Al cargar feedbacks: ${feedbacksResponse.error.message}`);
        
        const strategiesData: FetchedStrategy[] = strategiesResponse.data || [];
        const feedbacksData: FetchedFeedback[] = feedbacksResponse.data || [];
        
        setStrategies(strategiesData);

        // Calculate stats from the fetched data
        const totalStrategies = strategiesData.length;
        
        const strategiesToday = strategiesData.filter(s => {
            const today = new Date();
            const strategyDate = new Date(s.created_at);
            return strategyDate.toDateString() === today.toDateString();
        }).length;

        let mostPopularPlan = 'N/A';
        if (totalStrategies > 0) {
            const planCounts = strategiesData.reduce((acc, s) => {
                acc.set(s.plan_name, (acc.get(s.plan_name) || 0) + 1);
                return acc;
            }, new Map<string, number>());
            const sortedPlans = [...planCounts.entries()].sort(([, countA], [, countB]) => countB - countA);
            mostPopularPlan = sortedPlans[0][0];
        }
        
        let satisfactionRate = 'N/A';
        if (feedbacksData.length > 0) {
            const totalRating = feedbacksData.reduce((acc, f) => acc + f.rating, 0);
            const avgRating = totalRating / feedbacksData.length;
            satisfactionRate = `${avgRating.toFixed(1)} / 5.0`;
        }
        
        setStats({
            total: totalStrategies,
            today: strategiesToday,
            mostPopularPlan,
            satisfactionRate
        });

      } catch (err: any) {
        console.error("Error fetching analytics data:", err);
        setError(`Error al cargar los datos del dashboard. ${err.message}. Revisa la tabla en Supabase por si hay datos corruptos.`);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);


  if (loading) {
      return <div className="text-center p-10 animate-pulse">Cargando datos del dashboard...</div>
  }
  
  if (error) {
    return <div className="text-center p-10 text-red-700 bg-red-100 rounded-lg border border-red-200">{error}</div>;
  }


  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Resumen de Actividad</h2>
          <button
            onClick={onAdminGenerateStrategy}
            className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-amber-400/30"
          >
            + Generar Nueva Estrategia
          </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<TrendingUp className="w-6 h-6" />} title="Total de Estrategias" value={stats.total} />
        <StatCard icon={<Calendar className="w-6 h-6" />} title="Generadas Hoy" value={stats.today} />
        <StatCard icon={<Star className="w-6 h-6" />} title="Plan Más Popular" value={stats.mostPopularPlan} />
        <StatCard icon={<Star className="w-6 h-6" />} title="Tasa de Satisfacción" value={stats.satisfactionRate} />
      </div>

      {/* Chart */}
      <div className="mt-8">
        <AnalyticsChart />
      </div>

      {/* Recent Activity Table */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h2>
        <div className="overflow-x-auto">
          {strategies.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de la Estrategia</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Usado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha (MX)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {strategies.slice(0, 5).map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.strategy_data?.strategyTitle ?? 'Sin Título'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.plan_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completada
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(s.created_at).toLocaleString('es-MX', { 
                            timeZone: 'America/Mexico_City',
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit', hour12: true
                        })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No hay actividad todavía.</p>
              <p className="text-sm text-gray-400">Genera una estrategia en la página principal para ver los datos aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;