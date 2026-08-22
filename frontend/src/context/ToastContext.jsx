import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handleGlobalError = (event) => {
      addToast(event.detail, 'error');
    };
    window.addEventListener('global-api-error', handleGlobalError);
    return () => window.removeEventListener('global-api-error', handleGlobalError);
  }, [addToast]);

  const success = (msg) => addToast(msg, 'success');
  const error = (msg) => addToast(msg, 'error');
  const warning = (msg) => addToast(msg, 'warning');
  const info = (msg) => addToast(msg, 'info');

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-md shadow-lg border min-w-[300px] animate-in slide-in-from-right-4 fade-in ${
              toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
              toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5" />}
            {toast.type === 'info' && <Info className="w-5 h-5" />}
            
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
