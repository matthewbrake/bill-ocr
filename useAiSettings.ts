import { useState, useEffect, useMemo } from 'react';
import type { AiSettings } from './types';

const AI_SETTINGS_KEY = 'billAnalyzerAiSettings';

// Use the API key provided during the build process as a default, if available.
const buildTimeGeminiKey = process.env.API_KEY || '';

const defaultSettings: AiSettings = {
    provider: 'gemini',
    geminiApiKey: buildTimeGeminiKey,
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llava',
};

export const useAiSettings = () => {
    const [settings, setSettings] = useState<AiSettings>(() => {
        try {
            const storedSettings = localStorage.getItem(AI_SETTINGS_KEY);
            if (storedSettings) {
                const parsed = JSON.parse(storedSettings);
                // Merge stored settings with defaults to ensure all keys are present
                return { ...defaultSettings, ...parsed };
            }
        } catch (e) {
            console.error("Failed to load AI settings from localStorage", e);
        }
        return defaultSettings;
    });

    useEffect(() => {
        try {
            localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error("Failed to save AI settings to localStorage", e);
        }
    }, [settings]);

    const isConfigured = useMemo(() => {
        if (settings.provider === 'gemini') {
            return !!settings.geminiApiKey;
        }
        if (settings.provider === 'ollama') {
            return !!settings.ollamaUrl && !!settings.ollamaModel;
        }
        return false;
    }, [settings]);

    return { settings, setSettings, isConfigured };
};
