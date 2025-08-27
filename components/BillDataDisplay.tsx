import React, { useState } from 'react';
import type { BillData, UsageChartData } from '../types';
import { UsageChart } from './UsageChart';
import { EditableUsageTable } from './EditableUsageTable';
import { exportBillToCsv } from '../utils/csv';

interface BillDataDisplayProps {
  data: BillData;
  setData: React.Dispatch<React.SetStateAction<BillData | null>>;
  onReset: () => void;
  showConfidenceWarning: boolean;
}

const EditIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const ChartIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 11h3v4H2v-4zM6 6h3v9H6V6zm5-4h3v13h-3V2z" />
    </svg>
);

const EditableField: React.FC<{label: string; value: string | number; onChange: (value: string | number) => void; type?: 'text' | 'number', prefix?: string}> = ({ label, value, onChange, type = 'text', prefix }) => (
    <div>
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
        <div className="relative">
             {prefix && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">{prefix}</span>}
            <input 
                type={type}
                value={value}
                onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                className={`w-full p-2 ${prefix ? 'pl-7' : ''} bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition`}
            />
        </div>
    </div>
);


const ConfidenceScore: React.FC<{ score: number }> = ({ score }) => {
    const percentage = Math.round(score * 100);
    const color = percentage > 85 ? 'text-green-500' : percentage > 60 ? 'text-amber-500' : 'text-red-500';

    return (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm print-container print-force-light">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">AI Confidence Score</p>
            <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-slate-200 dark:text-slate-700"
                            stroke="currentColor" strokeWidth="4" fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                            className={color}
                            stroke="currentColor" strokeWidth="4" fill="none"
                            strokeDasharray={`${percentage}, 100`} strokeLinecap="round"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xl font-bold ${color}`}>{percentage}%</span>
                    </div>
                </div>
                <div>
                     <p className={`text-lg font-semibold ${color}`}>{percentage > 85 ? 'High' : percentage > 60 ? 'Medium' : 'Low'}</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Based on image quality.</p>
                </div>
            </div>
        </div>
    );
};


export const BillDataDisplay: React.FC<BillDataDisplayProps> = ({ data, setData, onReset, showConfidenceWarning }) => {
  const [editingChartIndex, setEditingChartIndex] = useState<number | null>(null);

  const handleFieldChange = (field: keyof BillData, value: any) => {
    setData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handlePrint = () => window.print();
  
  const handleDownloadCsv = () => {
      exportBillToCsv(data);
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {showConfidenceWarning && (
             <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-500/50 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-md font-semibold text-amber-800 dark:text-amber-300">Low Confidence Warning</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                            The AI has low confidence in the accuracy of the extracted data, likely due to image quality. Please carefully review and edit all fields before submitting.
                        </p>
                    </div>
                </div>
            </div>
        )}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md print-container print-force-light">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 no-print">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Bill Analysis Complete</h2>
                    <p className="text-slate-500 dark:text-slate-400">Review, edit, and process the extracted data below.</p>
                </div>
                <button 
                    onClick={onReset}
                    className="mt-4 md:mt-0 px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 transition-colors"
                >
                    Analyze Another Bill
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <EditableField label="Account Number" value={data.accountNumber} onChange={(val) => handleFieldChange('accountNumber', val)} />
                {data.statementDate && <EditableField label="Statement Date" value={data.statementDate} onChange={(val) => handleFieldChange('statementDate', val)} />}
                {data.dueDate && <EditableField label="Due Date" value={data.dueDate} onChange={(val) => handleFieldChange('dueDate', val)} />}
                {data.accountName && <EditableField label="Account Name" value={data.accountName} onChange={(val) => handleFieldChange('accountName', val)} />}
                {data.serviceAddress && <div className="lg:col-span-2">
                    <EditableField label="Service Address" value={data.serviceAddress} onChange={(val) => handleFieldChange('serviceAddress', val)} />
                </div>}
                 <EditableField label="Total Amount Due" value={data.totalCurrentCharges} onChange={(val) => handleFieldChange('totalCurrentCharges', val)} type="number" prefix="$" />
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                 {data.lineItems && data.lineItems.length > 0 && (
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md print-container print-force-light">
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Charges & Credits</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 rounded-l-lg">Description</th>
                                        <th scope="col" className="px-6 py-3 text-right rounded-r-lg">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.lineItems.map((item, index) => (
                                        <tr key={index} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 last:border-b-0">
                                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                                {item.description}
                                            </th>
                                            <td className="px-6 py-4 text-right">${item.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <div className="space-y-6">
                {data.confidenceScore && <ConfidenceScore score={data.confidenceScore} />}
            </div>
        </div>

        {data.usageCharts && data.usageCharts.map((chartData, index) => (
            <div key={index} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md print-container print-force-light">
                <div className="flex justify-between items-center mb-4 no-print">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 capitalize">{chartData.title} ({chartData.unit})</h3>
                    <button
                        onClick={() => setEditingChartIndex(editingChartIndex === index ? null : index)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        {editingChartIndex === index ? <ChartIcon className="w-4 h-4" /> : <EditIcon className="w-4 h-4" />}
                        {editingChartIndex === index ? 'Show Chart' : 'Edit Data'}
                    </button>
                </div>
                {editingChartIndex === index ? (
                    <EditableUsageTable chartIndex={index} chartData={chartData} setData={setData} />
                ) : (
                    <UsageChart data={chartData} />
                )}
            </div>
        ))}
        <form 
            action="https://formspree.io/f/YOUR_FORM_ID" // Replace with your Formspree form ID
            method="POST"
            className="no-print"
        >
            <input type="hidden" name="billData" value={JSON.stringify(data)} />
            <input type="hidden" name="_subject" value={`New Bill Submission - Acct #${data.accountNumber}`} />
            
            <div className="flex flex-col md:flex-row gap-4 pt-4">
                 <button type="button" onClick={handlePrint} className="flex-1 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">Print Report</button>
                 <button type="button" onClick={handleDownloadCsv} className="flex-1 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">Download CSV</button>
                 <button type="submit" className="flex-1 px-4 py-3 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors">Submit Form</button>
            </div>
        </form>
    </div>
  );
};