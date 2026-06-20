require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db/connection');

const jobRoutes = require('./routes/jobs');
const resumeRoutes = require('./routes/resume');
const matchRoutes = require('./routes/match');
const careerRoutes = require('./routes/career');
const atsRoutes = require('./routes/ats');
const jobSearchRoutes = require('./routes/jobSearch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Job Tracker API is running' });
});

app.use('/api/jobs', jobRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/search', jobSearchRoutes);

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      company VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'applied',
      url TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS resumes (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      analysis JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Database tables ready');
};

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err.message);
    process.exit(1);
  });
