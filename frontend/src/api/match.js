import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

export const matchResume = (resumeId, jobId) =>
  API.post('/match', { resumeId, jobId });
