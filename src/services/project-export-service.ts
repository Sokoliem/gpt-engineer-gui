import { Project } from '@/store/project-store';

export class ProjectExportService {
  /**
   * Export a project to a JSON file
   */
  static exportProject(project: Project): void {
    // Create a JSON blob with the project data
    const projectData = JSON.stringify(project, null, 2);
    const blob = new Blob([projectData], { type: 'application/json' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}-project.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  /**
   * Import a project from a JSON file
   */
  static importProject(file: File): Promise<Project> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const projectData = JSON.parse(event.target?.result as string);
          
          // Validate the project data
          if (!projectData.name || !projectData.prompt) {
            throw new Error('Invalid project file format');
          }
          
          resolve(projectData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read the file'));
      };
      
      reader.readAsText(file);
    });
  }
  
  /**
   * Export all projects to a JSON file
   */
  static exportAllProjects(projects: Project[]): void {
    const projectsData = JSON.stringify(projects, null, 2);
    const blob = new Blob([projectsData], { type: 'application/json' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gpt-engineer-projects.json';
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  /**
   * Import multiple projects from a JSON file
   */
  static importProjects(file: File): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const projectsData = JSON.parse(event.target?.result as string);
          
          // Validate the projects data
          if (!Array.isArray(projectsData)) {
            throw new Error('Invalid projects file format');
          }
          
          // Validate each project
          projectsData.forEach((project, index) => {
            if (!project.name || !project.prompt) {
              throw new Error(`Invalid project at index ${index}`);
            }
          });
          
          resolve(projectsData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read the file'));
      };
      
      reader.readAsText(file);
    });
  }
}