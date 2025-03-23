import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  apiKey: string;
  defaultModel: string;
  useCustomPreprompts: boolean;
  prepromptPath: string;
  theme: 'light' | 'dark' | 'system';
  logLevel: 'debug' | 'info' | 'warning' | 'error';
  allowTelemetry: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  apiKey: '',
  defaultModel: 'gpt-4',
  useCustomPreprompts: false,
  prepromptPath: '',
  theme: 'system',
  logLevel: 'info',
  allowTelemetry: true,
};

const SettingsContext = createContext<SettingsContextType |undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('gpt-engineer-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gpt-engineer-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const value = {
    settings,
    updateSettings,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}