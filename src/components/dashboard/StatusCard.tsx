import React from 'react';

interface StatusData {
  label: string;
  value: number;
}

interface StatusCardProps {
  data: StatusData[];
}

const StatusCard: React.FC<StatusCardProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="dashboard-card animate-slide-up h-full flex flex-col">
      <h3 className="dashboard-card-title">Status Pedidos</h3>
      
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground uppercase">{item.label}</span>
                <span className="text-sm text-card-foreground font-semibold">{item.value}</span>
              </div>
              <div className="h-4 bg-muted rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary/80 to-primary rounded transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                    animationDelay: `${index * 150}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusCard;
