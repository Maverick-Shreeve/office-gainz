import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY; //  NEXT_PUBLIC_ for env vars to expose  to the browser
const supabase = createClient(supabaseUrl, supabaseKey);

const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;  //This key has the ability to bypass Row Level Security.

export default supabase;