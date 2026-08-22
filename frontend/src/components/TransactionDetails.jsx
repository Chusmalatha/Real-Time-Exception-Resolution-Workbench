import React from 'react';
import { CreditCard, User, DollarSign, MapPin, Smartphone, Clock, Hash } from 'lucide-react';

/**
 * TransactionDetails — displays the core transaction overview.
 * Props:
 *   transaction  (object) — the full transaction document from the API
 */
export default function TransactionDetails({ transaction }) {
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: transaction.currency || 'INR',
    maximumFractionDigits: 0,
  }).format(transaction.amount);

  const formattedAvg = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: transaction.currency || 'INR',
    maximumFractionDigits: 0,
  }).format(transaction.average_transaction_amount);

  const formattedTime = new Date(transaction.transaction_time).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const fields = [
    {
      label: 'Transaction ID',
      value: <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">{transaction.transaction_id}</span>,
      icon: <Hash className="w-4 h-4" />,
    },
    { label: 'Customer Name',  value: transaction.customer_name,  icon: <User className="w-4 h-4" /> },
    { label: 'Amount',         value: <span className="text-lg font-semibold text-gray-900">{formattedAmount}</span>, icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Currency',       value: transaction.currency,        icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Avg Transaction',value: formattedAvg,                icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Transaction Time',value: formattedTime,              icon: <Clock className="w-4 h-4" /> },
    { label: 'Location',       value: transaction.location,        icon: <MapPin className="w-4 h-4" /> },
    { label: 'Usual Location', value: transaction.usual_location,  icon: <MapPin className="w-4 h-4" /> },
    { label: 'Device',         value: transaction.device,          icon: <Smartphone className="w-4 h-4" /> },
    { label: 'Usual Device',   value: transaction.usual_device,    icon: <Smartphone className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-400" />
          Transaction Overview
        </h2>
      </div>

      <dl className="divide-y divide-gray-100">
        {fields.map(({ label, value, icon }) => (
          <div key={label} className="px-6 py-3.5 flex items-start gap-3 sm:grid sm:grid-cols-5 sm:gap-4">
            <dt className="flex items-center gap-1.5 text-sm text-gray-500 sm:col-span-2 shrink-0">
              <span className="text-gray-400">{icon}</span>
              {label}
            </dt>
            <dd className="text-sm text-gray-800 sm:col-span-3 font-medium">
              {value ?? <span className="text-gray-400 italic">N/A</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-2 text-xs text-gray-400">
        <span>Created: {new Date(transaction.created_at).toLocaleString('en-IN')}</span>
        <span className="hidden sm:inline">·</span>
        <span>Updated: {new Date(transaction.updated_at).toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
