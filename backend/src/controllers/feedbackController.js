const pool = require('../db/connection');

const submitFeedback = async (req, res) => {
  const { rating, message } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  try {
    await pool.query(
      'INSERT INTO feedback (rating, message) VALUES ($1, $2)',
      [rating, message || '']
    );
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFeedback = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { submitFeedback, getFeedback };
