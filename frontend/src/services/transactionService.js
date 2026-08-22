import api from './api';

export const getTransactions = async (params = {}) => {
  const response = await api.get('/transactions', { params });
  return response.data;
};

export const getTransactionById = async (transactionId) => {
  const response = await api.get(`/transactions/${transactionId}`);
  return response.data;
};

export const getResolutionRecord = async (transactionId) => {
  const response = await api.get(`/transactions/${transactionId}/resolution`);
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await api.post('/transactions', transactionData);
  return response.data;
};

export const updateTransaction = async (transactionId, updateData) => {
  const response = await api.patch(`/transactions/${transactionId}`, updateData);
  return response.data;
};

/**
 * Request the backend to process a human resolution action.
 */
export const resolveTransaction = async (transactionId, action, reviewer, reason) => {
  const response = await api.post(`/transactions/${transactionId}/resolve`, {
    action,
    reviewer,
    reason
  });
  return response.data;
};

/**
 * Request the backend to execute an AI resolution recommendation.
 */
export const executeResolution = async (transactionId, action) => {
  const response = await api.post(`/transactions/${transactionId}/execute-resolution`, { action });
  return response.data;
};

export const autoResolveTransaction = async (transactionId) => {
  const response = await api.post(`/transactions/${transactionId}/auto-resolve`);
  return response.data;
};
