import { supabase } from '../../utils/supabaseClient';

export async function getUserById(id) {
  const { data, error } = await supabase
    .from('users') 
    .select('*')
    .eq('id', id)
    .single(); 

  if (error) {
    throw error;
  }

  return data;
}
