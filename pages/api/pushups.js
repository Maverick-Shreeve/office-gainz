import express from 'express';
import pool from '../../db'; 

const router = express.Router();

// add pushups
router.post('/record', async (req, res) => {
  const { count } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO exercises (exercise_type, count) VALUES ($1, $2) RETURNING *',
      ['pushup', count]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// fetch pushups
router.get('/history', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exercises WHERE exercise_type = $1', ['pushup']);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

export default router;
