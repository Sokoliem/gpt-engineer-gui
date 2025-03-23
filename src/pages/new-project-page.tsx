import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';
import { useProjectStore } from '@/store/project-store';
import { useNavigate } from 'react-router-dom';

const templates = [
  {
    id: 'empty',
    name: 'Empty',
    description: 'Start from scratch',
    prompt: '',
  },
  {
    id: 'snake',
    name: 'Snake Game',
    description: 'Simple game example',
    prompt: 'We are writing snake in python. MVC components split in separate files. Keyboard control.',
  },
  {
    id: 'weather',
    name: 'Weather App',
    description: 'Weather application example',
    prompt: 'Create a weather app that fetches data from OpenWeatherMap API and displays current weather and 5-day forecast.',
  },
  {
    id: 'todo',
    name: 'Todo App',
    description: 'Task management application',
    prompt: 'Create a todo list application with local storage persistence. Allow adding, completing, and deleting tasks.',
  },
];

export function NewProjectPage() {
  const [projectName, setProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const { addProject } = useProjectStore();
  const navigate = useNavigate();
  
  const handleCreateProject = () => {
    const newProject = addProject({
      name: projectName,
      description: `Project created from ${selectedTemplate.name} template`,
      prompt: selectedTemplate.prompt,
      isFavorite: false,
      settings: {
        model: 'gpt-4',
        improveMode: false,
      }
    });
    
    // Navigate to the new project
    navigate(`/project/${newProject.id}`);
  };
  
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="project-name" className="text-sm font-medium">
            Project Name
          </label>
          <Input
            id="project-name"
            placeholder="My Awesome Project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Template</label>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template) => (
              <div 
                key={template.id}
                className={`border rounded-md p-3 cursor-pointer hover:border-primary ${
                  selectedTemplate.id === template.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          className="w-full gap-2" 
          onClick={handleCreateProject}
          disabled={!projectName}
        >
          Create Project
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}