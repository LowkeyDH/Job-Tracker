import client from './client';

export const analyzeATS = (resumeId) => client.post('/ats', { resumeId });
