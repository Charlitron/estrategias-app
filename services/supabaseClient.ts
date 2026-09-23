
import { createClient } from '@supabase/supabase-js';

// URL y Key de Charlitron
export const supabaseUrl = 'https://suusxdmjdrhcfimbkasy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dXN4ZG1qZHJoY2ZpbWJrYXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MjgzOTYsImV4cCI6MjA3NzAwNDM5Nn0.C4Zju8ZBzDyRtvptYD94t4k_zsxJc8qBMoZ32Ha5q_E';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'charlitron-auth-token',
    // Si el navegador bloquea localStorage, esto evita que la app truene
    storage: window.localStorage
  }
});
