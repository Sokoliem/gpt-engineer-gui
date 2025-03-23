import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function Settings() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gpt-4')
  const [useCustomPreprompts, setUseCustomPreprompts] = useState(false)
  const [prepromptPath, setPrepromptPath] = useState('')
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real app, this would save to localStorage or an API
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully",
    })
  }
  
  return (
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
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
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
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
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
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
                  checked={useCustomPreprompts}
                  onChange={(e) => setUseCustomPreprompts(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="use-custom-preprompts" className="text-sm font-medium">
                  Use custom preprompts
                </label>
              </div>
              
              {useCustomPreprompts && (
                <div>
                  <label htmlFor="preprompt-path" className="block text-sm font-medium mb-1">
                    Custom Preprompt Path
                  </label>
                  <input
                    id="preprompt-path"
                    type="text"
                    value={prepromptPath}
                    onChange={(e) => setPrepromptPath(e.target.value)}
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
                  defaultValue="system"
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
                  defaultValue="info"
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
                  defaultChecked={true}
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