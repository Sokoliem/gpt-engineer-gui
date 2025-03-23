import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { KeyboardShortcutsSettings } from '@/components/settings/keyboard-shortcuts';
import { useKeyboardShortcuts } from '@/lib/keyboard-shortcuts';
import { useTheme } from '@/hooks/use-theme';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/hooks/use-onboarding';
import { HelpTooltip } from '@/components/ui/help-tooltip';

export function SettingsPage() {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const { resetOnboarding, setShowWelcome } = useOnboarding();
  
  const shortcutActions = {
    'run': () => console.log('Run shortcut triggered'),
    'save': () => console.log('Save shortcut triggered'),
    'new-project': () => navigate('/new'),
    'toggle-theme': () => toggleTheme(),
    'search': () => console.log('Search shortcut triggered'),
  };
  
  const { 
    shortcuts, 
    updateShortcut, 
    resetShortcut, 
    resetAllShortcuts 
  } = useKeyboardShortcuts(shortcutActions);

  const handleResetOnboarding = () => {
    resetOnboarding();
    setShowWelcome(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="keyboard">
        <TabsList>
          <TabsTrigger value="keyboard">Keyboard Shortcuts</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keyboard" className="mt-6">
          <KeyboardShortcutsSettings
            shortcuts={shortcuts}
            onUpdateShortcut={updateShortcut}
            onResetShortcut={resetShortcut}
            onResetAllShortcuts={resetAllShortcuts}
          />
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Appearance</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="theme-light"
                    name="theme"
                    value="light"
                    checked={useTheme().theme === 'light'}
                    onChange={() => useTheme().setTheme('light')}
                    className="mr-2"
                  />
                  <label htmlFor="theme-light">Light</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="theme-dark"
                    name="theme"
                    value="dark"
                    checked={useTheme().theme === 'dark'}
                    onChange={() => useTheme().setTheme('dark')}
                    className="mr-2"
                  />
                  <label htmlFor="theme-dark">Dark</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="theme-system"
                    name="theme"
                    value="system"
                    checked={useTheme().theme === 'system'}
                    onChange={() => useTheme().setTheme('system')}
                    className="mr-2"
                  />
                  <label htmlFor="theme-system">System</label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">API Keys</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <label className="text-sm font-medium mr-2">OpenAI API Key</label>
                <HelpTooltip content="Your API key is stored locally and never sent to our servers." />
              </div>
              <input
                type="password"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your OpenAI API key"
                defaultValue={localStorage.getItem('openai-api-key') || ''}
                onChange={(e) => localStorage.setItem('openai-api-key', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Advanced Settings</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reset Onboarding</label>
              <div>
                <Button variant="outline" onClick={handleResetOnboarding}>
                  Show Welcome Screen
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  This will show the welcome screen again the next time you open the app.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Clear Local Storage</label>
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all local storage? This will reset all settings and preferences.')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  Clear All Data
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  This will clear all locally stored data, including projects, settings, and preferences.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}