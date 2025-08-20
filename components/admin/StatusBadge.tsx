'use client';

import { ReactNode } from 'react';

interface StatusBadgeProps {
  status: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export default function StatusBadge({ 
  status, 
  icon, 
  variant = 'default', 
  size = 'md',
  children 
}: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
}

// Helper function to get status variant based on status value
export function getStatusVariant(status: string): 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' {
  switch (status.toLowerCase()) {
    case 'pending':
    case 'en_attente':
      return 'warning';
    case 'in_review':
    case 'en_revision':
      return 'info';
    case 'approved':
    case 'approuve':
    case 'delivered':
    case 'livre':
    case 'completed':
    case 'termine':
      return 'success';
    case 'in_production':
    case 'en_production':
      return 'purple';
    case 'cancelled':
    case 'annule':
    case 'rejected':
    case 'rejete':
      return 'error';
    case 'ready':
    case 'pret':
      return 'success';
    default:
      return 'default';
  }
}
