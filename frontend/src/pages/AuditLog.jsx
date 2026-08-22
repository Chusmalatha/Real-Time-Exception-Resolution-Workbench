import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../services/auditService';
import { Loader2, ActivitySquare } from 'lucide-react';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);
        setError("Unable to load audit logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin" />
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
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <ActivitySquare className="w-6 h-6 text-indigo-600" />
          Audit Log
        </h1>
        <p className="text-gray-600 mt-1">Review system events, AI analysis, and human resolution actions.</p>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No audit logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Actor</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Context</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {log.transaction_id || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{log.event_type}</div>
                      <div className="text-gray-500 mt-1">{log.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {log.actor}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {log.confidence !== null && <div>Confidence: {log.confidence}%</div>}
                      {log.threshold !== null && <div>Threshold: {log.threshold}%</div>}
                      {log.previous_status && log.new_status && (
                        <div className="mt-1">
                          <span className="line-through mr-1">{log.previous_status}</span> &rarr; <span className="font-medium text-indigo-700 ml-1">{log.new_status}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
