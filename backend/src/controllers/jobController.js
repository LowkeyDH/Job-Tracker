const pool = require('../db/connection');

const getAllJobs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createJob = async (req, res) => {
  const { company, title, status, url, notes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO jobs (company, title, status, url, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [company, title, status || 'applied', url, notes]
    );
    res.status(201).json({ id: result.rows[0].id, message: 'Job created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateJob = async (req, res) => {
  const { company, title, status, url, notes } = req.body;
  try {
    await pool.query(
      'UPDATE jobs SET company=$1, title=$2, status=$3, url=$4, notes=$5 WHERE id=$6',
      [company, title, status, url, notes, req.params.id]
    );
    res.json({ message: 'Job updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    await pool.query('DELETE FROM jobs WHERE id = $1', [req.params.id]);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob };
