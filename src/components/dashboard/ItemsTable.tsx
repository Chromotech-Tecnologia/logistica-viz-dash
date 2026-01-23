import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ItemPedido, pedidos } from '@/data/mockData';
import { useFilters } from '@/contexts/FilterContext';

interface ItemsTableProps {
  items: ItemPedido[];
}

type SortField = 'pedido' | 'codItem' | 'descricao' | 'subgrupo' | 'qtde' | 'volumeTotal';
type SortDirection = 'asc' | 'desc';

const ItemsTable: React.FC<ItemsTableProps> = ({ items }) => {
  const { toggleArrayFilter, filters } = useFilters();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('pedido');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const itemsPerPage = 8;

  const filteredAndSorted = useMemo(() => {
    let result = [...items];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(item =>
        item.pedido.toLowerCase().includes(searchLower) ||
        item.codItem.toLowerCase().includes(searchLower) ||
        item.descricao.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [items, search, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-3 h-3 inline ml-1" /> : 
      <ChevronDown className="w-3 h-3 inline ml-1" />;
  };

  const handleRowClick = (item: ItemPedido) => {
    // Find the pedido that this item belongs to
    const pedido = pedidos.find(p => p.pedido === item.pedido);
    if (!pedido) return;

    // Toggle selection and apply filters
    const rowKey = `${item.pedido}-${item.codItem}`;
    if (selectedRow === rowKey) {
      setSelectedRow(null);
      // Clear the filters
      if (filters.states.includes(pedido.estado)) {
        toggleArrayFilter('states', pedido.estado);
      }
      if (filters.modalities.includes(pedido.modalidade)) {
        toggleArrayFilter('modalities', pedido.modalidade);
      }
      if (filters.serviceTypes.includes(pedido.tipoServico)) {
        toggleArrayFilter('serviceTypes', pedido.tipoServico);
      }
      if (filters.regions.includes(pedido.regiao)) {
        toggleArrayFilter('regions', pedido.regiao);
      }
    } else {
      setSelectedRow(rowKey);
      // Apply filters based on the related pedido
      if (!filters.states.includes(pedido.estado)) {
        toggleArrayFilter('states', pedido.estado);
      }
      if (!filters.modalities.includes(pedido.modalidade)) {
        toggleArrayFilter('modalities', pedido.modalidade);
      }
      if (!filters.serviceTypes.includes(pedido.tipoServico)) {
        toggleArrayFilter('serviceTypes', pedido.tipoServico);
      }
      if (!filters.regions.includes(pedido.regiao)) {
        toggleArrayFilter('regions', pedido.regiao);
      }
    }
  };

  return (
    <div className="dashboard-card animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="dashboard-card-title mb-0">Itens dos Pedidos</h3>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar..."
            className="pl-7 pr-3 py-1.5 text-xs bg-muted border border-muted rounded text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-muted">
              {[
                { key: 'pedido', label: 'Pedido' },
                { key: 'codItem', label: 'Cód. Item' },
                { key: 'descricao', label: 'Descrição' },
                { key: 'subgrupo', label: 'SubGrupo' },
                { key: 'qtde', label: 'Qtde' },
                { key: 'volumeTotal', label: 'M³ Total' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as SortField)}
                  className="text-left py-2 px-2 text-muted-foreground font-medium cursor-pointer hover:text-primary transition-colors"
                >
                  {label}
                  <SortIcon field={key as SortField} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => {
              const rowKey = `${item.pedido}-${item.codItem}`;
              return (
                <tr
                  key={`${item.pedido}-${item.codItem}-${index}`}
                  onClick={() => handleRowClick(item)}
                  className={`table-row-interactive border-b border-muted/30 ${
                    selectedRow === rowKey ? 'bg-primary/20' : ''
                  }`}
                >
                  <td className="py-2 px-2 text-primary font-medium">{item.pedido}</td>
                  <td className="py-2 px-2 text-card-foreground">{item.codItem}</td>
                  <td className="py-2 px-2 text-card-foreground truncate max-w-32">{item.descricao}</td>
                  <td className="py-2 px-2 text-card-foreground">{item.subgrupo}</td>
                  <td className="py-2 px-2 text-card-foreground text-right">{item.qtde}</td>
                  <td className="py-2 px-2 text-card-foreground text-right">{item.volumeTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-muted">
        <span className="text-xs text-muted-foreground">
          {filteredAndSorted.length} itens
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <span className="text-xs text-muted-foreground">
            {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemsTable;
