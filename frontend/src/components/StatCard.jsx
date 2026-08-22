import React from 'react';

export default function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {Icon && <Icon className="h-5 w-5 text-indigo-500" />}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  );
}
