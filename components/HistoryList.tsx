import React from 'react';
import type { BillData } from '../types';

interface HistoryListProps {
    history: BillData[];
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

const HistoryItem: React.FC<{ item: BillData; onSelect: (id: string) => void; onDelete: (id: string) => void; }> = ({ item, onSelect, onDelete }) => {
    return (
        <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                    Account: <span className="font-mono">{item.accountNumber}</span>
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Analyzed on: {new Date(item.analyzedAt).toLocaleString()}
                </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                    onClick={() => onSelect(item.id)}
                    className="px-3 py-1.5 text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/50 rounded-md hover:bg-sky-200 dark:hover:bg-sky-900 transition-colors"
                >
                    View
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
                    aria-label="Delete history item"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {/* Fix: Completed SVG path for delete icon */}
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" />
                    </svg>
                </button>
            </div>
        </li>
    );
};

// Fix: Added missing HistoryList component and exported it to resolve the import error. The original file content was incomplete.
export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onDelete }) => {
    return (
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Analysis History</h3>
            {history.length > 0 ? (
                <ul className="space-y-3">
                    {history.map(item => (
                        <HistoryItem key={item.id} item={item} onSelect={onSelect} onDelete={onDelete} />
                    ))}
                </ul>
            ) : (
                 <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">No analysis history found. Upload a bill to get started.</p>
            )}
        </div>
    );
};
