const fs = require('fs');
const { PdfReader } = require('pdfreader');
const OpenAI = require('openai');
const pool = require('../db/connection');

const client = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const extractPdfText = (buffer) => new Promise((resolve, reject) => {
  const rows = {};
  new PdfReader().parseBuffer(buffer, (err, item) => {
    if (err) return reject(err);
    if (!item) return resolve(Object.values(rows).join('\n'));
    if (item.text) rows[item.y] = (rows[item.y] || '') + item.text + ' ';
  });
});

const uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const isPdf = req.file.originalname.toLowerCase().endsWith('.pdf');
    const fileContent = isPdf
      ? await extractPdfText(fileBuffer)
      : fileBuffer.toString('utf-8');

    const completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: `Extract skills, experience, and education from this resume. Return ONLY valid JSON with these exact keys: skills (array of strings), experience (array of {title, company, years}), education (array of {degree, school}). No explanation, just JSON.\n\n${fileContent}`,
        },
      ],
      max_tokens: 4096,
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
    const analysis = typeof rows[0].analysis === 'string'
      ? JSON.parse(rows[0].analysis)
      : rows[0].analysis;
    res.json({ ...rows[0], analysis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadResume, getAnalysis };
