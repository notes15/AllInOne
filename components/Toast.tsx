"use client";

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: 'CheckCircleIcon',
    error: 'XCircleIcon',
    warning: 'ExclamationTriangleIcon',
    info: 'InformationCircleIcon',
  };

  const colors = {
    success: 'bg-success text-success-foreground',
    error: 'bg-error text-error-foreground',
    warning: 'bg-accent text-accent-foreground',
    info: 'bg-primary text-primary-foreground',
  };

  return (
    <div
      className={`fixed top-24 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${colors[type]} ${
        isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'
      }`}
    >
      <Icon name={icons[type]} size={24} />
      <span className="font-medium">{message}</span>
      <button onClick={() => {
        setIsExiting(true);
        setTimeout(onClose, 300);
      }} className="ml-2">
        <Icon name="XMarkIcon" size={20} />
      </button>
    </div>
  );
}
