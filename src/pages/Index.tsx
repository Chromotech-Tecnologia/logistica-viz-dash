import React, { useState, useMemo } from 'react';
import { FilterProvider, useFilters } from '@/contexts/FilterContext';
import Header from '@/components/dashboard/Header';
import FilterBar from '@/components/dashboard/FilterBar';
import MetricCard from '@/components/dashboard/MetricCard';
import PerformanceGauge from '@/components/dashboard/PerformanceGauge';
import RegionPieChart from '@/components/dashboard/RegionPieChart';
import HorizontalBarChart from '@/components/dashboard/HorizontalBarChart';
import StatusCard from '@/components/dashboard/StatusCard';
import BrazilMap from '@/components/dashboard/BrazilMap';
import PedidosTable from '@/components/dashboard/PedidosTable';
import ItemsTable from '@/components/dashboard/ItemsTable';
import {
  pedidos,
  itensPedidos,
  getMetrics,
  getRegionDistribution,
  getModalityDistribution,
  getServiceTypeDistribution,
  getStateDistribution,
  meses,
} from '@/data/mockData';

const DashboardContent: React.FC = () => {
  const { filters } = useFilters();

  const filteredPedidos = useMemo(() => {
    return pedidos.filter(pedido => {
      // Filter by months
      if (filters.months.length > 0) {
        const pedidoMonth = new Date(pedido.dataEntrega).getMonth();
        const pedidoMonthName = meses[pedidoMonth];
        if (!filters.months.includes(pedidoMonthName)) return false;
      }

      // Filter by regions
      if (filters.regions.length > 0) {
        if (!filters.regions.includes(pedido.regiao)) return false;
      }

      // Filter by states
      if (filters.states.length > 0) {
        if (!filters.states.includes(pedido.estado)) return false;
      }

      // Filter by modalities
      if (filters.modalities.length > 0) {
        if (!filters.modalities.includes(pedido.modalidade)) return false;
      }

      // Filter by service types
      if (filters.serviceTypes.length > 0) {
        if (!filters.serviceTypes.includes(pedido.tipoServico)) return false;
      }

      // Filter by prazo status
      if (filters.prazoStatus === 'noPrazo') {
        if (!pedido.noPrazo) return false;
      } else if (filters.prazoStatus === 'foraPrazo') {
        if (pedido.noPrazo) return false;
      }

      return true;
    });
  }, [filters]);

  const filteredItems = useMemo(() => {
    const pedidoIds = new Set(filteredPedidos.map(p => p.pedido));
    return itensPedidos.filter(item => pedidoIds.has(item.pedido));
  }, [filteredPedidos]);

  const metrics = getMetrics(filteredPedidos);
  const regionData = getRegionDistribution(filteredPedidos);
  const modalityData = getModalityDistribution(filteredPedidos);
  const serviceTypeData = getServiceTypeDistribution(filteredPedidos);
  const stateData = getStateDistribution(filteredPedidos);

  const statusData = [
    { label: 'FINALIZADO', value: filteredPedidos.filter(p => p.status === 'FINALIZADO').length },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Main Grid */}
      <main className="pt-32 px-4 pb-8">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-12 gap-3">
            
            {/* Row 1 - Metrics, Status, Performance, Pie Chart, Table */}
            <div className="col-span-12 lg:col-span-2">
              <MetricCard
                title="Quantidade de Pedidos"
                value={metrics.total}
                size="lg"
              />
            </div>
            
            <div className="col-span-6 lg:col-span-1">
              <MetricCard
                title="Qtde no Prazo"
                value={metrics.noPrazo}
                percentage={`${metrics.percentualNoPrazo.toFixed(2)}%`}
                variant="success"
                size="sm"
              />
            </div>
            
            <div className="col-span-6 lg:col-span-1">
              <MetricCard
                title="Qtde fora do Prazo"
                value={metrics.foraPrazo}
                percentage={`${metrics.percentualForaPrazo.toFixed(2)}%`}
                variant={metrics.percentualForaPrazo > 5 ? 'danger' : 'default'}
                size="sm"
              />
            </div>

            <div className="col-span-12 lg:col-span-2">
              <RegionPieChart data={regionData} />
            </div>

            <div className="col-span-12 lg:col-span-6 row-span-2">
              <PedidosTable pedidos={filteredPedidos} title="Pedidos Consolidados" />
            </div>

            {/* Row 2 - Status and Performance */}
            <div className="col-span-12 lg:col-span-2">
              <StatusCard data={statusData} />
            </div>
            
            <div className="col-span-12 lg:col-span-2">
              <PerformanceGauge percentage={metrics.percentualNoPrazo} />
            </div>

            {/* Row 3 - Bar Charts and Map */}
            <div className="col-span-12 lg:col-span-2">
              <HorizontalBarChart
                data={modalityData}
                title="Pedidos | Modalidade"
                filterKey="modalities"
              />
            </div>
            
            <div className="col-span-12 lg:col-span-2">
              <HorizontalBarChart
                data={serviceTypeData}
                title="Pedidos | Tipo de Serviço"
                filterKey="serviceTypes"
              />
            </div>

            <div className="col-span-12 lg:col-span-2">
              <BrazilMap stateData={stateData} />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <ItemsTable items={filteredItems} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'estoque' | 'tracking' | 'faturamento'>('tracking');

  return (
    <FilterProvider>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <FilterBar />
      
      {activeTab === 'tracking' ? (
        <DashboardContent />
      ) : (
        <div className="min-h-screen bg-background pt-32 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {activeTab === 'estoque' ? 'Estoque' : 'Faturamento'}
            </h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        </div>
      )}
    </FilterProvider>
  );
};

export default Index;
