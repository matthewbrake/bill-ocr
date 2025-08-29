import React from 'react';
import type { BillData, UsageChartData } from '../types';

interface EditableUsageTableProps {
  chartIndex: number;
  chartData: UsageChartData;
  setData: React.Dispatch<React.SetStateAction<BillData | null>>;
}

export const EditableUsageTable: React.FC<EditableUsageTableProps> = ({ chartIndex, chartData, setData }) => {

    const years = chartData.data.length > 0 
        ? [...new Set(chartData.data.flatMap(d => d.usage.map(u => u.year)))].sort()
        : [];

    const handleUsageChange = (monthIndex: number, yearToUpdate: string, value: string) => {
        const numericValue = parseInt(value, 10) || 0;
        setData(prev => {
            if (!prev) return null;
            
            // Perform immutable update of nested state using .map for clarity
            const newCharts = prev.usageCharts.map((chart, cIndex) => {
                if (cIndex !== chartIndex) return chart;

                const newData = chart.data.map((point, pIndex) => {
                    if (pIndex !== monthIndex) return point;

                    const newUsage = point.usage.map(u => 
                        u.year === yearToUpdate ? { ...u, value: numericValue } : u
                    );
                    return { ...point, usage: newUsage };
                });

                return { ...chart, data: newData };
            });

            return { ...prev, usageCharts: newCharts };
        });
    };

    return (
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 rounded-l-lg">Month</th>
                        {years.map(year => (
                             <th key={year} scope="col" className="px-6 py-3 text-right">{year} Usage ({chartData.unit})</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {chartData.data.map((item, monthIndex) => (
                        <tr key={item.month} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 last:border-b-0">
                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                {item.month}
                            </th>
                            {years.map(year => {
                                const usageForYear = item.usage.find(u => u.year === year)?.value ?? 0;
                                return (
                                    <td key={year} className="px-6 py-4 text-right">
                                        <input
                                            type="number"
                                            value={usageForYear}
                                            onChange={(e) => handleUsageChange(monthIndex, year, e.target.value)}
                                            className="w-24 p-1 text-right bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
