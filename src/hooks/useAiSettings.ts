import { useState, useEffect, useMemo } from 'react';
import type { AiSettings } from '../types';

const AI_SETTINGS_KEY = 'billAnalyzerAiSettings';

// Use the API key provided during the build process as the initial default.
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
                // Ensure the default key from build is used if the stored key is empty
                if (!parsed.geminiApiKey && buildTimeGeminiKey) {
                    parsed.geminiApiKey = buildTimeGeminiKey;
                }
                return { ...defaultSettings, ...parsed };
            }
        } catch (e) {
            console.error("Failed to load AI settings from localStorage", e);
        }
        // If nothing is stored, return the defaults (which include the build-time key)
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
