require('dotenv').config();
const express = require('express');
const cors = require('cors');

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
