import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Project, 
  ProjectSettings, 
  ProjectFile,
  getProjects, 
  getProject, 
  createProject as createProjectService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
  generateCode as generateCodeService,
  improveCode as improveCodeService,
  exportProject as exportProjectService
} from '@/services/gptEngineerService';
import { exportProjectAsZip } from '@/services/fileService';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  loadProjects: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  createProject: (
    name: string, 
    prompt: string, 
    description?: string,
    imageFiles?: { name: string; dataUrl: string }[]
  ) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  generateCode: (projectId: string, settings: ProjectSettings) => Promise<void>;
  improveCode: (projectId: string, prompt: string, settings: ProjectSettings) => Promise<void>;
  exportProject: (projectId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedProjects = await getProjects();
      setProjects(loadedProjects);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProject = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const project = await getProject(id);
      setCurrentProject(project);
    } catch (err) {
      setError('Failed to load project');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (
    name: string, 
    prompt: string, 
    description: string = "",
    imageFiles: { name: string; dataUrl: string }[] = []
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const newProject = await createProjectService(name, prompt, description, imageFiles);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProject = await updateProjectService(id, updates);
      setProjects(prev => 
        prev.map(project => project.id === id ? updatedProject : project)
      );
      if (currentProject?.id === id) {
        setCurrentProject(updatedProject);
      }
    } catch (err) {
      setError('Failed to update project');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteProjectService(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
    } catch (err) {
      setError('Failed to delete project');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generateCode = async (projectId: string, settings: ProjectSettings) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProject = await generateCodeService(projectId, settings);
      setProjects(prev => 
        prev.map(project => project.id === projectId ? updatedProject : project)
      );
      if (currentProject?.id === projectId) {
        setCurrentProject(updatedProject);
      }
    } catch (err) {
      setError('Failed to generate code');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const improveCode = async (projectId: string, prompt: string, settings: ProjectSettings) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProject = await improveCodeService(projectId, prompt, settings);
      setProjects(prev => 
        prev.map(project => project.id === projectId ? updatedProject : project)
      );
      if (currentProject?.id === projectId) {
        setCurrentProject(updatedProject);
      }
    } catch (err) {
      setError('Failed to improve code');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const exportProject = async (projectId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Get the project
      const project = projects.find(p => p.id === projectId) || currentProject;
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      if (!project.files || project.files.length === 0) {
        throw new Error('No files to export');
      }
      
      // Export the project as a ZIP file
      await exportProjectAsZip(project.name, project.files);
      
      // Call the service method for any additional export functionality
      await exportProjectService(projectId);
    } catch (err) {
      setError('Failed to export project');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load projects on initial render
  useEffect(() => {
    loadProjects();
  }, []);

  const value = {
    projects,
    currentProject,
    isLoading,
    error,
    loadProjects,
    loadProject,
    createProject,
    updateProject,
    deleteProject,
    generateCode,
    improveCode,
    exportProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}