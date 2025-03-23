import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Edit, Play, Trash } from 'lucide-react';

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  isFavorite?: boolean;
  onFavorite?: (id: string) => void;
  onEdit?: (id: string) => void;
  onRun?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProjectCard({
  id,
  name,
  description,
  lastModified,
  isFavorite = false,
  onFavorite,
  onEdit,
  onRun,
  onDelete,
}: ProjectCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFavorite?.(id)}
            className={isFavorite ? 'text-yellow-500' : ''}
          >
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <p className="text-xs text-muted-foreground mt-2">Last modified: {lastModified}</p>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/50 p-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit?.(id)}>
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onRun?.(id)}>
          <Play className="h-4 w-4 mr-1" /> Run
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete?.(id)}>
          <Trash className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}