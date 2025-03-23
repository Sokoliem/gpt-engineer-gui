import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, History, Star, Image, BarChart2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNewProject = () => {
    navigate('/new');
  };
  
  return (
    <div className="w-64 border-r h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-4">
        <Button className="w-full justify-start gap-2" onClick={handleNewProject}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
      <nav className="flex-1 px-2 py-2 space-y-1">
        <Link 
          to="/" 
          className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md",
            location.pathname === '/' 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-accent"
          )}
        >
          <FolderOpen className="mr-3 h-4 w-4" />
          Projects
        </Link>
        <Link 
          to="/recent" 
          className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md",
            location.pathname === '/recent' 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-accent"
          )}
        >
          <History className="mr-3 h-4 w-4" />
          Recent
        </Link>
        <Link 
          to="/favorites" 
          className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md",
            location.pathname === '/favorites' 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-accent"
          )}
        >
          <Star className="mr-3 h-4 w-4" />
          Favorites
        </Link>
        <Link 
          to="/vision" 
          className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md",
            location.pathname === '/vision' 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-accent"
          )}
        >
          <Image className="mr-3 h-4 w-4" />
          Vision
        </Link>
        <Link 
          to="/benchmark" 
          className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md",
            location.pathname === '/benchmark' 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-accent"
          )}
        >
          <BarChart2 className="mr-3 h-4 w-4" />
          Benchmark
        </Link>
      </nav>
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground">
          <p>GPT Engineer v0.1.0</p>
          <p className="mt-1">© 2023 GPT Engineer</p>
        </div>
      </div>
    </div>
  );
}