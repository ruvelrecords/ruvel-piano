'use client';

import { useToast } from '@/contexts/ToastContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  error: <AlertCircle className="w-4 h-4 text-red-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  info: <Info className="w-4 h-4 text-blue-400" />,
};

const borders = {
  success: 'border-emerald-500/30',
  error: 'border-red-500/30',
  warning: 'border-yellow-500/30',
  info: 'border-blue-500/30',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[9999] flex flex-col gap-2 md:bottom-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border ${borders[toast.type]} rounded-xl shadow-2xl min-w-[280px] max-w-sm animate-slide-up`}
        >
          {icons[toast.type]}
          <span className="flex-1 text-sm text-white">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#888888] hover:text-white transition-colors ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
