import React, { useState, useMemo } from 'react';
import { ProjectCard } from '@/components/project/project-card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download } from 'lucide-react';
import { useProjectStore } from '@/store/project-store';
import { useNavigate } from 'react-router-dom';
import { ProjectImportDialog } from '@/components/project/project-import-dialog';
import { ProjectExportService } from '@/services/project-export-service';
import { ProjectSearch, ProjectFilters } from '@/components/project/project-search';

export function HomePage() {
  const { projects, toggleFavorite, deleteProject } = useProjectStore();
  const navigate = useNavigate();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProjectFilters>({});

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search query filter
      if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !project.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !project.prompt.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Favorites filter
      if (filters.favorites && !project.isFavorite) {
        return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const projectDate = new Date(project.lastModified);
        if (filters.dateRange.from && projectDate < filters.dateRange.from) {
          return false;
        }
        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          toDate.setDate(toDate.getDate() + 1); // Include the end date
          if (projectDate > toDate) {
            return false;
          }
        }
      }

      // Model filter
      if (filters.models && filters.models.length > 0) {
        if (!filters.models.includes(project.settings.model)) {
          return false;
        }
      }

      return true;
    });
  }, [projects, searchQuery, filters]);

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  const handleEdit = (id: string) => {
    navigate(`/project/${id}`);
  };

  const handleRun = (id: string) => {
    navigate(`/project/${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const handleNewProject = () => {
    navigate('/new');
  };
  
  const handleExportAll = () => {
    ProjectExportService.exportAllProjects(projects);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setImportDialogOpen(true)}>
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportAll} disabled={projects.length === 0}>
            <Download className="h-4 w-4" />
            Export All
          </Button>
          <Button className="gap-2" onClick={handleNewProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <ProjectSearch 
          onSearch={setSearchQuery} 
          onFilter={setFilters} 
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          {projects.length === 0 ? (
            <>
              <h2 className="text-xl font-medium text-muted-foreground">No projects yet</h2>
              <p className="text-muted-foreground mt-2">Create your first project to get started</p>
              <Button className="mt-4 gap-2" onClick={handleNewProject}>
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-medium text-muted-foreground">No matching projects</h2>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
              <Button className="mt-4" variant="outline" onClick={() => {
                setSearchQuery('');
                setFilters({});
              }}>
                Clear Filters
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              lastModified={project.lastModified}
              isFavorite={project.isFavorite}
              onFavorite={handleFavorite}
              onEdit={handleEdit}
              onRun={handleRun}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      
      <ProjectImportDialog 
        open={importDialogOpen} 
        onOpenChange={setImportDialogOpen} 
      />
    </div>
  );
}