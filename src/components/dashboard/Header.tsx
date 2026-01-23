import React, { useState, useEffect } from 'react';
import { Package, Truck, Receipt, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'estoque' | 'tracking' | 'faturamento';
  onTabChange: (tab: 'estoque' | 'tracking' | 'faturamento') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }) + ' ' + date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
  };

  const tabs = [
    { id: 'estoque' as const, label: 'Estoque', icon: Package },
    { id: 'tracking' as const, label: 'Tracking Entrega', icon: Truck },
    { id: 'faturamento' as const, label: 'Faturamento', icon: Receipt },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary px-6 py-3">
      <div className="flex items-center justify-between max-w-[1800px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-primary-foreground rounded-lg flex items-center justify-center">
            <span className="text-primary font-black text-2xl">99</span>
          </div>
        </div>

        {/* Last Update */}
        <div className="flex items-center gap-3 text-primary-foreground">
          <div className="text-center">
            <div className="text-xs font-medium opacity-80">Última Atualização:</div>
            <div className="text-sm font-bold">{formatDate(lastUpdate)}</div>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            title="Atualizar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-foreground text-primary'
                  : 'text-primary-foreground hover:bg-primary-foreground/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
