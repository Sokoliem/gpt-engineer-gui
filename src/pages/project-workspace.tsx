import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Save, RefreshCw, Download, FileCode, Settings as SettingsIcon, Image } from 'lucide-react'
import CodeEditor from '@/components/code-editor'
import FileExplorer from '@/components/file-explorer'
import { useProjects } from '@/contexts/ProjectContext'
import { useSettings } from '@/contexts/SettingsContext'

export default function ProjectWorkspace() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { currentProject, isLoading, error, loadProject, updateProject, generateCode, exportProject } = useProjects()
  const { settings } = useSettings()
  
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [projectSettings, setProjectSettings] = useState({
    model: settings.defaultModel,
    useCustomPreprompts: settings.useCustomPreprompts,
    improveMode: false,
    temperature: 0.7,
  })
  
  useEffect(() => {
    if (projectId) {
      loadProject(projectId)
    }
  }, [projectId, loadProject])
  
  useEffect(() => {
    // When project loads, select the first file if available
    if (currentProject?.files?.length > 0 && !selectedFile) {
      setSelectedFile(currentProject.files[0].path)
    }
  }, [currentProject, selectedFile])
  
  const handleGenerateCode = async () => {
    if (!currentProject) return
    
    setIsGenerating(true)
    toast({
      title: "Generating code",
      description: "GPT Engineer is working on your project...",
    })
    
    try {
      await generateCode(currentProject.id, projectSettings)
      
      toast({
        title: "Code generated",
        description: "Your code has been successfully generated",
      })
    } catch (error) {
      // Error is handled in the context
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleSaveProject = async () => {
    if (!currentProject) return
    
    try {
      await updateProject(currentProject.id, {
        prompt: currentProject.prompt,
        name: currentProject.name,
        description: currentProject.description
      })
      
      toast({
        title: "Project saved",
        description: "Your project has been saved successfully",
      })
    } catch (error) {
      // Error is handled in the context
    }
  }
  
  const handleExportProject = async () => {
    if (!currentProject) return
    
    try {
      await exportProject(currentProject.id)
    } catch (error) {
      // Error is handled in the context
    }
  }
  
  const getSelectedFileContent = () => {
    if (!currentProject || !selectedFile) return ''
    const file = currentProject.files.find(f => f.path === selectedFile)
    return file ? file.content : ''
  }
  
  const getSelectedFileLanguage = () => {
    if (!currentProject || !selectedFile) return 'javascript'
    const file = currentProject.files.find(f => f.path === selectedFile)
    return file ? file.language : 'javascript'
  }
  
  const handleUpdateFileContent = (content: string) => {
    if (!currentProject || !selectedFile) return
    
    updateProject(currentProject.id, {
      files: currentProject.files.map(file => 
        file.path === selectedFile ? { ...file, content } : file
      )
    })
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Error loading project</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }
  
  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Project not found</h2>
          <p className="text-muted-foreground mt-2">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{currentProject.name}</h1>
          <p className="text-sm text-muted-foreground">
            {currentProject.description || "No description provided"}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSaveProject}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportProject}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          <Button 
            size="sm"
            onClick={handleGenerateCode}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Generate Code
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="code">
            <FileCode className="mr-2 h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
          {currentProject.imageFiles && currentProject.imageFiles.length > 0 && (
            <TabsTrigger value="images">
              <Image className="mr-2 h-4 w-4" />
              Images
            </TabsTrigger>
          )}
          <TabsTrigger value="settings">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="code" className="flex-1 mt-0">
          {currentProject.files.length === 0 ? (
            <div className="flex items-center justify-center h-full border rounded-md">
              <div className="text-center p-6">
                <FileCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No code generated yet</h3>
                <p className="text-muted-foreground mb-4">
                  Click the "Generate Code" button to create your project files.
                </p>
                <Button onClick={handleGenerateCode} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Generate Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <ResizablePanelGroup
              direction="horizontal"
              className="h-full border rounded-md"
            >
              <ResizablePanel defaultSize={20} minSize={15}>
                <div className="h-full p-2">
                  <FileExplorer 
                    files={currentProject.files}
                    selectedFile={selectedFile}
                    onSelectFile={setSelectedFile}
                  />
                </div>
              </ResizablePanel>
              
              <ResizablePanel defaultSize={80}>
                <div className="h-full">
                  <CodeEditor
                    value={getSelectedFileContent()}
                    language={getSelectedFileLanguage()}
                    onChange={handleUpdateFileContent}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </TabsContent>
        
        <TabsContent value="prompt" className="flex-1 mt-0">
          <div className="h-full border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Project Prompt</h3>
            <textarea
              value={currentProject.prompt}
              onChange={(e) => updateProject(currentProject.id, { prompt: e.target.value })}
              className="w-full h-[calc(100%-40px)] px-3 py-2 border rounded-md bg-background font-mono text-sm"
            />
          </div>
        </TabsContent>
        
        {currentProject.imageFiles && currentProject.imageFiles.length > 0 && (
          <TabsContent value="images" className="flex-1 mt-0">
            <div className="h-full border rounded-md p-4 overflow-auto">
              <h3 className="text-lg font-medium mb-4">Reference Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentProject.imageFiles.map((image, index) => (
                  <div key={index} className="border rounded-md overflow-hidden">
                    <img 
                      src={image.dataUrl} 
                      alt={image.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-2 border-t">
                      <p className="text-sm font-medium truncate">{image.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="settings" className="mt-0">
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Project Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="project-name" className="block text-sm font-medium mb-1">
                  Project Name
                </label>
                <input
                  id="project-name"
                  type="text"
                  value={currentProject.name}
                  onChange={(e) => updateProject(currentProject.id, { name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </div>
              
              <div>
                <label htmlFor="project-description" className="block text-sm font-medium mb-1">
                  Project Description
                </label>
                <input
                  id="project-description"
                  type="text"
                  value={currentProject.description || ""}
                  onChange={(e) => updateProject(currentProject.id, { description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  placeholder="A brief description of your project"
                />
              </div>
              
              <div>
                <label htmlFor="model" className="block text-sm font-medium mb-1">
                  AI Model
                </label>
                <select
                  id="model"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={projectSettings.model}
                  onChange={(e) => setProjectSettings({...projectSettings, model: e.target.value})}
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="anthropic-claude">Claude (Anthropic)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium mb-1">
                  Temperature: {projectSettings.temperature}
                </label>
                <input
                  id="temperature"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={projectSettings.temperature}
                  onChange={(e) => setProjectSettings({...projectSettings, temperature: parseFloat(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>More Deterministic</span>
                  <span>More Creative</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Advanced Options
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="use-custom-preprompts"
                      type="checkbox"
                      className="mr-2"
                      checked={projectSettings.useCustomPreprompts}
                      onChange={(e) => setProjectSettings({...projectSettings, useCustomPreprompts: e.target.checked})}
                    />
                    <label htmlFor="use-custom-preprompts" className="text-sm">
                      Use custom preprompts
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="improve-mode"
                      type="checkbox"
                      className="mr-2"
                      checked={projectSettings.improveMode}
                      onChange={(e) => setProjectSettings({...projectSettings, improveMode: e.target.checked})}
                    />
                    <label htmlFor="improve-mode" className="text-sm">
                      Improve mode (modify existing code)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}