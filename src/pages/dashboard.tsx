import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, FolderOpen, Clock, ArrowUpRight } from 'lucide-react'

type Project = {
  id: string
  name: string
  description: string
  lastModified: Date
  status: 'completed' | 'in-progress'
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading projects
    const timer = setTimeout(() => {
      setProjects([
        {
          id: 'project-1',
          name: 'Todo App',
          description: 'A simple todo application with React',
          lastModified: new Date(2023, 11, 15),
          status: 'completed'
        },
        {
          id: 'project-2',
          name: 'Weather Dashboard',
          description: 'Weather forecast application using OpenWeather API',
          lastModified: new Date(2023, 11, 10),
          status: 'completed'
        },
        {
          id: 'project-3',
          name: 'Blog API',
          description: 'RESTful API for a blog with authentication',
          lastModified: new Date(2023, 11, 5),
          status: 'in-progress'
        },
      ])
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {projects.length === 0 ? (
            <div className="text-center py-16 border border-dashed rounded-lg">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">No projects yet</h2>
              <p className="mt-2 text-muted-foreground">
                Create your first project to get started
              </p>
              <Link to="/new" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <Link 
                  key={project.id} 
                  to={`/project/${project.id}`}
                  className="block group"
                >
                  <div className="border rounded-lg p-6 h-full hover:border-primary transition-colors">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {project.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      Last modified {project.lastModified.toLocaleDateString()}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <span className="text-sm font-medium text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        Open Project <ArrowUpRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              
              <Link to="/new" className="block group">
                <div className="border border-dashed rounded-lg p-6 h-full flex flex-col items-center justify-center text-center hover:border-primary transition-colors">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold group-hover:text-primary transition-colors">
                    Create New Project
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Start building something new with GPT Engineer
                  </p>
                </div>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}