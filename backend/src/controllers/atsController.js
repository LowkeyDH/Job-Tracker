const OpenAI = require('openai');
const pool = require('../db/connection');

const client = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const analyzeATS = async (req, res) => {
  const { resumeId } = req.body;

  if (!resumeId) return res.status(400).json({ error: 'resumeId is required' });

  try {
    const resumeResult = await pool.query('SELECT * FROM resumes WHERE id = $1', [resumeId]);
    if (resumeResult.rows.length === 0) return res.status(404).json({ error: 'Resume not found' });
    const resume = resumeResult.rows[0];

    const analysis = typeof resume.analysis === 'string'
      ? JSON.parse(resume.analysis)
      : resume.analysis;

    const completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: `You are an ATS (Applicant Tracking System) expert. Analyze this resume for ATS compatibility and return ONLY valid JSON with these exact keys:

- score (number 0-100): overall ATS compatibility score
- summary (string): one sentence overall assessment
- issues (array of { category, problem, fix }): specific problems found, each with category (e.g. "Keywords", "Achievements", "Formatting"), the problem, and how to fix it
- strengths (array of strings): what the resume does well for ATS

Resume data:
Skills: ${JSON.stringify(analysis.skills)}
Experience: ${JSON.stringify(analysis.experience)}
Education: ${JSON.stringify(analysis.education)}

Be specific and actionable. No explanation, just JSON.`,
        },
      ],
      max_tokens: 2048,
    });

    const rawText = completion.choices[0].message.content;
    const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const result = JSON.parse(jsonText);

    res.json({ resumeId, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { analyzeATS };
