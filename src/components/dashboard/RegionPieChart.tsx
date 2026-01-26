import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFilters } from '@/contexts/FilterContext';

interface RegionData {
  name: string;
  value: number;
  percentage: string;
}

interface RegionPieChartProps {
  data: RegionData[];
}

const COLORS = [
  'hsl(199, 89%, 48%)', // Blue - Sudeste
  'hsl(45, 100%, 50%)', // Yellow - Nordeste
  'hsl(142, 76%, 36%)', // Green - Sul
  'hsl(280, 65%, 60%)', // Purple - Centro-Oeste
  'hsl(0, 84%, 60%)',   // Red - Norte
];

const RegionPieChart: React.FC<RegionPieChartProps> = ({ data }) => {
  const { toggleArrayFilter, filters } = useFilters();

  const handleClick = (entry: RegionData) => {
    toggleArrayFilter('regions', entry.name);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-primary rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-semibold text-card-foreground">{payload[0].name}</p>
          <p className="text-sm text-primary">{payload[0].value} pedidos ({payload[0].payload.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-card h-full animate-slide-up flex flex-col">
      <h3 className="dashboard-card-title">Pedido | Região</h3>
      
      {/* Gráfico centralizado com altura adequada */}
      <div className="flex-1 flex items-center justify-center min-h-[160px]" style={{ overflow: 'visible' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="60%"
              paddingAngle={1}
              dataKey="value"
              onClick={(_, index) => handleClick(data[index])}
              className="cursor-pointer"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                  opacity={filters.regions.length === 0 || filters.regions.includes(entry.name) ? 1 : 0.3}
                  className="transition-opacity duration-300"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda abaixo do gráfico */}
      <div className="flex flex-col gap-1 pt-2 border-t border-muted mt-auto">
        {data.map((entry, index) => (
          <button
            key={entry.name}
            onClick={() => handleClick(entry)}
            className={`flex items-center gap-2 text-left transition-opacity duration-200 ${
              filters.regions.length > 0 && !filters.regions.includes(entry.name) ? 'opacity-40' : ''
            }`}
          >
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-[10px] text-muted-foreground">{entry.name}</span>
            <span className="text-[10px] text-card-foreground font-medium ml-auto">{entry.percentage}%</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegionPieChart;
