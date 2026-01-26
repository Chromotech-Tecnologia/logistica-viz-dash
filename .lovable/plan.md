
# Plano de Correções do Dashboard

## Resumo dos Problemas Identificados

1. **Gráfico de Rosca (Pedido | Região)**: O gráfico está sendo cortado no PC porque o container não tem espaço suficiente e o layout está comprimido
2. **Mapa do Brasil (Pedidos | Estado)**: Os paths SVG atuais são muito simplificados e não parecem um mapa real do Brasil - precisa de um SVG vetorial preciso
3. **Cards sem padrão**: Os cards têm alturas diferentes e não estão alinhados uniformemente - falta simetria no layout

---

## 1. Correção do Gráfico de Rosca (RegionPieChart.tsx)

### Problema Atual
- Container com altura fixa de `h-48` (192px) que não dá espaço suficiente
- O layout `flex items-center justify-between` está comprimindo o gráfico
- `innerRadius={40}` e `outerRadius={70}` podem estar muito grandes para o container

### Solução
- Reorganizar o layout para exibir a legenda abaixo do gráfico (como na imagem 1)
- Ajustar o container para ocupar mais espaço vertical
- Reduzir o `paddingAngle` e ajustar os raios para evitar corte
- Adicionar `overflow: visible` ao container do gráfico

### Alterações no Código

```tsx
// RegionPieChart.tsx
// Mudar de layout horizontal para vertical
<div className="dashboard-card h-full animate-slide-up flex flex-col">
  <h3 className="dashboard-card-title">Pedido | Região</h3>
  
  {/* Gráfico centralizado com altura adequada */}
  <div className="flex-1 flex items-center justify-center min-h-[180px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="35%"
          outerRadius="65%"
          paddingAngle={1}
          ...
        />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Legenda abaixo do gráfico */}
  <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-muted">
    {data.map(...)}
  </div>
</div>
```

---

## 2. Novo Mapa do Brasil (BrazilMap.tsx)

### Problema Atual
- Os paths SVG atuais são polígonos simplificados que não parecem estados reais
- O mapa atual parece uma coleção de formas geométricas desconectadas

### Solução
Substituir completamente pelos paths SVG oficiais do mapa do Brasil. Vou usar coordenadas precisas baseadas em mapas vetoriais reais do IBGE.

### Nova Estrutura do Componente

```tsx
// BrazilMap.tsx - Paths SVG precisos para cada estado
const statePaths: Record<string, { d: string; name: string }> = {
  AC: { 
    d: "M115.7,211.5l-1.8-5.3l-6.4-3.3l-4.4-0.1l-5.3,3.4l-6.3,0.3l-3.1-1.4l-0.6-2.7l-2.9-0.6l-1.1-3.7l-4.5-4.4l0.2-3.2l-2.5-2.2l3.8-5.8l1-7l5.7,0.5l8.5,2l9.7,0.3l4.9,1.5l3.9,5.7l4.6,2.7l0.8,3.2l5.9,2.6l0.9,5.3l-3.1,8.3l-4.9,3.1L115.7,211.5z",
    name: "Acre" 
  },
  // ... todos os 27 estados com paths precisos
};
```

### Características do Novo Mapa
- Paths SVG vetoriais precisos que formam o contorno real do Brasil
- ViewBox ajustada para centralizar o mapa: `viewBox="0 0 600 560"`
- Estados com formas geográficas corretas
- Cores usando gradiente baseado em volume (mais claro = menos pedidos, mais escuro = mais pedidos)
- Interatividade mantida (clique para filtrar)

---

## 3. Padronização do Layout dos Cards (Index.tsx)

### Problema Atual
- Cards com `min-h-[120px]`, `min-h-[90px]`, `min-h-[320px]`, `min-h-[260px]` - valores inconsistentes
- Alguns cards não preenchem a altura da linha
- Cards não têm `h-full` para esticar até o container pai

### Solução
Reorganizar o grid para ter linhas com alturas uniformes e usar `h-full` em todos os cards.

### Nova Estrutura do Grid Desktop

```
Linha 1 (altura: 320px):
[Quantidade Pedidos + No Prazo + Fora Prazo] | [Pedido | Região] | [Pedidos Consolidados] | [Mapa Brasil]
       col-span-2                            |    col-span-2     |     col-span-5         |  col-span-3

Linha 2 (altura: 280px):
[Status Pedidos] | [Tipo Serviço] | [Performance] | [Modalidade] | [Itens Pedidos]
   col-span-2    |   col-span-2   |   col-span-2  |  col-span-2  |   col-span-4
```

### Código Atualizado

```tsx
// Index.tsx
<div className="hidden lg:grid grid-cols-12 gap-3">
  {/* Linha 1 - Altura fixa de 320px */}
  <div className="col-span-2 grid grid-rows-3 gap-3" style={{ height: '320px' }}>
    <div className="h-full"><MetricCard ... /></div>
    <div className="h-full"><MetricCard ... /></div>
    <div className="h-full"><MetricCard ... /></div>
  </div>
  
  <div className="col-span-2" style={{ height: '320px' }}>
    <RegionPieChart data={regionData} />
  </div>
  
  <div className="col-span-5" style={{ height: '320px' }}>
    <PedidosTable ... />
  </div>
  
  <div className="col-span-3" style={{ height: '320px' }}>
    <BrazilMap ... />
  </div>

  {/* Linha 2 - Altura fixa de 280px */}
  <div className="col-span-2" style={{ height: '280px' }}>
    <StatusCard ... className="h-full" />
  </div>
  
  {/* ... demais cards com mesma altura */}
</div>
```

---

## 4. Ajustes nos Componentes para h-full

### MetricCard.tsx
```tsx
<div className={cn('dashboard-card animate-fade-in h-full', className)}>
```

### StatusCard.tsx
```tsx
<div className="dashboard-card animate-slide-up h-full">
```

### HorizontalBarChart.tsx
```tsx
<div className="dashboard-card animate-slide-up h-full">
```

### PerformanceGauge.tsx
```tsx
<div className="dashboard-card flex flex-col items-center justify-center h-full animate-scale-in">
```

---

## 5. Arquivos a Modificar

| Arquivo | Alterações |
|---------|------------|
| `src/components/dashboard/RegionPieChart.tsx` | Reorganizar layout vertical, ajustar tamanho do gráfico, mover legenda para baixo |
| `src/components/dashboard/BrazilMap.tsx` | Substituir completamente com paths SVG precisos do mapa do Brasil |
| `src/pages/Index.tsx` | Padronizar alturas dos cards, usar grid com alturas fixas por linha |
| `src/components/dashboard/MetricCard.tsx` | Adicionar h-full ao container |
| `src/components/dashboard/StatusCard.tsx` | Adicionar h-full ao container |
| `src/components/dashboard/HorizontalBarChart.tsx` | Adicionar h-full ao container |
| `src/components/dashboard/PerformanceGauge.tsx` | Adicionar h-full ao container |

---

## 6. Detalhes Técnicos do Mapa do Brasil

O novo mapa usara paths SVG precisos extraídos de fontes oficiais (IBGE). Cada estado tera:
- Path `d` com coordenadas vetoriais reais
- Nome completo para tooltip
- Cor dinâmica baseada no volume de pedidos (escala azul-claro para representar o tema da imagem 3)
- Interatividade de clique para filtrar

### ViewBox e Escala
- `viewBox="0 0 600 560"` para dimensoes proporcionais
- Estados posicionados geograficamente corretos
- Bordas suaves entre estados com `strokeWidth="0.5"`

---

## 7. Ordem de Implementação

1. Atualizar todos os componentes de card para usar `h-full`
2. Refatorar `Index.tsx` com grid de alturas fixas por linha
3. Redesenhar `RegionPieChart.tsx` com layout vertical
4. Substituir `BrazilMap.tsx` com SVG preciso do Brasil
5. Testar responsividade e ajustar se necessário

---

## Resultado Esperado

- Gráfico de rosca exibido completamente sem cortes
- Mapa do Brasil com formato geograficamente correto e clicável
- Todos os cards alinhados com altura uniforme por linha
- Layout simétrico como na imagem 5 de referência
- Responsividade mantida para mobile
