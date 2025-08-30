import React, { useState, useCallback, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { BillDataDisplay } from './BillDataDisplay';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { analyzeBill } from './aiService';
import type { BillData } from './types';
import { Header } from './Header';
import { Welcome } from './Welcome';
import { CameraCapture } from './CameraCapture';
import { HistoryList } from './HistoryList';
import { useAiSettings } from './useAiSettings';
import { Settings } from './Settings';
import { checkRateLimit, recordRequest } from './rateLimiter';

const App: React.FC = () => {
  const [billData, setBillData] = useState<BillData | null>(null);
  const [history, setHistory] = useState<BillData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showConfidenceWarning, setShowConfidenceWarning] = useState<boolean>(false);

  const { settings, setSettings, isConfigured } = useAiSettings();

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
    // Rate limit check
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
      // Record the request before making the API call
      recordRequest();
      const data = await analyzeBill(imageData, settings);
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
  }, [settings]);

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
        onOpenSettings={() => setIsSettingsOpen(true)}
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
                onConfigure={() => setIsSettingsOpen(true)}
              />
              <HistoryList history={history} onSelect={handleSelectHistory} onDelete={handleDeleteHistory} />
            </>
          )}
        </div>
      </main>
      
      {isSettingsOpen && (
        <Settings 
          settings={settings}
          onSave={(newSettings) => {
            setSettings(newSettings);
            setIsSettingsOpen(false);
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
