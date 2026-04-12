'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'elevated';
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', variant = 'default', hover = true, onClick }: CardProps) {
  const baseClasses = 'rounded-2xl transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-[#0A0A0A] border border-[#1A1A1A]',
    gradient: 'bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A] border border-[#1A1A1A]/50',
    glass: 'backdrop-blur-lg bg-white/5 border border-white/10',
    elevated: 'bg-[#0A0A0A] border border-[#1A1A1A] shadow-2xl shadow-black/50'
  };
  
  const hoverClasses = hover 
    ? 'hover:border-[#00D4FF]/30 hover:shadow-lg hover:shadow-[#00D4FF]/10' 
    : '';
  
  const clickClasses = onClick ? 'cursor-pointer active:scale-[0.99]' : '';
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  icon,
  type = 'button'
}: ButtonProps) {
  const baseClasses = 'rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] text-white hover:shadow-lg hover:shadow-[#00D4FF]/30 active:scale-[0.98]',
    secondary: 'bg-[#1A1A1A] text-white border border-[#242424] hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/5',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    danger: 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:shadow-lg hover:shadow-red-500/30',
    success: 'bg-gradient-to-r from-green-500 to-green-700 text-white hover:shadow-lg hover:shadow-green-500/30'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1';
  
  const variantClasses = {
    default: 'bg-[#1A1A1A] text-gray-400',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
    premium: 'bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] text-white'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {variant === 'premium' && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.2 6.5 10.134a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
        </svg>
      )}
      {children}
    </span>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'number' | 'currency' | 'percentage';
  description?: string;
  className?: string;
}

export function StatCard({ title, value, change, icon, trend, format = 'number', description, className = '' }: StatCardProps) {
  const formatValue = (val: string | number) => {
    if (format === 'currency') {
      return `R$ ${Number(val).toLocaleString('pt-BR')}`;
    }
    if (format === 'percentage') {
      return `${val}%`;
    }
    return val;
  };
  
  const changeColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';
  const changeIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  
  return (
    <Card variant="gradient" className={`p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-gray-400 text-sm">{title}</div>
        {icon && <div className="text-[#00D4FF]">{icon}</div>}
      </div>
      
      <div className="text-3xl font-bold mb-2">{formatValue(value)}</div>
      
      {change !== undefined && (
        <div className={`text-sm ${changeColor}`}>
          {changeIcon} {Math.abs(change)}% {trend === 'up' ? 'alta' : trend === 'down' ? 'queda' : ''}
        </div>
      )}

      {description && (
        <div className="text-sm text-gray-500 mt-2">{description}</div>
      )}
    </Card>
  );
}

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'error' | 'premium' | 'blue' | 'purple';
}

export function ProgressBar({ value, max, label, showPercentage = true, variant = 'default' }: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  
  const variantClasses = {
    default: 'bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF]',
    gradient: 'bg-gradient-to-r from-[#00D4FF] via-[#7B2CBF] to-[#FF006E]',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    premium: 'bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF]',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{label}</span>
          {showPercentage && <span className="font-semibold">{percentage}%</span>}
        </div>
      )}
      
      <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${variantClasses[variant]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{value} / {max}</span>
        <span>{percentage}%</span>
      </div>
    </div>
  );
}

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

export function Avatar({ src, name, size = 'md', status, className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg'
  };
  
  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  };
  
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  
  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-[#00D4FF] to-[#7B2CBF] ${className}`}>
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold">
            {initials}
          </div>
        )}
      </div>
      
      {status && (
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0A0A0A] ${statusClasses[status]}`}></div>
      )}
    </div>
  );
}

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };
  
  return (
    <div className="relative group">
      {children}
      <div className={`absolute ${positionClasses[position]} z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}>
        <div className="bg-[#1A1A1A] text-white text-sm py-2 px-3 rounded-lg whitespace-nowrap shadow-xl border border-[#242424]">
          {content}
          <div className={`absolute w-2 h-2 bg-[#1A1A1A] transform rotate-45 ${
            position === 'top' ? 'top-full -translate-x-1/2' :
            position === 'bottom' ? 'top-0 -translate-x-1/2 -translate-y-1/2' :
            position === 'left' ? 'right-0 -translate-y-1/2' :
            'left-0 -translate-y-1/2'
          }`}></div>
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
        {icon || (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };
  
  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className={`${sizeClasses[size]} border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin`}></div>
    </div>
  );
}