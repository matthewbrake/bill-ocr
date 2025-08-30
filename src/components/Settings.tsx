import React, { useState, useEffect } from 'react';
import type { AiSettings, AiProvider } from '../types';

interface SettingsProps {
    settings: AiSettings;
    onSave: (settings: AiSettings) => void;
    onClose: () => void;
}

const InputField: React.FC<{label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; description?: string}> = 
({ label, id, value, onChange, type = 'text', placeholder, description }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400
            focus:outline-none focus:ring-sky-500 focus:border-sky-500"
        />
        {description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
);

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export const Settings: React.FC<SettingsProps> = ({ settings, onSave, onClose }) => {
    const [localSettings, setLocalSettings] = useState<AiSettings>(settings);
    const [activeTab, setActiveTab] = useState<AiProvider>(settings.provider);

    const [ollamaConnection, setOllamaConnection] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });
    const [ollamaModels, setOllamaModels] = useState<string[]>([]);


    const handleSave = () => {
        onSave({ ...localSettings, provider: activeTab });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setLocalSettings(prev => ({ ...prev, [id]: value }));
    };

     const handleTestConnection = async () => {
        setOllamaConnection({ status: 'testing', message: 'Testing connection...' });
        setOllamaModels([]);
        try {
            const url = new URL('/api/tags', localSettings.ollamaUrl).toString();
            const response = await fetch(url, { signal: AbortSignal.timeout(5000) }); // 5 second timeout
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            const data = await response.json();

            if (data && Array.isArray(data.models)) {
                const modelNames = data.models.map((m: { name: string }) => m.name);
                setOllamaModels(modelNames);

                if (modelNames.length > 0) {
                    setOllamaConnection({ status: 'success', message: `Success! Found ${modelNames.length} models.` });
                    if (!modelNames.includes(localSettings.ollamaModel)) {
                        setLocalSettings(prev => ({ ...prev, ollamaModel: modelNames[0] }));
                    }
                } else {
                    setOllamaConnection({ status: 'error', message: 'Connected, but no models found on server.' });
                }
            } else {
                throw new Error('Received an invalid response from the server.');
            }
        } catch (error) {
            console.error("Ollama connection test failed:", error);
            const errorMessage = error instanceof Error && error.name === 'TimeoutError'
                ? 'Connection timed out. Check the server URL.'
                : 'Connection failed. Check URL and ensure Ollama is running with CORS enabled.';
            setOllamaConnection({ status: 'error', message: errorMessage });
        }
    };
    
    const TabButton: React.FC<{provider: AiProvider; children: React.ReactNode}> = ({ provider, children }) => (
        <button
            onClick={() => setActiveTab(provider)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2
            ${activeTab === provider 
                ? 'border-sky-500 text-sky-600 dark:text-sky-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
        >
            {children}
        </button>
    );

    const connectionStatusStyles = {
        success: 'text-green-600 dark:text-green-500',
        error: 'text-red-600 dark:text-red-500',
        testing: 'text-slate-500 dark:text-slate-400',
        idle: 'text-slate-500 dark:text-slate-400',
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-slate-50 dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md m-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Provider Settings</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Choose and configure your preferred AI model.</p>
                </div>

                <div className="p-6">
                    <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                           <TabButton provider="gemini">Google Gemini</TabButton>
                           <TabButton provider="ollama">Ollama (Local)</TabButton>
                        </nav>
                    </div>

                    <div className="space-y-4">
                        {activeTab === 'gemini' && (
                            <div className="space-y-4 animate-fade-in">
                                <InputField 
                                    label="Gemini API Key"
                                    id="geminiApiKey"
                                    value={localSettings.geminiApiKey}
                                    onChange={handleInputChange}
                                    type="password"
                                    placeholder="Enter your Gemini API Key"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline">Google AI Studio</a>.
                                    The key is stored only in your browser.
                                </p>
                            </div>
                        )}

                        {activeTab === 'ollama' && (
                             <div className="space-y-4 animate-fade-in">
                                <div>
                                    <div className="flex items-end gap-2">
                                        <div className="flex-grow">
                                            <InputField 
                                                label="Ollama Server URL"
                                                id="ollamaUrl"
                                                value={localSettings.ollamaUrl}
                                                onChange={handleInputChange}
                                                placeholder="e.g., http://localhost:11434"
                                            />
                                        </div>
                                        <button 
                                            onClick={handleTestConnection}
                                            disabled={ollamaConnection.status === 'testing'}
                                            className="flex-shrink-0 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors"
                                        >
                                           {ollamaConnection.status === 'testing' && <SpinnerIcon />}
                                           Test
                                        </button>
                                    </div>
                                    {ollamaConnection.status !== 'idle' && (
                                        <p className={`mt-1.5 text-xs ${connectionStatusStyles[ollamaConnection.status]}`}>
                                            {ollamaConnection.message}
                                        </p>
                                    )}
                                </div>
                                {ollamaModels.length > 0 ? (
                                    <div>
                                        <label htmlFor="ollamaModel" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Model Name
                                        </label>
                                        <select
                                            id="ollamaModel"
                                            value={localSettings.ollamaModel}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm
                                            focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                        >
                                            {ollamaModels.map(modelName => (
                                                <option key={modelName} value={modelName}>
                                                    {modelName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <InputField 
                                        label="Model Name"
                                        id="ollamaModel"
                                        value={localSettings.ollamaModel}
                                        onChange={handleInputChange}
                                        placeholder="e.g., llava, moondream"
                                        description="Test connection to auto-populate this list."
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-slate-100 dark:bg-slate-900/50 rounded-b-xl flex justify-end gap-4">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};
