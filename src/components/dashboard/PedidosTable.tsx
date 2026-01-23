import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Pedido } from '@/data/mockData';
import { useFilters } from '@/contexts/FilterContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PedidosTableProps {
  pedidos: Pedido[];
  title: string;
}

type SortField = 'nMov' | 'pedido' | 'tipoServico' | 'modalidade' | 'cidadeOrigem' | 'estado';
type SortDirection = 'asc' | 'desc';

const PedidosTable: React.FC<PedidosTableProps> = ({ pedidos, title }) => {
  const { updateFilter } = useFilters();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('nMov');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const itemsPerPage = 10;

  const filteredAndSorted = useMemo(() => {
    let result = [...pedidos];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p =>
        p.nMov.toLowerCase().includes(searchLower) ||
        p.pedido.toLowerCase().includes(searchLower) ||
        p.tipoServico.toLowerCase().includes(searchLower) ||
        p.modalidade.toLowerCase().includes(searchLower) ||
        p.cidadeOrigem.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const comparison = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [pedidos, search, sortField, sortDirection]);

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

  const handleRowClick = (pedido: Pedido) => {
    updateFilter('selectedPedido', pedido.id);
  };

  const TableContent = () => (
    <>
      <div className="flex items-center justify-between mb-3">
        <h3 className="dashboard-card-title mb-0">{title}</h3>
        <div className="flex items-center gap-2">
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
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded hover:bg-muted transition-colors"
          >
            <Maximize2 className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-muted">
              {[
                { key: 'nMov', label: 'Nº Mov.' },
                { key: 'pedido', label: 'Pedido' },
                { key: 'tipoServico', label: 'Tipo Serviço' },
                { key: 'modalidade', label: 'Modalidade' },
                { key: 'cidadeOrigem', label: 'Cidade' },
                { key: 'estado', label: 'UF' },
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
            {paginatedData.map((pedido, index) => (
              <tr
                key={pedido.id}
                onClick={() => handleRowClick(pedido)}
                className="table-row-interactive border-b border-muted/30"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-2 px-2 text-primary font-medium">{pedido.nMov}</td>
                <td className="py-2 px-2 text-card-foreground">{pedido.pedido}</td>
                <td className="py-2 px-2 text-card-foreground">{pedido.tipoServico}</td>
                <td className="py-2 px-2 text-card-foreground">{pedido.modalidade}</td>
                <td className="py-2 px-2 text-card-foreground">{pedido.cidadeOrigem}</td>
                <td className="py-2 px-2 text-card-foreground">{pedido.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-muted">
        <span className="text-xs text-muted-foreground">
          {filteredAndSorted.length} registros
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
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="dashboard-card animate-fade-in">
        <TableContent />
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-card border-primary">
          <DialogHeader>
            <DialogTitle className="text-primary">{title}</DialogTitle>
          </DialogHeader>
          <TableContent />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PedidosTable;
