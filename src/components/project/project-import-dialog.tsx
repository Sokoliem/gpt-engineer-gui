import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProjectExportService } from '@/services/project-export-service';
import { useProjectStore } from '@/store/project-store';
import { Upload } from 'lucide-react';

interface ProjectImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectImportDialog({ open, onOpenChange }: ProjectImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addProject } = useProjectStore();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };
  
  const handleImport = async () => {
    if (!file) {
      setError('Please select a file to import');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const project = await ProjectExportService.importProject(file);
      
      // Generate a new ID for the imported project
      const { id, ...projectWithoutId } = project;
      
      addProject(projectWithoutId);
      onOpenChange(false);
    } catch (err) {
      setError(`Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Project</DialogTitle>
          <DialogDescription>
            Import a previously exported GPT Engineer project file.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="border-2 border-dashed rounded-md p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm mb-2">Drag and drop your project file here, or click to browse</p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
              id="project-import"
            />
            <label htmlFor="project-import">
              <Button variant="outline" className="mt-2" as="span">
                Select File
              </Button>
            </label>
            {file && (
              <p className="text-sm mt-2 text-muted-foreground">
                Selected: {file.name}
              </p>
            )}
          </div>
          
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || isLoading}>
            {isLoading ? 'Importing...' : 'Import Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}