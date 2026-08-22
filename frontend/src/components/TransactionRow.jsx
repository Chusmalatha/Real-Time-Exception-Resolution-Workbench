import React from 'react';
import { Link } from 'react-router-dom';
import RiskBadge from './RiskBadge';
import StatusBadge from './StatusBadge';
import { Eye } from 'lucide-react';

export default function TransactionRow({ transaction }) {
  // Format currency
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: transaction.currency || 'INR',
    maximumFractionDigits: 0
  }).format(transaction.amount);

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {transaction.transaction_id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {transaction.customer_name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {formattedAmount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <RiskBadge risk={transaction.risk_level} />
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
        {transaction.flag_reasons?.join(', ')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {transaction.confidence}%
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={transaction.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link 
          to={`/exceptions/${transaction.transaction_id}`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
        >
          <Eye className="w-4 h-4 mr-1.5" />
          View
        </Link>
      </td>
    </tr>
  );
}
