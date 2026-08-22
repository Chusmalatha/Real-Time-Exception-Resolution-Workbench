import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import TransactionRow from '../components/TransactionRow';
import { getDashboardStats, getRecentExceptions } from '../services/dashboardService';
import { ListTodo, CheckCircle, AlertTriangle, AlertOctagon, User, Bot } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!stats) setLoading(true);
        const [statsData, exceptionsData] = await Promise.all([
          getDashboardStats(),
          getRecentExceptions()
        ]);
        setStats(statsData);
        setExceptions(exceptionsData);
        setError(null);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 font-medium">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor transaction exceptions and review activity.</p>
        </div>
        <div className="mt-4 sm:mt-0 text-xs text-gray-400">
          Last updated: Just now
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Exceptions" 
          value={stats.totalExceptions} 
          icon={ListTodo} 
        />
        <StatCard 
          title="Action Required" 
          value={stats.pendingReview} 
          icon={AlertTriangle} 
        />
        <StatCard 
          title="High Risk" 
          value={stats.highRisk} 
          icon={AlertOctagon} 
        />
        <StatCard 
          title="Completed" 
          value={stats.resolved} 
          icon={CheckCircle} 
        />
      </div>

      {/* Recent Exceptions Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Exceptions</h2>
          <p className="text-sm text-gray-500">Latest flagged transactions requiring attention.</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          {exceptions.length === 0 ? (
            <div className="p-8 text-center">
              <h3 className="text-sm font-medium text-gray-900">No exceptions found</h3>
              <p className="text-sm text-gray-500 mt-1">There are currently no flagged transactions requiring attention.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exceptions.map((txn) => (
                    <TransactionRow key={txn.id} transaction={txn} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
