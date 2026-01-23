export interface Pedido {
  id: string;
  nMov: string;
  pedido: string;
  tipoServico: string;
  modalidade: string;
  cidadeOrigem: string;
  estado: string;
  regiao: string;
  campanha: string;
  status: 'FINALIZADO' | 'EM_TRANSITO' | 'PENDENTE';
  noPrazo: boolean;
  dataEntrega: string;
}

export interface ItemPedido {
  pedido: string;
  codItem: string;
  descricao: string;
  subgrupo: string;
  qtde: number;
  volumeTotal: number;
  valorTotal: number;
}

export const regioes = ['Sudeste', 'Nordeste', 'Sul', 'Centro-Oeste', 'Norte'];

export const estados: Record<string, string[]> = {
  'Sudeste': ['SP', 'RJ', 'MG', 'ES'],
  'Nordeste': ['BA', 'PE', 'CE', 'MA', 'PB', 'RN', 'AL', 'SE', 'PI'],
  'Sul': ['PR', 'SC', 'RS'],
  'Centro-Oeste': ['GO', 'MT', 'MS', 'DF'],
  'Norte': ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO'],
};

export const meses = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

export const modalidades = ['RODOVIÁRIO', 'EXCLUSIVO', 'AÉREO'];
export const tiposServico = ['ENTREGA', 'COLETA', 'DIFAL', 'REVERSA'];

const generatePedidos = (): Pedido[] => {
  const pedidos: Pedido[] = [];
  const campanhas = [
    '99TEC_1856_CAPACETES BHZ X SP',
    '99TEC_1831_S_ENTREGAS VIA FORTALEZ',
    '99TEC_1885_COBRANÇA EXTRA PPC',
    '99TEC_1819_4_ENTREGAS VIA FORTALEZ',
  ];

  for (let i = 0; i < 134; i++) {
    const regiao = regioes[Math.floor(Math.random() * regioes.length)];
    const estadosRegiao = estados[regiao];
    const estado = estadosRegiao[Math.floor(Math.random() * estadosRegiao.length)];
    const noPrazo = Math.random() > 0.0075; // 99.25% no prazo

    pedidos.push({
      id: `PED-${100000 + i}`,
      nMov: `${116418 + i}`,
      pedido: `${84249 + i}`,
      tipoServico: tiposServico[Math.floor(Math.random() * tiposServico.length)],
      modalidade: modalidades[Math.floor(Math.random() * modalidades.length)],
      cidadeOrigem: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Salvador', 'Recife', 'Fortaleza', 'Brasília', 'Manaus'][Math.floor(Math.random() * 10)],
      estado,
      regiao,
      campanha: campanhas[Math.floor(Math.random() * campanhas.length)],
      status: 'FINALIZADO',
      noPrazo,
      dataEntrega: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    });
  }

  return pedidos;
};

const generateItensPedidos = (pedidos: Pedido[]): ItemPedido[] => {
  const itens: ItemPedido[] = [];
  const descricoes = [
    'CAPACETE MODELO X',
    'JAQUETA TÉRMICA',
    'LUVAS DE PROTEÇÃO',
    'ÓCULOS DE SEGURANÇA',
    'BOTAS IMPERMEÁVEIS',
    'COLETE REFLETIVO',
  ];
  const subgrupos = ['EQUIPAMENTOS', 'VESTUÁRIO', 'ACESSÓRIOS', 'PROTEÇÃO'];

  pedidos.forEach(pedido => {
    const numItens = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numItens; i++) {
      itens.push({
        pedido: pedido.pedido,
        codItem: `ITM-${Math.floor(Math.random() * 10000)}`,
        descricao: descricoes[Math.floor(Math.random() * descricoes.length)],
        subgrupo: subgrupos[Math.floor(Math.random() * subgrupos.length)],
        qtde: Math.floor(Math.random() * 50) + 1,
        volumeTotal: Math.floor(Math.random() * 100) + 10,
        valorTotal: Math.floor(Math.random() * 5000) + 100,
      });
    }
  });

  return itens;
};

export const pedidos = generatePedidos();
export const itensPedidos = generateItensPedidos(pedidos);

export const getMetrics = (filteredPedidos: Pedido[]) => {
  const total = filteredPedidos.length;
  const noPrazo = filteredPedidos.filter(p => p.noPrazo).length;
  const foraPrazo = total - noPrazo;
  const percentualNoPrazo = total > 0 ? (noPrazo / total) * 100 : 0;
  const percentualForaPrazo = total > 0 ? (foraPrazo / total) * 100 : 0;

  return {
    total,
    noPrazo,
    foraPrazo,
    percentualNoPrazo,
    percentualForaPrazo,
  };
};

export const getRegionDistribution = (filteredPedidos: Pedido[]) => {
  const distribution: Record<string, number> = {};
  regioes.forEach(r => distribution[r] = 0);
  
  filteredPedidos.forEach(p => {
    distribution[p.regiao]++;
  });

  const total = filteredPedidos.length;
  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value,
    percentage: total > 0 ? ((value / total) * 100).toFixed(2) : '0',
  }));
};

export const getModalityDistribution = (filteredPedidos: Pedido[]) => {
  const distribution: Record<string, number> = {};
  modalidades.forEach(m => distribution[m] = 0);
  
  filteredPedidos.forEach(p => {
    distribution[p.modalidade]++;
  });

  return Object.entries(distribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getServiceTypeDistribution = (filteredPedidos: Pedido[]) => {
  const distribution: Record<string, number> = {};
  tiposServico.forEach(t => distribution[t] = 0);
  
  filteredPedidos.forEach(p => {
    distribution[p.tipoServico]++;
  });

  return Object.entries(distribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getStateDistribution = (filteredPedidos: Pedido[]) => {
  const distribution: Record<string, number> = {};
  
  filteredPedidos.forEach(p => {
    distribution[p.estado] = (distribution[p.estado] || 0) + 1;
  });

  return distribution;
};
