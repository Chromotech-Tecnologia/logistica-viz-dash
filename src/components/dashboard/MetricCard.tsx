import React from 'react';
import { cn } from '@/lib/utils';
interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  percentage?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'lg';
  className?: string;
}
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  percentage,
  variant = 'default',
  size = 'lg',
  className
}) => {
  const variantStyles = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive'
  };
  return <div className={cn('dashboard-card animate-fade-in h-full', className)}>
      <h3 className="dashboard-card-title">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className={cn("font-black tracking-tight text-2xl", size === 'lg' ? 'text-5xl' : 'text-3xl', variantStyles[variant])}>
          {value}
        </span>
        {percentage && <span className={cn('text-lg font-bold', variantStyles[variant])}>
            {percentage}
          </span>}
      </div>
      {subtitle && <p className="metric-label mt-2">{subtitle}</p>}
    </div>;
};
export default MetricCard;