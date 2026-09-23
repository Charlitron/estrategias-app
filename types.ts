
// Fix: Defined and exported all necessary types for the application.
// Fix: Export the User type from Supabase to resolve import errors.
export type { User } from '@supabase/supabase-js';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number';
  placeholder: string;
}

export interface Plan {
  name: string;
  price: number;
  description: string;
  features: string[];
  formFields: FormField[];
}

export type FormData = {
  [key: string]: string | number | undefined;
};

export interface StrategyStep {
  title: string;
  description: string;
  persuasionTechnique?: string;
  practicalExample?: string;
}

export interface IdealCustomerProfile {
  demographic: string;
  psychological: string;
  mentalTriggers: string;
  objections: string;
}

export interface ServiceComboItem {
  name: string;
  description: string;
  price: number;
}

export interface EstimatedMetric {
  name: string;
  value: string;
  justification: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ESPCAnalysis {
  economic: string;
  social: string;
  political: string;
  cultural: string;
}

export interface TimelinePhase {
  phase: string;
  duration: string;
  activities: string[];
  kpis: string[];
}

export interface FutureScenario {
  scenario: 'Optimista' | 'Realista' | 'Pesimista';
  description: string;
  contingencyPlan: string;
}

export interface DecisionLog {
  rules_applied: string[];
  blocks_detected: string[];
  conflicts_resolved: { conflict: string; resolution: string; reason: string }[];
  missing_data_warnings?: string[];
}

export interface StrategyResult {
  id?: string;
  strategyTitle: string;
  decision_log?: DecisionLog;
  espcAnalysis: ESPCAnalysis;
  idealCustomerProfile?: IdealCustomerProfile;
  strategySteps: StrategyStep[];
  timeline: TimelinePhase[];
  futureScenarios: FutureScenario[];
  servicesCombo: ServiceComboItem[];
  totalPrice: number;
  estimatedMetrics: EstimatedMetric[];
  finalCallToAction: string;
  planName: string;
  generatedAt: string;
  groundingSources?: GroundingSource[];
  // NUEVO: Rastreabilidad del Cerebro
  knowledge_source?: 'DB' | 'CORE' | 'HYBRID';
}

export type KnowledgeType = 'general' | 'methodology' | 'principle' | 'case_study' | 'blocking_rule' | 'threshold';
export type KnowledgeVertical = 'general' | 'restaurantes' | 'servicios' | 'retail' | 'medico' | 'inmobiliaria';

export interface KnowledgeItem {
  id: string;
  content: string; 
  category?: string; 
  icon?: string;     
  created_at?: string;
  type: KnowledgeType;
  vertical: KnowledgeVertical;
  tags: string[];
  weight: number; 
  is_hard_rule: boolean;
  expires_at?: string | null;
}

export interface Feedback {
    id?: string;
    user_id: string;
    strategy_id: string;
    rating: number;
    comment?: string;
}
