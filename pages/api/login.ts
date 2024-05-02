import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

// Handler to initiate Google SignIn
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Redirect user to the OAuth consent screen
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
       // redirectTo: /, 
        queryParams: {
          access_type: 'offline',  // Necessary to receive a refresh token
          prompt: 'consent',       // Ensures that the consent screen is shown
        }
      }
    });

    if (error) {
      console.error('OAuth error:', error);
      return res.status(401).json({ message: 'OAuth initiation failed', details: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) });
  }
};

export default handler;
