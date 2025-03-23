import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, MoreVertical, Edit, Trash, Copy, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  content?: string;
}

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
  selectedFile?: FileNode;
  onFileRename?: (oldPath: string, newPath: string) => void;
  onFileDelete?: (path: string) => void;
  onFileDuplicate?: (path: string) => void;
  onFileDownload?: (file: FileNode) => void;
}

export function FileExplorer({
  files,
  onFileSelect,
  selectedFile,
  onFileRename,
  onFileDelete,
  onFileDuplicate,
  onFileDownload,
}: FileExplorerProps) {
  return (
    <div className="h-full overflow-auto p-2">
      {files.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No files generated yet
        </div>
      ) : (
        <div className="space-y-1">
          {files.map((file) => (
            <FileTreeNode 
              key={file.path} 
              file={file} 
              onFileSelect={onFileSelect}
              selectedPath={selectedFile?.path}
              level={0}
              onFileRename={onFileRename}
              onFileDelete={onFileDelete}
              onFileDuplicate={onFileDuplicate}
              onFileDownload={onFileDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FileTreeNodeProps {
  file: FileNode;
  onFileSelect: (file: FileNode) => void;
  selectedPath?: string;
  level: number;
  onFileRename?: (oldPath: string, newPath: string) => void;
  onFileDelete?: (path: string) => void;
  onFileDuplicate?: (path: string) => void;
  onFileDownload?: (file: FileNode) => void;
}

function FileTreeNode({
  file,
  onFileSelect,
  selectedPath,
  level,
  onFileRename,
  onFileDelete,
  onFileDuplicate,
  onFileDownload,
}: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const isSelected = file.path === selectedPath;
  
  const handleToggle = () => {
    if (file.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(file);
    }
  };
  
  const handleRename = () => {
    if (onFileRename && newName !== file.name) {
      const pathParts = file.path.split('/');
      pathParts.pop();
      const newPath = [...pathParts, newName].join('/');
      onFileRename(file.path, newPath);
    }
    setRenameDialogOpen(false);
  };
  
  const handleDelete = () => {
    if (onFileDelete && window.confirm(`Are you sure you want to delete ${file.name}?`)) {
      onFileDelete(file.path);
    }
  };
  
  const handleDuplicate = () => {
    if (onFileDuplicate) {
      onFileDuplicate(file.path);
    }
  };
  
  const handleDownload = () => {
    if (onFileDownload) {
      onFileDownload(file);
    }
  };
  
  return (
    <div>
      <div 
        className={cn(
          "flex items-center py-1 px-2 rounded-md text-sm cursor-pointer group",
          isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
        )}
        style={{ paddingLeft: `${level * 12 + 4}px` }}
      >
        <div className="flex-1 flex items-center" onClick={handleToggle}>
          {file.type === 'directory' ? (
            <>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              <Folder className="h-4 w-4 mr-2" />
            </>
          ) : (
            <File className="h-4 w-4 mr-2" />
          )}
          <span className="truncate">{file.name}</span>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
          
          {showActions && (
            <div className="absolute right-0 top-full mt-1 w-40 rounded-md border bg-popover shadow-md z-10">
              <div className="py-1">
                <button
                  className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => {
                    setShowActions(false);
                    setRenameDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Rename
                </button>
                <button
                  className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => {
                    setShowActions(false);
                    handleDuplicate();
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </button>
                {file.type === 'file' && (
                  <button
                    className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => {
                      setShowActions(false);
                      handleDownload();
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                )}
                <button
                  className="flex w-full items-center px-3 py-2 text-sm text-destructive hover:bg-accent"
                  onClick={() => {
                    setShowActions(false);
                    handleDelete();
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {file.type === 'directory' && isExpanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileTreeNode
              key={child.path}
              file={child}
              onFileSelect={onFileSelect}
              selectedPath={selectedPath}
              level={level + 1}
              onFileRename={onFileRename}
              onFileDelete={onFileDelete}
              onFileDuplicate={onFileDuplicate}
              onFileDownload={onFileDownload}
            />
          ))}
        </div>
      )}
      
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {file.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}