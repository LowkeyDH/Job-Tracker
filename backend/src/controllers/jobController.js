const pool = require('../db/connection');

const getAllJobs = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createJob = async (req, res) => {
  const { company, title, status, url, notes } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO jobs (company, title, status, url, notes) VALUES (?, ?, ?, ?, ?)',
      [company, title, status || 'applied', url, notes]
    );
    res.status(201).json({ id: result.insertId, message: 'Job created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateJob = async (req, res) => {
  const { company, title, status, url, notes } = req.body;
  try {
    await pool.query(
      'UPDATE jobs SET company=?, title=?, status=?, url=?, notes=? WHERE id=?',
      [company, title, status, url, notes, req.params.id]
    );
    res.json({ message: 'Job updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    await pool.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob };
