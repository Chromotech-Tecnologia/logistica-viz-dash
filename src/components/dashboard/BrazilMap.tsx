import React from 'react';
import { useFilters } from '@/contexts/FilterContext';

interface StateData {
  [key: string]: number;
}

interface BrazilMapProps {
  stateData: StateData;
}

// Simplified SVG paths for Brazilian states
const statePaths: Record<string, { d: string; cx: number; cy: number }> = {
  AC: { d: "M45,180 L60,175 L65,185 L55,195 Z", cx: 55, cy: 185 },
  AM: { d: "M55,140 L120,130 L130,165 L100,185 L60,180 Z", cx: 90, cy: 158 },
  RR: { d: "M85,95 L110,90 L115,115 L90,120 Z", cx: 100, cy: 105 },
  PA: { d: "M130,130 L200,120 L210,170 L150,185 L125,165 Z", cx: 165, cy: 150 },
  AP: { d: "M185,100 L210,95 L215,125 L190,130 Z", cx: 200, cy: 112 },
  TO: { d: "M190,175 L215,170 L220,220 L195,225 Z", cx: 205, cy: 198 },
  MA: { d: "M210,145 L255,135 L260,175 L220,180 Z", cx: 235, cy: 158 },
  PI: { d: "M255,155 L285,150 L290,200 L260,205 Z", cx: 272, cy: 178 },
  CE: { d: "M290,145 L320,140 L325,170 L295,175 Z", cx: 307, cy: 158 },
  RN: { d: "M325,145 L345,142 L347,165 L327,168 Z", cx: 336, cy: 155 },
  PB: { d: "M320,170 L350,168 L352,185 L322,187 Z", cx: 336, cy: 177 },
  PE: { d: "M295,185 L355,180 L358,200 L298,205 Z", cx: 326, cy: 192 },
  AL: { d: "M330,205 L350,203 L352,222 L332,224 Z", cx: 341, cy: 213 },
  SE: { d: "M325,225 L345,223 L347,240 L327,242 Z", cx: 336, cy: 232 },
  BA: { d: "M260,205 L330,195 L340,270 L280,280 L255,250 Z", cx: 295, cy: 238 },
  MT: { d: "M130,190 L195,180 L200,260 L140,270 Z", cx: 165, cy: 225 },
  GO: { d: "M200,230 L260,220 L265,285 L210,290 Z", cx: 232, cy: 255 },
  DF: { d: "M245,265 L260,263 L262,278 L247,280 Z", cx: 253, cy: 271 },
  MS: { d: "M165,275 L210,270 L215,330 L175,335 Z", cx: 190, cy: 302 },
  MG: { d: "M265,270 L335,260 L340,330 L275,340 Z", cx: 302, cy: 300 },
  ES: { d: "M340,295 L365,290 L368,325 L343,330 Z", cx: 354, cy: 310 },
  RJ: { d: "M325,335 L365,330 L368,355 L330,358 Z", cx: 347, cy: 345 },
  SP: { d: "M250,325 L325,315 L330,365 L260,370 Z", cx: 290, cy: 345 },
  PR: { d: "M225,350 L280,345 L285,385 L235,390 Z", cx: 255, cy: 368 },
  SC: { d: "M240,390 L285,387 L288,415 L245,418 Z", cx: 265, cy: 402 },
  RS: { d: "M220,410 L280,405 L285,460 L230,465 Z", cx: 252, cy: 435 },
  RO: { d: "M85,195 L130,188 L135,235 L95,242 Z", cx: 110, cy: 215 },
};

const BrazilMap: React.FC<BrazilMapProps> = ({ stateData }) => {
  const { toggleArrayFilter, filters } = useFilters();
  
  const maxValue = Math.max(...Object.values(stateData), 1);

  const getColor = (value: number) => {
    const intensity = value / maxValue;
    const lightness = 85 - (intensity * 50);
    return `hsl(199, 89%, ${lightness}%)`;
  };

  const handleStateClick = (state: string) => {
    toggleArrayFilter('states', state);
  };

  return (
    <div className="dashboard-card animate-scale-in">
      <h3 className="dashboard-card-title">Pedidos | Estado</h3>
      
      <div className="relative">
        <svg viewBox="0 0 400 500" className="w-full h-64">
          {Object.entries(statePaths).map(([state, path]) => {
            const value = stateData[state] || 0;
            const isActive = filters.states.length === 0 || filters.states.includes(state);
            
            return (
              <g key={state} onClick={() => handleStateClick(state)} className="cursor-pointer">
                <path
                  d={path.d}
                  fill={getColor(value)}
                  stroke="hsl(0, 0%, 20%)"
                  strokeWidth="1"
                  className={`transition-all duration-300 hover:brightness-125 ${
                    isActive ? 'opacity-100' : 'opacity-30'
                  }`}
                />
                {value > 0 && (
                  <text
                    x={path.cx}
                    y={path.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[8px] font-bold fill-primary-foreground pointer-events-none"
                  >
                    {state}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded" style={{ backgroundColor: 'hsl(199, 89%, 75%)' }} />
            <span className="text-[10px] text-muted-foreground">Menos</span>
          </div>
          <div className="w-16 h-3 rounded" style={{ 
            background: 'linear-gradient(to right, hsl(199, 89%, 75%), hsl(199, 89%, 35%))' 
          }} />
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded" style={{ backgroundColor: 'hsl(199, 89%, 35%)' }} />
            <span className="text-[10px] text-muted-foreground">Mais</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrazilMap;
