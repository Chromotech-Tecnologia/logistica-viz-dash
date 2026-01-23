import React from 'react';
import { useFilters } from '@/contexts/FilterContext';

interface PerformanceGaugeProps {
  percentage: number;
  label?: string;
}

const PerformanceGauge: React.FC<PerformanceGaugeProps> = ({ percentage, label = 'Finalizado' }) => {
  const { filters, updateFilter } = useFilters();
  const isWarning = percentage < 95;
  const strokeColor = isWarning ? 'hsl(0, 84%, 60%)' : 'hsl(142, 76%, 36%)';
  
  // Calculate the arc
  const radius = 80;
  const strokeWidth = 12;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handlePrazoClick = (status: 'noPrazo' | 'foraPrazo') => {
    if (filters.prazoStatus === status) {
      updateFilter('prazoStatus', 'all');
    } else {
      updateFilter('prazoStatus', status);
    }
  };

  return (
    <div className="dashboard-card flex flex-col items-center justify-center py-4 animate-scale-in">
      <h3 className="dashboard-card-title mb-2">Performance</h3>
      
      <div className="gauge-container">
        <svg width="180" height="110" viewBox="0 0 200 120">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(0, 0%, 20%)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 10px ${strokeColor})`,
            }}
          />
          
          {/* Percentage text */}
          <text
            x="100"
            y="85"
            textAnchor="middle"
            className="text-2xl font-black"
            style={{ fill: strokeColor }}
          >
            {percentage.toFixed(2)}%
          </text>
        </svg>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={() => handlePrazoClick('noPrazo')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
            filters.prazoStatus === 'noPrazo' 
              ? 'bg-success/20 border-success' 
              : 'border-muted hover:border-success/50'
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">No Prazo</span>
        </button>
        <button
          onClick={() => handlePrazoClick('foraPrazo')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
            filters.prazoStatus === 'foraPrazo' 
              ? 'bg-destructive/20 border-destructive' 
              : 'border-muted hover:border-destructive/50'
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">Fora do Prazo</span>
        </button>
      </div>

      {isWarning && (
        <div className="mt-2 px-3 py-1 bg-destructive/20 border border-destructive rounded-full">
          <span className="text-xs text-destructive font-medium">⚠️ Alerta: Abaixo de 95%</span>
        </div>
      )}
    </div>
  );
};

export default PerformanceGauge;
