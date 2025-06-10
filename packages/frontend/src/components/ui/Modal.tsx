import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, className, children }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={cn('relative bg-white rounded-lg shadow-lg w-full max-w-md p-6', className)}>
        <button
          className="absolute right-3 top-3 rounded-md p-1 text-gray-500 hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
        {title && <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body
  );
};
