import React from 'react';

export default function RiskBadge({ risk }) {
  let styles = '';

  switch (risk?.toUpperCase()) {
    case 'CRITICAL':
      styles = 'bg-rose-100 text-rose-800 border-rose-200';
      break;
    case 'HIGH':
      styles = 'bg-red-50 text-red-700 border-red-200';
      break;
    case 'MEDIUM':
      styles = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'LOW':
      styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    default:
      styles = 'bg-gray-50 text-gray-700 border-gray-200';
      break;
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}>
      {risk || 'UNKNOWN'}
    </span>
  );
}
