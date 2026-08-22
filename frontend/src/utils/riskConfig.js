/**
 * Centralized risk & auto-resolution configuration.
 *
// AUTO_RESOLUTION_THRESHOLD is now fetched dynamically from the backend settings API.

/**
 * Ordered risk levels, low → critical.
 * Used for visual indicators (dots, bars, etc.).
 */
export const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

/**
 * Returns how many "filled" dots to show for a given risk level (1-based, 1–4).
 */
export function riskLevelToDots(riskLevel) {
  const idx = RISK_LEVELS.indexOf(riskLevel?.toUpperCase());
  return idx === -1 ? 0 : idx + 1;
}

/**
 * Returns Tailwind colour tokens for a given risk level.
 */
export function riskColors(riskLevel) {
  switch (riskLevel?.toUpperCase()) {
    case 'LOW':      return { text: 'text-emerald-700', bg: 'bg-emerald-100', dot: 'bg-emerald-500', border: 'border-emerald-200' };
    case 'MEDIUM':   return { text: 'text-amber-700',   bg: 'bg-amber-100',   dot: 'bg-amber-500',   border: 'border-amber-200'   };
    case 'HIGH':     return { text: 'text-red-700',     bg: 'bg-red-100',     dot: 'bg-red-500',     border: 'border-red-200'     };
    case 'CRITICAL': return { text: 'text-rose-800',    bg: 'bg-rose-100',    dot: 'bg-rose-600',    border: 'border-rose-200'    };
    default:         return { text: 'text-gray-700',    bg: 'bg-gray-100',    dot: 'bg-gray-400',    border: 'border-gray-200'    };
  }
}
