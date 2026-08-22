import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { getTransactionById } from '../services/transactionService';
import { getSettings } from '../services/settingsService';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import TransactionDetails from '../components/TransactionDetails';
import RiskAnalysis from '../components/RiskAnalysis';
import ResolutionActions from '../components/ResolutionActions';
import AIEmployeePanel from '../components/AIEmployeePanel';

// ── Loading skeleton ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
      <div className="h-4 w-40 bg-gray-200 rounded" />
      <div className="h-8 w-64 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 bg-gray-100 rounded-lg" />
        <div className="h-72 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-44 bg-gray-100 rounded-lg" />
      <div className="h-36 bg-gray-100 rounded-lg" />
    </div>
  );
}

// ── Error / not-found state ───────────────────────────────────────────────────
function ErrorState({ message }) {
  return (
    <div className="space-y-4 max-w-xl mx-auto mt-16 text-center">
      <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
      <p className="text-gray-700 font-medium">{message}</p>
      <Link
        to="/exceptions"
        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Exception Queue
      </Link>
    </div>
  );
}

// ── Page container ────────────────────────────────────────────────────────────
export default function TransactionDetailsPage() {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const [threshold, setThreshold]     = useState(90);

  const fetchTransactionAndSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [txnData, settingsData] = await Promise.all([
        getTransactionById(transactionId),
        getSettings()
      ]);
      setTransaction(txnData);
      setThreshold(settingsData.auto_resolution_threshold);
    } catch (err) {
      console.error('Error fetching transaction:', err);
      const httpStatus = err?.response?.status;
      setError(
        httpStatus === 404
          ? 'Transaction not found.'
          : 'Unable to load transaction details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  useEffect(() => { fetchTransactionAndSettings(); }, [fetchTransactionAndSettings]);

  // ResolutionActions calls this after a successful backend status change
  const handleStatusChange = (updated) => {
    setTransaction(updated);
  };

  if (loading) return <Skeleton />;
  if (error || !transaction) return <ErrorState message={error || 'Transaction not found.'} />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* ── Back link ── */}
      <Link
        to="/exceptions"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Exception Queue
      </Link>

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Transaction Review</h1>
          <p className="text-gray-500 mt-1 text-sm">
            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
              {transaction.transaction_id}
            </span>
            <span className="mx-2 text-gray-300">·</span>
            {transaction.customer_name}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <RiskBadge risk={transaction.risk_level} />
          <StatusBadge status={transaction.status} />
        </div>
      </div>

      {/*
        Information hierarchy (per spec):
          1. Transaction identity   → header above
          2. Transaction details    ↘
          3. Why it was flagged     ↗ Row 1 (two columns)
          4. Risk level            ─┘
          5. AI confidence          → Row 2 (full width)
          6. Auto-resolution        ↗ (inside ConfidenceIndicator)
          7. Available actions      → Row 3 (full width)
      */}

      {/* Row 1: Transaction details and Risk analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <TransactionDetails transaction={transaction} />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <RiskAnalysis
            transaction={transaction}
            threshold={threshold}
          />
        </div>
      </div>

      {/* Row 2: Resolution actions */}
      <ResolutionActions
        transaction={transaction}
        threshold={threshold}
        onStatusChange={handleStatusChange}
      />

      {/* AI Employee Drawer Panel */}
      <AIEmployeePanel transactionId={transaction.transaction_id} />
    </div>
  );
}
