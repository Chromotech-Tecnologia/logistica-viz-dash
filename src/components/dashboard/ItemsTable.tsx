import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ItemPedido, pedidos } from '@/data/mockData';
import { useFilters } from '@/contexts/FilterContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const actualItemsPerPage = itemsPerPage === 'all' ? filteredAndSorted.length : itemsPerPage;
  const totalPages = Math.ceil(filteredAndSorted.length / actualItemsPerPage);
  const paginatedData = itemsPerPage === 'all' 
    ? filteredAndSorted 
    : filteredAndSorted.slice((currentPage - 1) * actualItemsPerPage, currentPage * actualItemsPerPage);

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
    const pedido = pedidos.find(p => p.pedido === item.pedido);
    if (!pedido) return;

    const rowKey = `${item.pedido}-${item.codItem}`;
    if (selectedRow === rowKey) {
      setSelectedRow(null);
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

  const handleItemsPerPageChange = (value: string) => {
    if (value === 'all') {
      setItemsPerPage('all');
    } else {
      setItemsPerPage(Number(value));
    }
    setCurrentPage(1);
  };

  const TableContent = ({ maxHeight = 280 }: { maxHeight?: number }) => (
    <>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="dashboard-card-title mb-0">Itens dos Pedidos</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Mostrar:</span>
            <Select 
              value={String(itemsPerPage)} 
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-16 h-7 text-xs bg-muted border-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-primary z-[100]">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              className="pl-7 pr-3 py-1.5 text-xs bg-muted border border-muted rounded text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary w-24 lg:w-32"
            />
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded hover:bg-muted transition-colors"
          >
            <Maximize2 className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      <ScrollArea className="w-full" style={{ height: maxHeight }}>
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card z-10">
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
                  className="text-left py-2 px-2 text-muted-foreground font-medium cursor-pointer hover:text-primary transition-colors whitespace-nowrap"
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
                  <td className="py-2 px-2 text-primary font-medium whitespace-nowrap">{item.pedido}</td>
                  <td className="py-2 px-2 text-card-foreground whitespace-nowrap">{item.codItem}</td>
                  <td className="py-2 px-2 text-card-foreground truncate max-w-32">{item.descricao}</td>
                  <td className="py-2 px-2 text-card-foreground whitespace-nowrap">{item.subgrupo}</td>
                  <td className="py-2 px-2 text-card-foreground text-right whitespace-nowrap">{item.qtde}</td>
                  <td className="py-2 px-2 text-card-foreground text-right whitespace-nowrap">{item.volumeTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollArea>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-muted">
        <span className="text-xs text-muted-foreground">
          {filteredAndSorted.length} itens
        </span>
        {itemsPerPage !== 'all' && (
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
        )}
      </div>
    </>
  );

  return (
    <>
      <div className="dashboard-card animate-fade-in h-full flex flex-col overflow-hidden">
        <TableContent maxHeight={140} />
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto bg-card border-primary">
          <DialogHeader>
            <DialogTitle className="text-primary">Itens dos Pedidos</DialogTitle>
          </DialogHeader>
          <TableContent maxHeight={500} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ItemsTable;
