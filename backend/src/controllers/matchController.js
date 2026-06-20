const OpenAI = require('openai');
const pool = require('../db/connection');

const client = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const matchResume = async (req, res) => {
  const { resumeId, jobId } = req.body;

  if (!resumeId || !jobId) {
    return res.status(400).json({ error: 'resumeId and jobId are required' });
  }

  try {
    const resumeResult = await pool.query('SELECT * FROM resumes WHERE id = $1', [resumeId]);
    if (resumeResult.rows.length === 0) return res.status(404).json({ error: 'Resume not found' });
    const resume = resumeResult.rows[0];

    const jobResult = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
    if (jobResult.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    const job = jobResult.rows[0];

    const analysis = typeof resume.analysis === 'string' ? JSON.parse(resume.analysis) : resume.analysis;

    const completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: `You are a career advisor. Compare this resume against the job and return ONLY valid JSON with these exact keys: score (number 0-100), matching_skills (array of strings), missing_skills (array of strings), recommendation (one sentence string). No explanation, just JSON.

Resume skills: ${JSON.stringify(analysis.skills)}
Resume experience: ${JSON.stringify(analysis.experience)}

Job title: ${job.title}
Company: ${job.company}`,
        },
      ],
      max_tokens: 1024,
    });

    const rawText = completion.choices[0].message.content;
    const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const result = JSON.parse(jsonText);

    res.json({ resumeId, jobId, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { matchResume };
