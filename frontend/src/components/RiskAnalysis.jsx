import React from 'react';
import { AlertTriangle, AlertOctagon, ShieldCheck, Info } from 'lucide-react';
import RiskBadge from './RiskBadge';
import { RISK_LEVELS, riskLevelToDots, riskColors } from '../utils/riskConfig';

/**
 * RiskAnalysis — displays risk level, flag reasons, and visual risk indicator.
 * Props:
 *   transaction (object) — full transaction object from the API
 *   threshold   (number) — auto-resolution threshold
 */
export default function RiskAnalysis({ transaction, threshold }) {
  const riskLevel = transaction?.risk_level;
  const flagReasons = transaction?.flag_reasons;
  const normalised = riskLevel?.toUpperCase();
  const colors = riskColors(normalised);
  const filledDots = riskLevelToDots(normalised);

  const RiskIcon = () => {
    switch (normalised) {
      case 'CRITICAL': return <AlertOctagon className="w-5 h-5 text-rose-600" />;
      case 'HIGH':     return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'MEDIUM':   return <Info className="w-5 h-5 text-amber-600" />;
      default:         return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
    }
  };

  const reasons = Array.isArray(flagReasons) ? flagReasons : [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-gray-400" />
          Risk Analysis
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Risk Level Row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Risk Level</p>
            <div className="flex items-center gap-2">
              <RiskIcon />
              <RiskBadge risk={normalised} />
            </div>
          </div>

          {/* Dot Visualisation */}
          <div className="flex flex-col items-end gap-1">
            <p className="text-xs text-gray-400 mb-1">Severity</p>
            <div className="flex items-center gap-1.5">
              {RISK_LEVELS.map((level, i) => (
                <div
                  key={level}
                  title={level}
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    i < filledDots
                      ? `${colors.dot} border-transparent`
                      : 'bg-gray-100 border-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {RISK_LEVELS.map((l, i) => (
                <span key={l} className={i < filledDots ? colors.text : 'text-gray-300'}>
                  {i < filledDots ? '●' : '○'}
                  {i < RISK_LEVELS.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Discrete level bar */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            {RISK_LEVELS.map((level, i) => (
              <div
                key={level}
                className={`h-2 flex-1 rounded-sm transition-all ${
                  i < filledDots ? colors.dot : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>LOW</span>
            <span>MEDIUM</span>
            <span>HIGH</span>
            <span>CRITICAL</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Flag Reasons */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Flag Reasons
          </p>
          {reasons.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No specific flag reasons available.</p>
          ) : (
            <ul className="space-y-2">
              {reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="mt-0.5 shrink-0">
                    <AlertTriangle className={`w-3.5 h-3.5 ${
                      normalised === 'CRITICAL' ? 'text-rose-500' :
                      normalised === 'HIGH'     ? 'text-red-500'   :
                      normalised === 'MEDIUM'   ? 'text-amber-500' :
                                                  'text-emerald-500'
                    }`} />
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* AI Confidence & Eligibility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-indigo-50 border border-indigo-100 p-3 rounded">
            <strong className="block text-indigo-900 mb-0.5 text-sm">AI Confidence</strong>
            <span className="text-xl font-bold text-indigo-700">{transaction?.confidence}%</span>
            <span className="text-xs text-indigo-500 ml-2">(Threshold: {threshold}%)</span>
          </div>
          <div className={`border p-3 rounded flex flex-col justify-center items-center text-center ${
            transaction?.confidence >= threshold && transaction?.risk_level !== 'CRITICAL' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <strong className="block mb-1 text-xs uppercase tracking-wide">Auto-Resolution</strong>
            <span className="font-bold flex items-center gap-1.5 text-sm">
              {transaction?.confidence >= threshold && transaction?.risk_level !== 'CRITICAL' ? (
                <><ShieldCheck className="w-4 h-4" /> ELIGIBLE</>
              ) : (
                <><AlertTriangle className="w-4 h-4" /> MANUAL REVIEW</>
              )}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
