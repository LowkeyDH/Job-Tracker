const fs = require('fs');
const OpenAI = require('openai');
const pool = require('../db/connection');

const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_TOKEN,
});

const uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const fileContent = fs.readFileSync(req.file.path, 'utf-8');

    const completion = await client.chat.completions.create({
      model: 'moonshotai/Kimi-K2-Instruct-0905',
      messages: [
        {
          role: 'user',
          content: `Extract skills, experience, and education from this resume. Return ONLY valid JSON with these exact keys: skills (array of strings), experience (array of {title, company, years}), education (array of {degree, school}). No explanation, just JSON.\n\n${fileContent}`,
        },
      ],
      max_tokens: 1024,
    });

    const rawText = completion.choices[0].message.content;
    const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const analysis = JSON.parse(jsonText);

    const [result] = await pool.query(
      'INSERT INTO resumes (filename, analysis) VALUES (?, ?)',
      [req.file.originalname, JSON.stringify(analysis)]
    );

    fs.unlinkSync(req.file.path);

    res.status(201).json({ id: result.insertId, analysis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAnalysis = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM resumes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Resume not found' });
    res.json({ ...rows[0], analysis: JSON.parse(rows[0].analysis) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadResume, getAnalysis };
