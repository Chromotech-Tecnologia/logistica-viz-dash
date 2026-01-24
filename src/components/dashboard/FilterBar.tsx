import React, { useState } from 'react';
import { X, ChevronDown, Filter, Check } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const FilterBar: React.FC = () => {
  const { filters, updateFilter, toggleArrayFilter, clearFilters } = useFilters();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  const hasActiveFilters = 
    filters.months.length > 0 || 
    filters.regions.length > 0 || 
    filters.states.length > 0 ||
    filters.modalities.length > 0 ||
    filters.serviceTypes.length > 0;

  const allMonthsSelected = filters.months.length === meses.length;

  const handleSelectAllMonths = () => {
    if (allMonthsSelected) {
      // Clear all months
      meses.forEach(mes => {
        if (filters.months.includes(mes)) {
          toggleArrayFilter('months', mes);
        }
      });
    } else {
      // Select all months
      meses.forEach(mes => {
        if (!filters.months.includes(mes)) {
          toggleArrayFilter('months', mes);
        }
      });
    }
  };

  // Desktop Filter Bar
  const DesktopFilters = () => (
    <div className="hidden lg:flex flex-wrap items-center gap-2">
      {/* Year Selector */}
      <Select
        value={String(filters.year)}
        onValueChange={(value) => updateFilter('year', Number(value))}
      >
        <SelectTrigger className="w-24 h-8 bg-primary-foreground text-primary border-none font-semibold text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-primary z-[100]">
          {years.map(year => (
            <SelectItem key={year} value={String(year)}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Select All Button */}
      <button
        onClick={handleSelectAllMonths}
        className={`px-3 py-1.5 text-xs font-semibold rounded transition-all duration-200 ${
          allMonthsSelected
            ? 'bg-primary-foreground text-primary'
            : 'bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/30'
        }`}
      >
        {allMonthsSelected ? 'Limpar' : 'Todos'}
      </button>

      {/* Month Buttons */}
      <div className="flex flex-wrap gap-1">
        {meses.map(mes => (
          <button
            key={mes}
            onClick={() => toggleArrayFilter('months', mes)}
            className={`px-2 py-1.5 text-xs font-semibold rounded transition-all duration-200 ${
              filters.months.includes(mes)
                ? 'bg-primary-foreground text-primary'
                : 'bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/30'
            }`}
          >
            {mes.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Region Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
            Região {filters.regions.length > 0 && `(${filters.regions.length})`}
            <ChevronDown className="w-3 h-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card border-primary z-[100]">
          {regioes.map(regiao => (
            <DropdownMenuCheckboxItem
              key={regiao}
              checked={filters.regions.includes(regiao)}
              onCheckedChange={() => toggleArrayFilter('regions', regiao)}
              className="text-card-foreground"
            >
              {regiao}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-primary-foreground hover:bg-primary-foreground/20 gap-1 h-8"
        >
          <X className="w-4 h-4" />
          Limpar
        </Button>
      )}
    </div>
  );

  // Mobile Filter Sheet
  const MobileFilters = () => (
    <div className="lg:hidden flex items-center gap-2">
      {/* Year Selector - Always visible on mobile */}
      <Select
        value={String(filters.year)}
        onValueChange={(value) => updateFilter('year', Number(value))}
      >
        <SelectTrigger className="w-20 h-8 bg-primary-foreground text-primary border-none font-semibold text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-primary z-[100]">
          {years.map(year => (
            <SelectItem key={year} value={String(year)}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Months Dropdown for Mobile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
            Meses {filters.months.length > 0 && `(${filters.months.length})`}
            <ChevronDown className="w-3 h-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card border-primary z-[100] max-h-64 overflow-y-auto">
          <DropdownMenuCheckboxItem
            checked={allMonthsSelected}
            onCheckedChange={handleSelectAllMonths}
            className="text-primary font-semibold"
          >
            {allMonthsSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </DropdownMenuCheckboxItem>
          {meses.map(mes => (
            <DropdownMenuCheckboxItem
              key={mes}
              checked={filters.months.includes(mes)}
              onCheckedChange={() => toggleArrayFilter('months', mes)}
              className="text-card-foreground"
            >
              {mes}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Region Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
            Região {filters.regions.length > 0 && `(${filters.regions.length})`}
            <ChevronDown className="w-3 h-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card border-primary z-[100]">
          {regioes.map(regiao => (
            <DropdownMenuCheckboxItem
              key={regiao}
              checked={filters.regions.includes(regiao)}
              onCheckedChange={() => toggleArrayFilter('regions', regiao)}
              className="text-card-foreground"
            >
              {regiao}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-primary-foreground hover:bg-primary-foreground/20 gap-1 h-8 px-2"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="fixed top-[68px] left-0 right-0 z-40 bg-primary px-4 py-2 border-t border-primary-foreground/20">
      <div className="max-w-[1800px] mx-auto">
        <DesktopFilters />
        <MobileFilters />
      </div>
    </div>
  );
};

export default FilterBar;
