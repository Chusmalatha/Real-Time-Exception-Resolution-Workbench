import api from './api';

export const getAuditLogs = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.transactionId) query.append('transaction_id', params.transactionId);
  if (params.eventType) query.append('event_type', params.eventType);
  if (params.limit) query.append('limit', params.limit);
  
  const response = await api.get(`/audit-logs?${query.toString()}`);
  return response.data;
};
