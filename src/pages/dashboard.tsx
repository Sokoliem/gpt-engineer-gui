import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, FolderOpen, Clock, ArrowUpRight, Trash2 } from 'lucide-react'
import { useProjects } from '@/contexts/ProjectContext'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Dashboard() {
  const { projects, isLoading, error, loadProjects, deleteProject } = useProjects()
  const { toast } = useToast()
  
  useEffect(() => {
    loadProjects()
  }, [loadProjects])
  
  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id)
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }
  
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
      
      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
          <p className="font-medium">Error loading projects</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
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
                <div key={project.id} className="group relative">
                  <Link to={`/project/${project.id}`} className="block">
                    <div className="border rounded-lg p-6 h-full hover:border-primary transition-colors">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : project.status === 'error'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {project.status === 'completed' ? 'Completed' : 
                           project.status === 'error' ? 'Error' : 'In Progress'}
                        </span>
                      </div>
                      <p className="mt-2 text-muted-foreground line-clamp-2">
                        {project.description || "No description provided"}
                      </p>
                      <div className="mt-4 flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        Last modified {new Date(project.lastModified).toLocaleDateString()}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <span className="text-sm font-medium text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          Open Project <ArrowUpRight className="ml-1 h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete project?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          project "{project.name}" and all of its files.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteProject(project.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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