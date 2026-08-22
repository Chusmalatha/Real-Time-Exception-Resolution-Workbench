import api from './api';

export const explainTransaction = async (transactionId) => {
  const response = await api.post('/ai/explain', { transaction_id: transactionId });
  return response.data;
};

export const chatWithAI = async (transactionId, message) => {
  const response = await api.post('/ai/chat', { transaction_id: transactionId, message });
  return response.data;
};

export const suggestResolution = async (transactionId) => {
  const response = await api.post('/ai/suggest-resolution', { transaction_id: transactionId });
  return response.data;
};
