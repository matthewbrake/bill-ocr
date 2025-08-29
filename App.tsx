import React, { useState, useCallback, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { BillDataDisplay } from './BillDataDisplay';
import { analyzeBill } from './geminiService';
import type { BillData } from './types';
import { CameraCapture } from './CameraCapture';
import { HistoryList } from './HistoryList';
import { checkRateLimit, recordRequest } from './utils/rateLimiter';

// --- Consolidated Components ---

const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const Header: React.FC<{ isDarkMode: boolean; setIsDarkMode: (value: boolean) => void; }> = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <header className="bg-gradient-to-r from-sky-600 to-cyan-500 shadow-md no-print">
      <div className="container mx-auto px-4 py-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full">
                <LogoIcon />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                AI Bill Analyzer
            </h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
            <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-12 h-6 rounded-full p-1 bg-slate-900/20 flex items-center transition-colors"
                aria-label="Toggle dark mode"
            >
                <div
                    className={`w-5 h-5 rounded-full bg-white flex items-center justify-center transform transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}
                >
                    {isDarkMode ? <MoonIcon /> : <SunIcon />}
                </div>
            </button>
        </div>
      </div>
    </header>
  );
};

const Welcome: React.FC = () => {
    const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-lg">{icon}</div>
            <div>
                <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>
        </div>
    );
    return (
        <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Instantly Understand Your Utility Bill</h2>
            <p className="mt-2 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
                Upload a bill to let our Gemini-powered AI do the heavy lifting. Your analysis history will be saved in your browser.
            </p>
             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <Feature icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>} title="Intelligent OCR" description="Advanced AI accurately reads all the key details from your bill image." />
                <Feature icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>} title="Data Extraction" description="Automatically extracts account info, due dates, and total amounts into a clear summary." />
                <Feature icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} title="Usage Visualization" description="Recreates the usage graphs from your bill, making it easy to track consumption over time." />
            </div>
        </div>
    );
};

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-xl shadow-md space-y-4">
    <svg className="animate-spin h-10 w-10 text-sky-600 dark:text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Analyzing Your Bill...</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">
      Our AI is reading the details and usage charts. This might take a moment.
    </p>
  </div>
);

const ErrorMessage: React.FC<{ message: string; onRetry: () => void; }> = ({ message, onRetry }) => (
  <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl text-center space-y-4">
    <div className="flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    </div>
    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">An Error Occurred</h3>
    <p className="text-red-700 dark:text-red-300 text-sm">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
    >
      Try Again
    </button>
  </div>
);


// --- Main App Component ---

const App: React.FC = () => {
  const [billData, setBillData] = useState<BillData | null>(null);
  const [history, setHistory] = useState<BillData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [showConfidenceWarning, setShowConfidenceWarning] = useState<boolean>(false);

  const apiKey = process.env.API_KEY || '';
  const isConfigured = !!apiKey;

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') === 'dark' || 
               (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('billAnalysisHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('billAnalysisHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const processImage = useCallback(async (imageData: string) => {
    if (!isConfigured) {
        setError("API Key is not configured. Please set it in your .env file and rebuild the application.");
        return;
    }
    const rateLimitInfo = checkRateLimit();
    if (!rateLimitInfo.allowed) {
      setError(`Rate limit exceeded. Please try again in ${rateLimitInfo.retryAfter} seconds.`);
      return;
    }
      
    setIsLoading(true);
    setBillData(null);
    setError(null);
    setShowConfidenceWarning(false);

    try {
      recordRequest();
      const data = await analyzeBill(imageData, apiKey);
      const newData: BillData = {
          ...data,
          id: self.crypto.randomUUID(),
          analyzedAt: new Date().toISOString(),
      };
      setBillData(newData);
      setHistory(prev => [newData, ...prev.filter(h => h.id !== newData.id)]);

      if ((newData.confidenceScore ?? 1.0) < 0.75) {
        setShowConfidenceWarning(true);
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred during bill analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, isConfigured]);

  const handleFileUpload = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      processImage(reader.result as string);
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, [processImage]);

  const handleCapture = useCallback((imageData: string) => {
    setIsCameraOpen(false);
    processImage(imageData);
  }, [processImage]);
  
  const handleReset = () => {
    setBillData(null);
    setError(null);
    setIsLoading(false);
    setShowConfidenceWarning(false);
  };
  
  const handleSelectHistory = (id: string) => {
    const selectedBill = history.find(h => h.id === id);
    if (selectedBill) {
      setBillData(selectedBill);
      setError(null);
      setIsLoading(false);
      setShowConfidenceWarning((selectedBill.confidenceScore ?? 1.0) < 0.75);
    }
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  if (isCameraOpen) {
    return <CameraCapture onCapture={handleCapture} onCancel={() => setIsCameraOpen(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
      />
      <main className="container mx-auto p-4 md:p-8">
        
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} onRetry={handleReset} />
          ) : billData ? (
            <BillDataDisplay 
              data={billData} 
              setData={setBillData} 
              onReset={handleReset} 
              showConfidenceWarning={showConfidenceWarning}
            />
          ) : (
            <>
              <Welcome />
              <FileUpload 
                onFileUpload={handleFileUpload} 
                onUseCamera={() => setIsCameraOpen(true)} 
                isConfigured={isConfigured}
              />
              <HistoryList history={history} onSelect={handleSelectHistory} onDelete={handleDeleteHistory} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
