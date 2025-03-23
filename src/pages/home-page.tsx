import React from 'react';
import { ProjectCard } from '@/components/project/project-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useProjectStore } from '@/store/project-store';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const { projects, toggleFavorite, deleteProject } = useProjectStore();
  const navigate = useNavigate();

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button className="gap-2" onClick={handleNewProject}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-muted-foreground">No projects yet</h2>
          <p className="text-muted-foreground mt-2">Create your first project to get started</p>
          <Button className="mt-4 gap-2" onClick={handleNewProject}>
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
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
    </div>
  );
}