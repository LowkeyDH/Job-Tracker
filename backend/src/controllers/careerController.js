const OpenAI = require('openai');
const pool = require('../db/connection');

const client = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const analyzeCareer = async (req, res) => {
  const { resumeId } = req.body;

  if (!resumeId) return res.status(400).json({ error: 'resumeId is required' });

  try {
    const [[resume]] = await pool.query('SELECT * FROM resumes WHERE id = ?', [resumeId]);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const analysis = typeof resume.analysis === 'string'
      ? JSON.parse(resume.analysis)
      : resume.analysis;

    const completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: `You are a career advisor. Based on this person's resume, identify the top 6 career paths they are suited for — including obvious matches AND adjacent possibilities they might not have considered.

Resume skills: ${JSON.stringify(analysis.skills)}
Resume experience: ${JSON.stringify(analysis.experience)}
Resume education: ${JSON.stringify(analysis.education)}

Return ONLY valid JSON: an array of exactly 6 objects with these keys:
- career (string): job title or career path
- percentage (number 0-100): how well their background fits
- reason (string): one sentence explaining why

No explanation, just JSON array.`,
        },
      ],
      max_tokens: 2048,
    });

    const rawText = completion.choices[0].message.content;
    const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const careers = JSON.parse(jsonText);

    res.json({ resumeId, careers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { analyzeCareer };
