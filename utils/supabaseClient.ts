import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_KEY!; //using ! to assert that these are nonnull


export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
