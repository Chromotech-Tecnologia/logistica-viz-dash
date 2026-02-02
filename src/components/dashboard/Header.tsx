import React, { useState, useEffect } from 'react';
import { Package, Truck, Receipt, RefreshCw, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between max-w-[1800px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 lg:px-4 lg:py-2.5 bg-primary-foreground rounded-lg flex items-center justify-center">
            <span className="text-primary font-black text-sm lg:text-base">Logotipo</span>
          </div>
        </div>

        {/* Last Update - Hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-2 lg:gap-3 text-primary-foreground">
          <div className="text-center">
            <div className="text-xs font-medium opacity-80">Última Atualização:</div>
            <div className="text-xs lg:text-sm font-bold">{formatDate(lastUpdate)}</div>
          </div>
          <button
            onClick={handleRefresh}
            className="p-1.5 lg:p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            title="Atualizar"
          >
            <RefreshCw className="w-3 h-3 lg:w-4 lg:h-4" />
          </button>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-2">
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

        {/* Mobile Navigation Dropdown */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-foreground text-primary text-sm font-semibold">
                {activeTabData && <activeTabData.icon className="w-4 h-4" />}
                <span className="hidden xs:inline">{activeTabData?.label}</span>
                <Menu className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-primary z-[100]" align="end">
              {tabs.map(tab => (
                <DropdownMenuItem
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 cursor-pointer ${
                    activeTab === tab.id ? 'bg-primary/20 text-primary' : 'text-card-foreground'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
