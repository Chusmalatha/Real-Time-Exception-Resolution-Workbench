import { getTransactions } from './transactionService';

export const getDashboardStats = async () => {
  try {
    const { transactions } = await getTransactions({ limit: 100 }); // Get a batch to calculate stats for now
    
    const totalExceptions = transactions.length;
    const pendingReview = transactions.filter(t => ['PENDING', 'HUMAN_REVIEW', 'ESCALATED'].includes(t.status)).length;
    const highRisk = transactions.filter(t => t.risk_level === 'HIGH' || t.risk_level === 'CRITICAL').length;
    const resolved = transactions.filter(t => ['RESOLVED', 'AUTO_RESOLVED'].includes(t.status)).length;

    return {
      totalExceptions,
      pendingReview,
      highRisk,
      resolved
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
    // Return fallback zeroes if backend fails
    return {
      totalExceptions: 0,
      pendingReview: 0,
      highRisk: 0,
      resolved: 0
    };
  }
};

export const getRecentExceptions = async () => {
  try {
    const data = await getTransactions({ limit: 10 });
    return data.transactions;
  } catch (error) {
    console.error("Failed to fetch recent exceptions", error);
    return [];
  }
};
