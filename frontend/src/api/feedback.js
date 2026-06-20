import client from './client';

export const submitFeedback = (rating, message) => client.post('/feedback', { rating, message });
export const getFeedback = () => client.get('/feedback');
