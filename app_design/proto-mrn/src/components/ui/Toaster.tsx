import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-success text-success-foreground';
      case 'error':
        return 'bg-error text-error-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      case 'info':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div 
      className={cn(
        'flex w-full max-w-sm items-center rounded-lg p-4 shadow-lg',
        'animate-slide-up',
        getTypeStyles()
      )}
    >
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        {message && <p className="text-sm opacity-90">{message}</p>}
      </div>
      <button 
        onClick={() => onClose(id)} 
        className="ml-4 rounded-full p-1 hover:bg-white/20"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Toast container
interface ToastContainerProps {
  toasts: ToastProps[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
};

// Toast context
type ToastContextType = {
  toast: (props: Omit<ToastProps, 'id' | 'onClose'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

// Toast provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addToast = (props: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...props, id, onClose: removeToast }]);
  };

  const contextValue: ToastContextType = {
    toast: addToast,
    success: (title, message) => addToast({ type: 'success', title, message }),
    error: (title, message) => addToast({ type: 'error', title, message }),
    warning: (title, message) => addToast({ type: 'warning', title, message }),
    info: (title, message) => addToast({ type: 'info', title, message }),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Singleton toast instance
let toastContainer: HTMLDivElement | null = null;
let toastRoot: any = null;

export const Toaster = () => {
  useEffect(() => {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      document.body.appendChild(toastContainer);
      toastRoot = createRoot(toastContainer);
      toastRoot.render(<ToastProvider>{null}</ToastProvider>);
    }
    
    return () => {
      if (toastContainer && document.body.contains(toastContainer)) {
        document.body.removeChild(toastContainer);
        toastContainer = null;
      }
    };
  }, []);

  return null;
};

// Export toast function
export const toast = {
  show: (props: Omit<ToastProps, 'id' | 'onClose'>) => {
    const toastEvent = new CustomEvent('toast', { detail: props });
    document.dispatchEvent(toastEvent);
  },
  success: (title: string, message?: string) => {
    toast.show({ type: 'success', title, message });
  },
  error: (title: string, message?: string) => {
    toast.show({ type: 'error', title, message });
  },
  warning: (title: string, message?: string) => {
    toast.show({ type: 'warning', title, message });
  },
  info: (title: string, message?: string) => {
    toast.show({ type: 'info', title, message });
  },
};