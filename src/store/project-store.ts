import { create } from 'zustand';

export interface Project {
  id: string;
  name: string;
  description: string;
  prompt: string;
  lastModified: string;
  isFavorite: boolean;
  output?: string;
  settings: {
    model: string;
    apiKey?: string;
    improveMode: boolean;
  };
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  addProject: (project: Omit<Project, 'id' | 'lastModified'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
  toggleFavorite: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [
    {
      id: '1',
      name: 'Snake Game',
      description: 'A simple snake game with MVC architecture and keyboard controls.',
      prompt: 'We are writing snake in python. MVC components split in separate files. Keyboard control.',
      lastModified: '2023-11-28',
      isFavorite: true,
      settings: {
        model: 'gpt-4',
        improveMode: false,
      },
    },
    {
      id: '2',
      name: 'Weather App',
      description: 'Weather application that fetches data from an API and displays forecasts.',
      prompt: 'Create a weather app that fetches data from OpenWeatherMap API and displays current weather and 5-day forecast.',
      lastModified: '2023-11-25',
      isFavorite: false,
      settings: {
        model: 'gpt-3.5-turbo',
        improveMode: false,
      },
    },
  ],
  currentProject: null,
  
  addProject: (project) => set((state) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      lastModified: new Date().toISOString().split('T')[0],
    };
    
    return {
      projects: [...state.projects, newProject],
      currentProject: newProject,
    };
  }),
  
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map((project) => 
      project.id === id 
        ? { 
            ...project, 
            ...updates, 
            lastModified: new Date().toISOString().split('T')[0],
          } 
        : project
    ),
    currentProject: state.currentProject?.id === id 
      ? { ...state.currentProject, ...updates } 
      : state.currentProject,
  })),
  
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((project) => project.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject,
  })),
  
  setCurrentProject: (id) => set((state) => ({
    currentProject: id ? state.projects.find((project) => project.id === id) || null : null,
  })),
  
  toggleFavorite: (id) => set((state) => ({
    projects: state.projects.map((project) => 
      project.id === id 
        ? { ...project, isFavorite: !project.isFavorite } 
        : project
    ),
    currentProject: state.currentProject?.id === id 
      ? { ...state.currentProject, isFavorite: !state.currentProject.isFavorite } 
      : state.currentProject,
  })),
}));