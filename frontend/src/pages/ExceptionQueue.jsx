import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import TransactionRow from '../components/TransactionRow';
import { getTransactions } from '../services/transactionService';

export default function ExceptionQueue() {
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [riskFilter, setRiskFilter] = useState('All Risks');
  const [sortOption, setSortOption] = useState('Default');

  // Debounce for search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!transactions) setLoading(true);
        const data = await getTransactions({
          status: statusFilter === 'All Statuses' ? null : statusFilter,
          risk: riskFilter === 'All Risks' ? null : riskFilter,
          search: debouncedSearch || null
        });
        
        let fetchedTxns = data.transactions;
        
        // Frontend sorting since backend doesn't support all sorts yet
        if (sortOption === 'Confidence: High to Low') {
          fetchedTxns.sort((a, b) => b.confidence - a.confidence);
        } else if (sortOption === 'Confidence: Low to High') {
          fetchedTxns.sort((a, b) => a.confidence - b.confidence);
        } else if (sortOption === 'Amount: High to Low') {
          fetchedTxns.sort((a, b) => b.amount - a.amount);
        } else if (sortOption === 'Amount: Low to High') {
          fetchedTxns.sort((a, b) => a.amount - b.amount);
        }

        setTransactions(fetchedTxns);
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Unable to load transactions. Please check the backend connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, [debouncedSearch, statusFilter, riskFilter, sortOption]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-1">Review flagged and resolved transactions.</p>
      </div>

      {/* Controls Area */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm items-center">
        <div className="relative flex-1 w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-full">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <select
            className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="HUMAN_REVIEW">HUMAN_REVIEW</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="AUTO_RESOLVED">AUTO_RESOLVED</option>
            <option value="ESCALATED">ESCALATED</option>
          </select>

          <select
            className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border bg-white"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option>All Risks</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>

          <select
            className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border bg-white"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option>Default</option>
            <option>Confidence: High to Low</option>
            <option>Confidence: Low to High</option>
            <option>Amount: High to Low</option>
            <option>Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading transactions...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">No transactions found</h3>
            <p className="text-sm text-gray-500 mt-2">Try changing your search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flag Reason</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((txn) => (
                  <TransactionRow key={txn.transaction_id} transaction={txn} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
