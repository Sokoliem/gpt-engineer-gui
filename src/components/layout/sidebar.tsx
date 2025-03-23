import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Plus, 
  Settings, 
  Code, 
  FolderOpen,
  Github
} from 'lucide-react'
import { useState, useEffect } from 'react'

type Project = {
  id: string
  name: string
  lastModified: Date
}

export default function Sidebar() {
  const location = useLocation()
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  
  useEffect(() => {
    // In a real app, this would fetch from an API or local storage
    setRecentProjects([
      { id: 'project-1', name: 'Todo App', lastModified: new Date(2023, 11, 15) },
      { id: 'project-2', name: 'Weather Dashboard', lastModified: new Date(2023, 11, 10) },
      { id: 'project-3', name: 'Blog API', lastModified: new Date(2023, 11, 5) },
    ])
  }, [])

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center">
        <Code className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-xl font-bold">GPT Engineer</h1>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-2">
          <Link
            to="/"
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md",
              location.pathname === '/' 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          
          <Link
            to="/new"
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md",
              location.pathname === '/new' 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
          
          <Link
            to="/settings"
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md",
              location.pathname === '/settings' 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </nav>
        
        {recentProjects.length > 0 && (
          <div className="mt-6">
            <h2 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recent Projects
            </h2>
            <div className="mt-2 space-y-1 px-2">
              {recentProjects.map(project => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md",
                    location.pathname === `/project/${project.id}` 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  <span className="truncate">{project.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-border">
        <a 
          href="https://github.com/gpt-engineer-org/gpt-engineer" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub Repository
        </a>
      </div>
    </div>
  )
}