import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { UsageChartData } from '../types';

interface UsageChartProps {
  data: UsageChartData;
}

const COLORS = ['#38bdf8', '#4ade80', '#fbbf24', '#a78bfa', '#f472b6'];

export const UsageChart: React.FC<UsageChartProps> = ({ data }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const tickColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#334155' : '#e0e0e0';

  // Transform data for recharts: from [{month, usage: [{year, value}]}] to [{month, '2022': value, '2023': value}]
  const chartData = data.data.map(d => {
    const usageByYear = d.usage.reduce((acc, current) => {
        acc[current.year] = current.value;
        return acc;
    }, {} as { [key: string]: number });
    return {
        month: d.month,
        ...usageByYear
    };
  });
  
  // Get all unique years from the data and sort them
  const years = data.data.length > 0 
    ? [...new Set(data.data.flatMap(d => d.usage.map(u => u.year)))].sort()
    : [];
  
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="month" fontSize={12} tick={{ fill: tickColor }}/>
          <YAxis fontSize={12} tick={{ fill: tickColor }}/>
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              color: isDarkMode ? '#e2e8f0' : '#1e293b'
            }}
            cursor={{fill: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.5)'}}
          />
          <Legend wrapperStyle={{fontSize: '14px', color: tickColor}}/>
          {years.map((year, index) => (
             <Bar key={year} dataKey={year} fill={COLORS[index % COLORS.length]} name={year} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};