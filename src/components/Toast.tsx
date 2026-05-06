import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const styles = {
    success: "border-neonGreen/50 bg-neonGreen/10",
    error: "border-neonPink/50 bg-neonPink/10",
    warning: "border-yellow-500/50 bg-yellow-500/10",
    info: "border-blue-500/50 bg-blue-500/10"
  };

  const iconColors = {
    success: "text-neonGreen",
    error: "text-neonPink",
    warning: "text-yellow-500",
    info: "text-blue-500"
  };

  const Icon = icons[type];

  return (
    <div className={`fixed top-6 right-6 z-[100] max-w-md animate-slide-in-right`}>
      <div className={`glass-card border ${styles[type]} p-4 pr-12 shadow-2xl backdrop-blur-xl`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[type]}`} />
          <p className="text-white text-sm font-medium leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}