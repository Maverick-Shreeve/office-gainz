import express from 'express';
import supabase from '../../utils/supabaseClient';

const router = express.Router();

// add pushups
router.post('/record', async (req, res) => {
  const { count } = req.body;
  try {
    const { data, error } = await supabase
      .from('exercises')
      .insert([{ exercise_type: 'pushup', count }]);

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// fetch pushups
router.get('/history', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('exercise_type', 'pushup'); //where exercise_type ='pushup'

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

export default router;
