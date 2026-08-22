import React, { useState, useEffect } from 'react';
import { Loader2, Save, AlertTriangle } from 'lucide-react';
import { getSettings, updateSettings } from '../services/settingsService';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const [threshold, setThreshold] = useState('');
  const [originalThreshold, setOriginalThreshold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  
  const toast = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        if (isMounted) {
          setThreshold(data.auto_resolution_threshold.toString());
          setOriginalThreshold(data.auto_resolution_threshold);
        }
      } catch (err) {
        if (isMounted) {
          toast.error('Failed to load settings.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSettings();
    return () => { isMounted = false; };
  }, []);

  const handleSaveInit = (e) => {
    e.preventDefault();
    const val = parseInt(threshold, 10);
    if (isNaN(val) || val < 0 || val > 100) {
      toast.error('Threshold must be a number between 0 and 100.');
      return;
    }

    if (val < originalThreshold) {
      setShowWarning(true);
    } else {
      confirmSave(val);
    }
  };

  const confirmSave = async (val) => {
    setShowWarning(false);
    setSaving(true);
    try {
      await updateSettings({ auto_resolution_threshold: val });
      setOriginalThreshold(val);
      toast.success('Settings saved successfully.');
    } catch (err) {
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure global application and AI parameters.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Auto-Resolution Settings</h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSaveInit} className="space-y-4">
            <div>
              <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">
                Threshold
              </label>
              <div className="relative w-32">
                <input
                  type="number"
                  id="threshold"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-8"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                  %
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 max-w-sm">
                Transactions with AI confidence at or above this value can be automatically resolved.
              </p>
            </div>


            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>

      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Lowering Threshold</h3>
            </div>
            <p className="text-gray-700 mb-2">
              Are you sure you want to change the auto-resolution threshold from <strong className="text-gray-900">{originalThreshold}%</strong> to <strong className="text-gray-900">{threshold}%</strong>?
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Lower thresholds may allow more transactions to be automatically resolved. This decreases human review but may increase risk.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmSave(parseInt(threshold, 10))}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
