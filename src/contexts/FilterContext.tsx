import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Filters {
  year: number;
  months: string[];
  regions: string[];
  states: string[];
  modalities: string[];
  serviceTypes: string[];
  selectedPedido: string | null;
  prazoStatus: 'all' | 'noPrazo' | 'foraPrazo';
}

interface FilterContextType {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  clearFilters: () => void;
  toggleArrayFilter: (key: 'months' | 'regions' | 'states' | 'modalities' | 'serviceTypes', value: string) => void;
}

const defaultFilters: Filters = {
  year: 2024,
  months: [],
  regions: [],
  states: [],
  modalities: [],
  serviceTypes: [],
  selectedPedido: null,
  prazoStatus: 'all',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const toggleArrayFilter = (key: 'months' | 'regions' | 'states' | 'modalities' | 'serviceTypes', value: string) => {
    setFilters(prev => {
      const currentValues = prev[key] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues };
    });
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, updateFilter, clearFilters, toggleArrayFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
