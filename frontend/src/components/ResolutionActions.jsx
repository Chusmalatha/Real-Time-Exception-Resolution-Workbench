import React, { useState } from 'react';
import {
  BrainCircuit, Lightbulb, CheckCircle2, ArrowUpCircle, Loader2
} from 'lucide-react';
import { resolveTransaction, autoResolveTransaction, getResolutionRecord } from '../services/transactionService';
import ResolutionModal from './ResolutionModal';
import { useToast } from '../context/ToastContext';

/**
 * ResolutionActions — reviewer action buttons.
 *
 * Props:
 *   transaction  (object)   — full transaction object from the API
 *   onStatusChange (fn)     — called with the updated transaction after a status change
 *
 * AI actions (Explain / Suggest) are placeholder-only in Part 4.
 * Resolve / Escalate call the backend; the backend enforces the threshold.
 */
export default function ResolutionActions({ transaction, threshold, onStatusChange }) {
  const [autoResolving, setAutoResolving]     = useState(false);
  const [modalAction, setModalAction]         = useState(null); // 'APPROVE' | 'BLOCK' | 'REQUEST_VERIFICATION' | 'ESCALATE'
  const [modalLoading, setModalLoading]       = useState(false);
  const [resolutionRecord, setResolutionRecord] = useState(null);
  
  const toast = useToast();

  const isResolvable = ['PENDING', 'HUMAN_REVIEW'].includes(transaction.status);
  const isAlreadyClosed = ['RESOLVED', 'AUTO_RESOLVED', 'ESCALATED'].includes(transaction.status);

  React.useEffect(() => {
    if (isAlreadyClosed) {
      getResolutionRecord(transaction.transaction_id)
        .then(setResolutionRecord)
        .catch(() => {});
    }
  }, [transaction.transaction_id, isAlreadyClosed]);

  const handleConfirmResolution = async (action, reviewer, reason) => {
    if (!isResolvable) return;
    setModalLoading(true);
    try {
      const updated = await resolveTransaction(transaction.transaction_id, action, reviewer, reason);
      toast.success(`Transaction ${transaction.transaction_id} has been resolved successfully.`);
      setModalAction(null);
      if (onStatusChange) onStatusChange(updated);
    } catch (err) {
      const detail = err?.response?.data?.detail || 'The backend rejected the resolve request.';
      toast.error(detail);
    } finally {
      setModalLoading(false);
    }
  };

  const handleAutoResolve = async () => {
    if (!isResolvable) return;
    setAutoResolving(true);
    try {
      const response = await autoResolveTransaction(transaction.transaction_id);
      if (response.success) {
        toast.success(`Transaction automatically resolved. Status: ${response.status}`);
        if (onStatusChange) {
          onStatusChange({ ...transaction, status: response.status });
        }
      } else {
        toast.warning(`Automatic resolution not allowed. Status: ${response.status}`);
      }
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Auto-resolve request failed.';
      toast.error(detail);
    } finally {
      setAutoResolving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">Resolution Actions</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          All status changes are validated by the backend. The frontend does not modify transaction state directly.
        </p>
      </div>

      <div className="p-6 space-y-4">
        {/* Closed-state notice */}
        {isAlreadyClosed && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-md px-4 py-3">
            <p className="mb-2">This transaction is already <strong>{transaction.status}</strong>. No further actions are available.</p>
            {resolutionRecord && (
              <div className="mt-3 bg-white border border-blue-100 rounded p-3 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div><span className="text-gray-500">Event Type:</span> <strong className="text-blue-900">{resolutionRecord.event_type}</strong></div>
                  <div><span className="text-gray-500">Actor:</span> <strong className="text-blue-900">{resolutionRecord.actor}</strong></div>
                  <div><span className="text-gray-500">Status Change:</span> <strong className="text-blue-900">{resolutionRecord.previous_status || 'Unknown'} &rarr; {resolutionRecord.new_status || 'Unknown'}</strong></div>
                  <div><span className="text-gray-500">Date:</span> <strong className="text-blue-900">{new Date(resolutionRecord.timestamp).toLocaleString()}</strong></div>
                </div>
                <div className="mt-2"><span className="text-gray-500">Description:</span> <span className="text-gray-900">{resolutionRecord.description}</span></div>
              </div>
            )}
          </div>
        )}



        {/* Divider */}
        <div className="border-t border-gray-100" />
        
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Human Decision</h3>
          {/* Threshold reminder for low-confidence */}
          {transaction.confidence < threshold && isResolvable && (
            <div className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">
              AI confidence ({transaction.confidence}%) is below threshold. Manual review required.
            </div>
          )}
        </div>

        {/* Primary actions */}
        {isResolvable && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setModalAction('APPROVE')}
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => setModalAction('BLOCK')}
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
            >
              Block
            </button>
            <button
              onClick={() => setModalAction('REQUEST_VERIFICATION')}
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors"
            >
              Request Verif.
            </button>
            <button
              onClick={() => setModalAction('ESCALATE')}
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
            >
              Escalate
            </button>
          </div>
        )}

        {isResolvable && (
          <div className="pt-2">
            <button
              onClick={handleAutoResolve}
              disabled={autoResolving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 disabled:opacity-50 transition-colors"
            >
              {autoResolving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Checking AI Eligibility…</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Execute Auto-Resolve (if eligible)</>
              )}
            </button>
          </div>
        )}
      </div>

      {modalAction && (
        <ResolutionModal
          action={modalAction}
          loading={modalLoading}
          onConfirm={handleConfirmResolution}
          onCancel={() => setModalAction(null)}
        />
      )}
    </div>
  );
}
