import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Play, Save, FileCode, Settings, FolderTree } from 'lucide-react';
import { CodeEditor } from '@/components/editor/code-editor';
import { FileExplorer } from '@/components/file/file-explorer';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '@/store/project-store';
import { gptEngineerService } from '@/services/gpt-engineer-service';

// Helper function to convert flat file list to tree structure
function buildFileTree(files: Array<{ path: string; content: string }>) {
  const root: any[] = [];
  const map: Record<string, any> = {};
  
  // First pass: create all file and directory nodes
  files.forEach(file => {
    const parts = file.path.split('/');
    let currentPath = '';
    
    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      if (!map[currentPath]) {
        const node = {
          name: part,
          path: currentPath,
          type: isLast ? 'file' : 'directory',
          children: isLast ? undefined : [],
          content: isLast ? file.content : undefined,
        };
        
        map[currentPath] = node;
        
        if (index === 0) {
          root.push(node);
        } else {
          const parentPath = parts.slice(0, index).join('/');
          map[parentPath].children?.push(node);
        }
      }
    });
  });
  
  return root;
}

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { projects, updateProject } = useProjectStore();
  
  const project = projects.find(p => p.id === id) || {
    id: 'new',
    name: 'New Project',
    description: '',
    prompt: '',
    lastModified: new Date().toISOString().split('T')[0],
    isFavorite: false,
    settings: {
      model: 'gpt-4',
      improveMode: false,
    }
  };
  
  const [projectName, setProjectName] = useState(project.name);
  const [prompt, setPrompt] = useState(project.prompt);
  const [output, setOutput] = useState(project.output || '');
  const [isRunning, setIsRunning] = useState(false);
  const [model, setModel] = useState(project.settings.model);
  const [apiKey, setApiKey] = useState(project.settings.apiKey || '');
  const [improveMode, setImproveMode] = useState(project.settings.improveMode);
  const [generatedFiles, setGeneratedFiles] = useState<Array<{ path: string; content: string }>>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  
  const fileTree = buildFileTree(generatedFiles);
  
  const handleRun = async () => {
    setIsRunning(true);
    try {
      const result = await gptEngineerService.runProject({
        prompt,
        model,
        apiKey,
        improveMode,
      });
      
      if (result.success) {
        setOutput(result.output || '');
        if (result.files) {
          setGeneratedFiles(result.files);
        }
        updateProject(project.id, {
          output: result.output,
          // In a real implementation, we would also save the generated files
        });
      } else {
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleSave = () => {
    updateProject(project.id, {
      name: projectName,
      prompt,
      settings: {
        ...project.settings,
        model,
        apiKey,
        improveMode,
      }
    });
  };

  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-lg font-bold h-8 w-64"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button 
            onClick={handleRun} 
            className="gap-2" 
            disabled={isRunning || !prompt.trim() || !apiKey}
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <div className="w-1/2 border-r p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Prompt</h2>
          <Textarea
            placeholder="Describe what you want to build..."
            className="flex-1 resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        
        <div className="w-1/2 flex flex-col">
          <Tabs defaultValue="output" className="flex-1">
            <div className="border-b px-4">
              <TabsList className="mt-2">
                <TabsTrigger value="output" className="gap-2">
                  <FileCode className="h-4 w-4" />
                  Output
                </TabsTrigger>
                <TabsTrigger value="files" className="gap-2">
                  <FolderTree className="h-4 w-4" />
                  Files
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="output" className="flex-1 p-4 overflow-auto">
              <div className="h-full border rounded-md">
                <CodeEditor
                  value={output || "Run the project to see the output here."}
                  language="plaintext"
                  readOnly={true}
                  height="100%"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="files" className="flex-1 p-0 overflow-hidden">
              <div className="flex h-full">
                <div className="w-1/3 border-r h-full overflow-auto">
                  <FileExplorer 
                    files={fileTree} 
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                  />
                </div>
                <div className="w-2/3 h-full p-4">
                  {selectedFile ? (
                    <div className="h-full border rounded-md">
                      <CodeEditor
                        value={selectedFile.content || ''}
                        language={selectedFile.name.endsWith('.py') ? 'python' : 
                                 selectedFile.name.endsWith('.js') ? 'javascript' :
                                 selectedFile.name.endsWith('.ts') ? 'typescript' :
                                 selectedFile.name.endsWith('.html') ? 'html' :
                                 selectedFile.name.endsWith('.css') ? 'css' :
                                 selectedFile.name.endsWith('.json') ? 'json' :
                                 selectedFile.name.endsWith('.md') ? 'markdown' :
                                 'plaintext'}
                        readOnly={true}
                        height="100%"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Select a file to view its content
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Model</h3>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  >
                    <option value="gpt-4">gpt-4</option>
                    <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                    <option value="gpt-4-vision-preview">gpt-4-vision-preview</option>
                  </select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">API Key</h3>
                  <Input 
                    type="password" 
                    placeholder="Enter your OpenAI API key" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Options</h3>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="improve" 
                      checked={improveMode}
                      onChange={(e) => setImproveMode(e.target.checked)}
                    />
                    <label htmlFor="improve">Improve existing code</label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}