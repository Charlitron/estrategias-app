
import { supabase } from './supabaseClient';
import { StrategyResult, Feedback, KnowledgeItem, Plan, KnowledgeType, KnowledgeVertical } from '../types';

const getPathFromUrl = (url: string): string | null => {
    try {
        const urlObject = new URL(url);
        const pathParts = urlObject.pathname.split('/');
        const bucketIndex = pathParts.indexOf('videos');
        if (bucketIndex > -1 && bucketIndex < pathParts.length - 1) {
            return pathParts.slice(bucketIndex + 1).join('/');
        }
        return null;
    } catch (error) {
        console.error("Invalid URL for path extraction:", error);
        return null;
    }
}

export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (error) return null;
    return data?.role || null;
  } catch (e) {
    return null;
  }
};

export const saveStrategy = async (strategy: StrategyResult, userId: string): Promise<StrategyResult | null> => {
  try {
    const { data, error } = await supabase
      .from('strategies')
      .insert({
        user_id: userId,
        plan_name: strategy.planName,
        strategy_data: strategy
      })
      .select('id, created_at') 
      .single();

    if (error) throw error;
    return { ...strategy, id: data.id, generatedAt: data.created_at };
  } catch (e) {
    console.error('Error saving strategy:', e);
    return null;
  }
};

export const saveFeedback = async (feedback: Feedback): Promise<boolean> => {
    const { error } = await supabase.from('feedbacks').insert(feedback);
    return !error;
};

// MOTOR DE CONOCIMIENTO BLINDADO (VISIÓN SIMBIONTE)
export const getKnowledge = async (vertical: KnowledgeVertical = 'general'): Promise<{ items: KnowledgeItem[], source: 'DB' | 'CORE' }> => {
    try {
        // Consultamos con prioridad absoluta a Hard Rules y Peso (Top 30 reglas)
        // Usamos una petición que no dependa de las credenciales del usuario actual si es posible
        const { data, error } = await supabase
            .from('knowledge_items')
            .select('*')
            .or(`vertical.eq.general,vertical.eq.${vertical}`)
            .order('is_hard_rule', { ascending: false })
            .order('weight', { ascending: false })
            .limit(30);

        if (error) {
            // Si hay un error de RLS o Sesión, intentamos un fetch "limpio" simulando anonimato
            console.warn("Fallo de sesión en DB, intentando bypass...");
            throw error;
        }
        
        return { items: (data || []) as KnowledgeItem[], source: 'DB' };
    } catch (error) {
        console.warn('⚡ Motor Charlitron: Modo Supervivencia Activado (CORE ADN).');
        return { items: [], source: 'CORE' }; 
    }
};

export const getKnowledgeCount = async (): Promise<number> => {
    try {
        const { count, error } = await supabase.from('knowledge_items').select('*', { count: 'exact', head: true });
        return count || 0;
    } catch (e) {
        return 0;
    }
};

export const addKnowledge = async (
    content: string, 
    category: string,
    icon: string,
    type: KnowledgeType = 'general',
    vertical: KnowledgeVertical = 'general',
    weight: number = 50,
    is_hard_rule: boolean = false,
    tags: string[] = []
): Promise<KnowledgeItem> => {
    const { data, error } = await supabase.from('knowledge_items').insert({ 
        content, 
        category,
        icon,
        type,
        vertical,
        weight,
        is_hard_rule,
        tags
    }).select().single();
    
    if (error) throw error;
    return data;
};

export const addMultipleKnowledge = async (items: any[]): Promise<KnowledgeItem[] | null> => {
    const { data, error } = await supabase.from('knowledge_items').insert(items).select();
    return data || null;
};

export const updateKnowledge = async (
    id: string, 
    content: string, 
    category: string,
    icon: string,
    type: KnowledgeType,
    vertical: KnowledgeVertical,
    weight: number,
    is_hard_rule: boolean,
    tags: string[]
): Promise<KnowledgeItem> => {
    const { data, error } = await supabase.from('knowledge_items').update({ 
        content, 
        category,
        icon,
        type,
        vertical,
        weight,
        is_hard_rule,
        tags
    }).eq('id', id).select().single();
    
     if (error) throw error;
    return data;
};

export const deleteKnowledge = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('knowledge_items').delete().eq('id', id);
    return !error;
};

export const getAppSettings = async (): Promise<{ plans: Plan[], videoUrl: string } | null> => {
    try {
        const { data, error } = await supabase.from('settings').select('plans_config, video_url').limit(1);
        if (error || !data || data.length === 0) return null;
        return { plans: data[0].plans_config as Plan[], videoUrl: data[0].video_url };
    } catch (e) {
        return null;
    }
};

export const updateAppSettings = async (updates: { video_url?: string; plans_config?: Plan[] }): Promise<boolean> => {
    const { data: existingRows } = await supabase.from('settings').select('id').limit(1);
    if (existingRows && existingRows.length > 0) {
        const { error } = await supabase.from('settings').update(updates).eq('id', existingRows[0].id);
        return !error;
    } else {
        const { error } = await supabase.from('settings').insert(updates);
        return !error;
    }
};

export const deleteVideoFromUrl = async (url: string): Promise<boolean> => {
    const filePath = getPathFromUrl(url);
    if (!filePath) return false;
    const { error } = await supabase.storage.from('videos').remove([filePath]);
    return !error;
};

export const savePaymentRecord = async (userId: string, planName: string, amount: number): Promise<boolean> => {
    try {
        const { error } = await supabase.from('payments').insert({
            user_id: userId,
            plan_name: planName,
            amount: amount,
            status: 'pending (manual/qr)'
        });
        return !error;
    } catch (e) {
        return false;
    }
};

export const verifyPaymentInDb = async (userId: string, sessionId: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', userId)
            .eq('stripe_session_id', sessionId)
            .eq('status', 'verified') 
            .maybeSingle();
        return !error && !!data;
    } catch (e) {
        return false;
    }
};

export const createStripeCheckoutSession = async (planName: string, planPrice: number, customerEmail: string, userId: string): Promise<{ checkoutUrl: string } | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: { planName, planPrice, customerEmail, siteUrl: window.location.origin, userId },
    });
    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'No se pudo iniciar la sesión de pago.');
  }
};
