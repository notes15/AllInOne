"use client";
import { useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const typeColors = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    info: 'bg-blue-500 hover:bg-blue-600'
  };

  const typeIcons: { [key: string]: string } = {
    danger: 'ExclamationTriangleIcon',
    warning: 'ExclamationCircleIcon',
    info: 'InformationCircleIcon'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in border border-border">
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-full ${typeColors[type]} bg-opacity-10`}>
            <Icon name={typeIcons[type] as any} size={24} className={typeColors[type].split(' ')[0].replace('bg-', 'text-')} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-6 py-2.5 rounded-lg text-white transition-colors font-medium ${typeColors[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}