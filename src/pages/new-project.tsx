import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProjects } from '@/contexts/ProjectContext'
import { useSettings } from '@/contexts/SettingsContext'

export default function NewProject() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { createProject } = useProjects()
  const { settings } = useSettings()
  
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [prompt, setPrompt] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!projectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project",
        variant: "destructive",
      })
      return
    }
    
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt describing what you want to build",
        variant: "destructive",
      })
      return
    }
    
    setIsCreating(true)
    
    try {
      const project = await createProject(projectName, prompt, description)
      
      toast({
        title: "Project created",
        description: "Your new project has been created successfully",
      })
      
      // Navigate to the project workspace
      navigate(`/project/${project.id}`)
    } catch (error) {
      toast({
        title: "Error creating project",
        description: "There was an error creating your project. Please try again.",
        variant: "destructive",
      })
      setIsCreating(false)
    }
  }
  
  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
      
      <form onSubmit={handleCreateProject}>
        <div className="space-y-6">
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium mb-1">
              Project Name
            </label>
            <input
              id="project-name"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="My Awesome Project"
              required
            />
          </div>
          
          <div>
            <label htmlFor="project-description" className="block text-sm font-medium mb-1">
              Project Description (Optional)
            </label>
            <input
              id="project-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="A brief description of your project"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Project Description
            </label>
            
            <Tabs defaultValue="prompt" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="prompt">Text Prompt</TabsTrigger>
                <TabsTrigger value="upload">Upload Files</TabsTrigger>
                <TabsTrigger value="template">Use Template</TabsTrigger>
              </TabsList>
              
              <TabsContent value="prompt" className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-64 px-3 py-2 border rounded-md bg-background font-mono text-sm"
                  placeholder="Describe what you want to build in detail. For example:&#10;&#10;Build a todo app with the following features:&#10;- Add, edit, and delete tasks&#10;- Mark tasks as complete&#10;- Filter tasks by status&#10;- Store tasks in local storage&#10;- Responsive design for mobile and desktop"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Be as specific as possible about what you want to build. Include features, technologies, and any other requirements.
                </p>
              </TabsContent>
              
              <TabsContent value="upload">
                <div className="border-2 border-dashed rounded-md p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium mb-1">
                    Drag and drop files here
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Upload images, diagrams, or text files to help describe your project
                  </p>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="template">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Web App', 'Mobile App', 'API', 'CLI Tool', 'Game', 'Data Analysis'].map((template) => (
                    <div 
                      key={template} 
                      className="border rounded-md p-4 cursor-pointer hover:border-primary"
                      onClick={() => {
                        setPrompt(`Build a ${template.toLowerCase()} with the following features:\\n- Feature 1\\n- Feature 2\\n- Feature 3`);
                      }}
                    >
                      <h3 className="font-medium">{template}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Start with a {template.toLowerCase()} template
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/')}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}