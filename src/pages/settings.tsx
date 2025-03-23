import { useSettings } from '@/contexts/SettingsContext'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const { toast } = useToast()
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully",
    })
  }
  
  return (
    <div className="container mx-auto max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button 
          variant="outline" 
          onClick={() => {
            resetSettings()
            toast({
              title: "Settings reset",
              description: "Your settings have been reset to defaults",
            })
          }}
        >
          Reset to Defaults
        </Button>
      </div>
      
      <form onSubmit={handleSaveSettings} className="space-y-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="api-key" className="block text-sm font-medium mb-1">
                  OpenAI API Key
                </label>
                <input
                  id="api-key"
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => updateSettings({ apiKey: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  placeholder="sk-..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
              
              <div>
                <label htmlFor="model" className="block text-sm font-medium mb-1">
                  Default AI Model
                </label>
                <select
                  id="model"
                  value={settings.defaultModel}
                  onChange={(e) => updateSettings({ defaultModel: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="anthropic-claude">Claude (Anthropic)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Customization</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="use-custom-preprompts"
                  type="checkbox"
                  checked={settings.useCustomPreprompts}
                  onChange={(e) => updateSettings({ useCustomPreprompts: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="use-custom-preprompts" className="text-sm font-medium">
                  Use custom preprompts
                </label>
              </div>
              
              {settings.useCustomPreprompts && (
                <div>
                  <label htmlFor="preprompt-path" className="block text-sm font-medium mb-1">
                    Custom Preprompt Path
                  </label>
                  <input
                    id="preprompt-path"
                    type="text"
                    value={settings.prepromptPath}
                    onChange={(e) => updateSettings({ prepromptPath: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="/path/to/preprompts"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="theme" className="block text-sm font-medium mb-1">
                  Theme
                </label>
                <select
                  id="theme"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={settings.theme}
                  onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'system' })}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Advanced</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="log-level" className="block text-sm font-medium mb-1">
                  Log Level
                </label>
                <select
                  id="log-level"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={settings.logLevel}
                  onChange={(e) => updateSettings({ logLevel: e.target.value as 'debug' | 'info' | 'warning' | 'error' })}
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  id="telemetry"
                  type="checkbox"
                  checked={settings.allowTelemetry}
                  onChange={(e) => updateSettings({ allowTelemetry: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="telemetry" className="text-sm font-medium">
                  Allow anonymous usage data collection
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}