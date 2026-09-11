import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function AlertBanner({ type = 'error', message, onClose }) {
  if (!message) return null;
  const config = {
    error:   { cls: 'bg-red-900/50 border-red-700 text-red-300',     Icon: XCircle },
    success: { cls: 'bg-green-900/50 border-green-700 text-green-300', Icon: CheckCircle },
    warning: { cls: 'bg-yellow-900/50 border-yellow-700 text-yellow-300', Icon: AlertTriangle },
  };
  const { cls, Icon } = config[type] || config.error;
  return (
    <div className={`flex items-center justify-between p-3 mb-4 rounded-lg border ${cls}`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-4 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
