import React from 'react';

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

const CogIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-1.57 1.996A1.532 1.532 0 013 7.482c-1.56.38-1.56 2.6 0 2.98a1.532 1.532 0 01.948 2.286c-.836 1.372.734 2.942 1.996 1.57a1.532 1.532 0 012.286.948c.38 1.56 2.6 1.56 2.98 0a1.532 1.532 0 012.286-.948c1.372.836 2.942-.734-1.57-1.996A1.532 1.532 0 0117 12.518c1.56-.38 1.56-2.6 0-2.98a1.532 1.532 0 01-.948-2.286c.836-1.372-.734-2.942-1.996-1.57A1.532 1.532 0 0111.49 3.17zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

interface HeaderProps {
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
    onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode, onOpenSettings }) => {
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
                onClick={onOpenSettings}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Open settings"
            >
                <CogIcon />
            </button>
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
