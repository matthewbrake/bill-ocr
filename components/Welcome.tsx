import React from 'react';

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-lg">
            {icon}
        </div>
        <div>
            <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </div>
);

const ScanIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const TableIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);
const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export const Welcome: React.FC = () => {
    return (
        <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Instantly Understand Your Utility Bill</h2>
            <p className="mt-2 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
                Upload a bill to let our Gemini-powered AI do the heavy lifting. Your analysis history will be saved in your browser.
            </p>
             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <Feature icon={<ScanIcon />} title="Intelligent OCR" description="Advanced AI accurately reads all the key details from your bill image." />
                <Feature icon={<TableIcon />} title="Data Extraction" description="Automatically extracts account info, due dates, and total amounts into a clear summary." />
                <Feature icon={<ChartIcon />} title="Usage Visualization" description="Recreates the usage graphs from your bill, making it easy to track consumption over time." />
            </div>
        </div>
    );
};