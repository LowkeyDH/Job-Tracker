const fs = require('fs');
const { PdfReader } = require('pdfreader');
const mammoth = require('mammoth');
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
    const fileName = req.file.originalname.toLowerCase();
    let fileContent;

    if (fileName.endsWith('.pdf')) {
      fileContent = await extractPdfText(fileBuffer);
    } else if (fileName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      fileContent = result.value;
    } else {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or Word (.docx) file.' });
    }

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

    const result = await pool.query(
      'INSERT INTO resumes (filename, analysis, user_id) VALUES ($1, $2, $3) RETURNING id',
      [req.file.originalname, JSON.stringify(analysis), req.user.id]
    );

    fs.unlinkSync(req.file.path);

    res.status(201).json({ id: result.rows[0].id, analysis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAnalysis = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resumes WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Resume not found' });
    const row = result.rows[0];
    const analysis = typeof row.analysis === 'string' ? JSON.parse(row.analysis) : row.analysis;
    res.json({ ...row, analysis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadResume, getAnalysis };
