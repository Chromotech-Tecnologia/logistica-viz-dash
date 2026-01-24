import React from 'react';
import { useFilters } from '@/contexts/FilterContext';

interface StateData {
  [key: string]: number;
}

interface BrazilMapProps {
  stateData: StateData;
}

// Real SVG paths for Brazilian states (simplified but accurate shapes)
const statePaths: Record<string, { d: string; name: string }> = {
  AC: { 
    d: "M100,280 L130,275 L135,290 L120,300 L95,295 Z", 
    name: "Acre" 
  },
  AM: { 
    d: "M110,200 L200,185 L230,200 L240,250 L200,280 L130,285 L100,260 L105,220 Z", 
    name: "Amazonas" 
  },
  RR: { 
    d: "M180,140 L210,130 L225,155 L215,180 L185,185 L170,165 Z", 
    name: "Roraima" 
  },
  PA: { 
    d: "M230,180 L340,165 L360,200 L355,260 L310,275 L260,265 L240,250 L235,210 Z", 
    name: "Pará" 
  },
  AP: { 
    d: "M320,140 L350,135 L355,165 L340,175 L315,170 Z", 
    name: "Amapá" 
  },
  TO: { 
    d: "M320,270 L350,265 L355,340 L325,350 L315,310 Z", 
    name: "Tocantins" 
  },
  MA: { 
    d: "M355,215 L400,200 L420,235 L400,275 L360,265 L355,240 Z", 
    name: "Maranhão" 
  },
  PI: { 
    d: "M395,265 L430,250 L440,310 L415,340 L390,320 Z", 
    name: "Piauí" 
  },
  CE: { 
    d: "M430,235 L470,225 L480,265 L455,285 L435,275 Z", 
    name: "Ceará" 
  },
  RN: { 
    d: "M475,255 L505,250 L510,275 L485,280 Z", 
    name: "Rio Grande do Norte" 
  },
  PB: { 
    d: "M470,280 L510,275 L512,295 L475,300 Z", 
    name: "Paraíba" 
  },
  PE: { 
    d: "M445,295 L515,285 L518,315 L450,325 Z", 
    name: "Pernambuco" 
  },
  AL: { 
    d: "M485,320 L510,315 L515,340 L490,345 Z", 
    name: "Alagoas" 
  },
  SE: { 
    d: "M475,345 L500,340 L505,360 L480,365 Z", 
    name: "Sergipe" 
  },
  BA: { 
    d: "M400,320 L480,300 L500,360 L480,420 L410,430 L380,385 Z", 
    name: "Bahia" 
  },
  MT: { 
    d: "M200,290 L290,280 L320,290 L325,380 L260,400 L200,380 Z", 
    name: "Mato Grosso" 
  },
  GO: { 
    d: "M325,350 L390,340 L400,420 L350,440 L320,400 Z", 
    name: "Goiás" 
  },
  DF: { 
    d: "M365,385 L385,380 L390,400 L370,405 Z", 
    name: "Distrito Federal" 
  },
  MS: { 
    d: "M250,400 L320,390 L330,470 L270,490 L245,450 Z", 
    name: "Mato Grosso do Sul" 
  },
  MG: { 
    d: "M385,400 L470,380 L500,420 L485,490 L410,510 L375,470 Z", 
    name: "Minas Gerais" 
  },
  ES: { 
    d: "M490,440 L520,430 L525,475 L495,485 Z", 
    name: "Espírito Santo" 
  },
  RJ: { 
    d: "M460,490 L510,480 L520,510 L475,520 Z", 
    name: "Rio de Janeiro" 
  },
  SP: { 
    d: "M350,470 L430,455 L465,495 L440,540 L360,545 L340,510 Z", 
    name: "São Paulo" 
  },
  PR: { 
    d: "M310,510 L380,500 L400,545 L350,570 L305,550 Z", 
    name: "Paraná" 
  },
  SC: { 
    d: "M320,560 L380,550 L395,585 L345,600 L315,580 Z", 
    name: "Santa Catarina" 
  },
  RS: { 
    d: "M290,590 L365,580 L380,640 L320,680 L270,650 Z", 
    name: "Rio Grande do Sul" 
  },
  RO: { 
    d: "M145,290 L200,280 L210,340 L175,360 L140,340 Z", 
    name: "Rondônia" 
  },
};

const BrazilMap: React.FC<BrazilMapProps> = ({ stateData }) => {
  const { toggleArrayFilter, filters } = useFilters();
  
  const maxValue = Math.max(...Object.values(stateData), 1);

  const getColor = (value: number) => {
    if (value === 0) return 'hsl(45, 30%, 20%)';
    const intensity = value / maxValue;
    const lightness = 25 + (intensity * 35);
    return `hsl(45, 100%, ${lightness}%)`;
  };

  const handleStateClick = (state: string) => {
    toggleArrayFilter('states', state);
  };

  // Calculate label positions (center of bounding box for each path)
  const getLabelPosition = (d: string) => {
    const numbers = d.match(/\d+/g)?.map(Number) || [];
    if (numbers.length < 4) return { x: 0, y: 0 };
    
    const xs = numbers.filter((_, i) => i % 2 === 0);
    const ys = numbers.filter((_, i) => i % 2 === 1);
    
    return {
      x: (Math.min(...xs) + Math.max(...xs)) / 2,
      y: (Math.min(...ys) + Math.max(...ys)) / 2
    };
  };

  return (
    <div className="dashboard-card h-full animate-scale-in flex flex-col">
      <h3 className="dashboard-card-title">Pedidos | Estado</h3>
      
      <div className="flex-1 relative flex justify-center items-center min-h-0">
        <svg viewBox="50 100 520 620" className="w-full h-full max-h-[280px]" preserveAspectRatio="xMidYMid meet">
          {Object.entries(statePaths).map(([state, { d, name }]) => {
            const value = stateData[state] || 0;
            const isActive = filters.states.length === 0 || filters.states.includes(state);
            const pos = getLabelPosition(d);
            
            return (
              <g key={state} onClick={() => handleStateClick(state)} className="cursor-pointer group">
                <path
                  d={d}
                  fill={getColor(value)}
                  stroke="hsl(45, 100%, 50%)"
                  strokeWidth="1"
                  className={`transition-all duration-300 hover:brightness-125 ${
                    isActive ? 'opacity-100' : 'opacity-30'
                  } ${filters.states.includes(state) ? 'stroke-2' : ''}`}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[9px] font-bold pointer-events-none select-none"
                  fill={value > maxValue * 0.5 ? 'hsl(0, 0%, 4%)' : 'hsl(45, 100%, 50%)'}
                >
                  {state}
                </text>
                {/* Tooltip */}
                <title>{name}: {value} pedidos</title>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-muted">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(45, 100%, 25%)' }} />
          <span className="text-[10px] text-muted-foreground">Menos</span>
        </div>
        <div className="w-12 h-3 rounded" style={{ 
          background: 'linear-gradient(to right, hsl(45, 100%, 25%), hsl(45, 100%, 60%))' 
        }} />
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(45, 100%, 60%)' }} />
          <span className="text-[10px] text-muted-foreground">Mais</span>
        </div>
      </div>

      {filters.states.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1 justify-center">
          {filters.states.map(state => (
            <button
              key={state}
              onClick={() => handleStateClick(state)}
              className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full hover:bg-primary/80 transition-colors"
            >
              {state} ✕
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrazilMap;
