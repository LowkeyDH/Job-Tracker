require('dotenv').config();
const express = require('express');
const cors = require('cors');

const jobRoutes = require('./routes/jobs');
const resumeRoutes = require('./routes/resume');
const matchRoutes = require('./routes/match');

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
