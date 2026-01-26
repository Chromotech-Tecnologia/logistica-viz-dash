import React from 'react';
import { useFilters } from '@/contexts/FilterContext';

interface BarData {
  name: string;
  value: number;
}

interface HorizontalBarChartProps {
  data: BarData[];
  title: string;
  filterKey: 'modalities' | 'serviceTypes';
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data, title, filterKey }) => {
  const { toggleArrayFilter, filters } = useFilters();
  
  const maxValue = Math.max(...data.map(d => d.value));
  const activeFilters = filters[filterKey];

  const handleClick = (name: string) => {
    toggleArrayFilter(filterKey, name);
  };

  return (
    <div className="dashboard-card animate-slide-up h-full flex flex-col overflow-hidden">
      <h3 className="dashboard-card-title">{title}</h3>
      
      <div className="flex-1 overflow-hidden flex flex-col justify-center gap-2">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const isActive = activeFilters.length === 0 || activeFilters.includes(item.name);

          return (
            <button
              key={item.name}
              onClick={() => handleClick(item.name)}
              className={`w-full text-left transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-card-foreground font-medium">{item.name}</span>
                <span className="text-xs text-primary font-bold">{item.value}</span>
              </div>
              <div className="h-4 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                <div
                  className="h-full bg-primary rounded-sm transition-all duration-500 ease-out hover:brightness-110"
                  style={{
                    width: `${percentage}%`,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalBarChart;
