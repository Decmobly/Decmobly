// src/app/gestor/(admin)/_components/DashboardCharts.tsx
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface DashboardChartsProps {
  contracts: { createdAt: Date | string }[]; 
}

export function DashboardCharts({ contracts }: DashboardChartsProps) {
  const dataMap = new Map<string, number>();
  
  // Gera os últimos 6 meses
  for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      // Remove pontos de abreviação (ex: "jan." vira "jan")
      const key = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''); 
      dataMap.set(key, 0);
  }

  // Popula com dados reais
  contracts.forEach(item => {
      const date = new Date(item.createdAt);
      const key = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
      
      if (dataMap.has(key)) {
          dataMap.set(key, (dataMap.get(key) || 0) + 1);
      }
  });

  const data = Array.from(dataMap).map(([name, total]) => ({ name, total }));

  return (
    // "height='100%'" permite que o gráfico preencha o Card pai do layout fixo
    // min-height evita colapso em telas muito pequenas
    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        
        {/* Adicionado Grid Horizontal Pontilhado para leitura fácil */}
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#efe4cd" />
        
        <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value: string) => value.charAt(0).toUpperCase() + value.slice(1)} 
            dy={10} // Pequeno afastamento para não colar na barra
        />
        
        <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
        />
        
        <Tooltip 
            cursor={{ fill: '#f7f1e3', opacity: 0.4 }} // Cor 'Wood-50' transparente no hover da coluna
            contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #efe4cd', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value: any) => [
                <span key="val" className="font-bold text-[#5c4d3c]">{value} projetos</span>, 
                ''
            ]}
            labelStyle={{ 
                color: '#847361', // Wood-400
                marginBottom: '0.2rem',
                fontSize: '0.8rem',
                textTransform: 'capitalize'
            }}
            // Remove o label "Novos" padrão do array do formatter para ficar mais limpo
            itemStyle={{ padding: 0 }}
        />
        
        <Bar 
            dataKey="total" 
            fill="#5c4d3c"  // COR DO PROJETO (Wood Principal)
            radius={[4, 4, 0, 0]} 
            // Hover state: levemente mais claro
            activeBar={{ fill: '#847361' }}
            barSize={40} // Largura máxima da barra para elegância
        />
      </BarChart>
    </ResponsiveContainer>
  );
}