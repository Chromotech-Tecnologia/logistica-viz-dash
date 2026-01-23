import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useFilters } from '@/contexts/FilterContext';
import { meses, regioes } from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const FilterBar: React.FC = () => {
  const { filters, updateFilter, toggleArrayFilter, clearFilters } = useFilters();

  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  const hasActiveFilters = 
    filters.months.length > 0 || 
    filters.regions.length > 0 || 
    filters.states.length > 0 ||
    filters.modalities.length > 0 ||
    filters.serviceTypes.length > 0;

  return (
    <div className="bg-primary px-6 py-3 border-t border-primary-foreground/20">
      <div className="max-w-[1800px] mx-auto flex flex-wrap items-center gap-3">
        {/* Year Selector */}
        <Select
          value={String(filters.year)}
          onValueChange={(value) => updateFilter('year', Number(value))}
        >
          <SelectTrigger className="w-28 bg-primary-foreground text-primary border-none font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-primary">
            {years.map(year => (
              <SelectItem key={year} value={String(year)}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Month Buttons */}
        <div className="flex flex-wrap gap-1">
          {meses.map(mes => (
            <button
              key={mes}
              onClick={() => toggleArrayFilter('months', mes)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all duration-200 ${
                filters.months.includes(mes)
                  ? 'bg-primary-foreground text-primary'
                  : 'bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/30'
              }`}
            >
              {mes.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Region Multi-Select */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
            Região {filters.regions.length > 0 && `(${filters.regions.length})`}
            <ChevronDown className="w-3 h-3" />
          </button>
          <div className="absolute top-full left-0 mt-1 bg-card border border-primary rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-32">
            {regioes.map(regiao => (
              <button
                key={regiao}
                onClick={() => toggleArrayFilter('regions', regiao)}
                className={`w-full text-left px-3 py-1.5 text-xs rounded transition-colors ${
                  filters.regions.includes(regiao)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-card-foreground'
                }`}
              >
                {regiao}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-primary-foreground hover:bg-primary-foreground/20 gap-1"
          >
            <X className="w-4 h-4" />
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
