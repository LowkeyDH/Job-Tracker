const axios = require('axios');

const searchJobs = async (req, res) => {
  const { what, where, country = 'us', level = '', internship = 'false', page = '1' } = req.query;

  if (!what) return res.status(400).json({ error: 'Job title is required' });

  // Build search keyword: internship overrides level
  let keyword = what.trim();
  if (internship === 'true') {
    keyword = `intern ${keyword}`;
  } else if (level) {
    keyword = `${level} ${keyword}`;
  }

  try {
    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`,
      {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_APP_KEY,
          what: keyword,
          where: where || '',
          results_per_page: 10,
          'content-type': 'application/json',
        },
      }
    );

    const jobs = response.data.results.map((job) => ({
      title: job.title,
      company: job.company?.display_name || 'Unknown',
      location: job.location?.display_name || '',
      salary: job.salary_min
        ? `$${Math.round(job.salary_min / 1000)}k – $${Math.round(job.salary_max / 1000)}k`
        : null,
      description: job.description?.slice(0, 200) + '...',
      url: job.redirect_url,
    }));

    res.json({ count: response.data.count, jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { searchJobs };
