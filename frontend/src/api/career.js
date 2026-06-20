import client from './client';

export const analyzeCareer = (resumeId) => client.post('/career', { resumeId });
