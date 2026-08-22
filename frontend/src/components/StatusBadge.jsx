import React from 'react';

const STATUS_CONFIG = {
  // Backend enum values (uppercase)
  PENDING:      { label: 'Pending',             styles: 'bg-gray-100 text-gray-700 border-gray-200'     },
  HUMAN_REVIEW: { label: 'Human Review',        styles: 'bg-amber-100 text-amber-700 border-amber-200' },
  RESOLVED:     { label: 'Resolved',            styles: 'bg-emerald-100 text-emerald-700 border-emerald-200'  },
  AUTO_RESOLVED:{ label: 'Auto Resolved',       styles: 'bg-blue-100 text-blue-700 border-blue-200'     },
  ESCALATED:    { label: 'Escalated',           styles: 'bg-purple-100 text-purple-700 border-purple-200'},
  // Legacy title-case fallbacks
  'Pending':             { label: 'Pending',       styles: 'bg-gray-100 text-gray-700 border-gray-200'     },
  'Resolved':            { label: 'Resolved',      styles: 'bg-emerald-100 text-emerald-700 border-emerald-200'  },
  'Human Review Required':{ label: 'Human Review', styles: 'bg-amber-100 text-amber-700 border-amber-200'},
  'Auto Resolved':       { label: 'Auto Resolved', styles: 'bg-blue-100 text-blue-700 border-blue-200'     },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];
  const label  = config?.label  ?? (status || 'Unknown');
  const styles = config?.styles ?? 'bg-gray-50 text-gray-500 border-gray-200';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}>
      {label}
    </span>
  );
}

