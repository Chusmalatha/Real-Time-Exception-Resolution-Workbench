import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function ResolutionModal({ action, onConfirm, onCancel, loading }) {
  const [reviewer, setReviewer] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reviewer.trim() || !reason.trim()) return;
    onConfirm(action, reviewer, reason);
  };

  const getActionColor = () => {
    switch (action) {
      case 'APPROVE': return 'text-emerald-700 bg-emerald-50';
      case 'BLOCK': return 'text-red-700 bg-red-50';
      case 'REQUEST_VERIFICATION': return 'text-amber-700 bg-amber-50';
      case 'ESCALATE': return 'text-orange-700 bg-orange-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Confirm Resolution</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Decision</label>
            <div className={`px-4 py-2 rounded-md font-semibold border ${getActionColor()}`}>
              {action}
            </div>
          </div>

          <div>
            <label htmlFor="reviewer" className="block text-sm font-medium text-gray-700 mb-1">
              Reviewer Name
            </label>
            <input
              type="text"
              id="reviewer"
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="e.g., Jane Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Explain why this decision was made..."
              required
            />
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !reviewer.trim() || !reason.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Confirm Decision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
