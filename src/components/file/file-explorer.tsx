import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

export function FileExplorer({ files, onFileSelect, selectedFile }: FileExplorerProps) {
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
}

function FileTreeNode({ file, onFileSelect, selectedPath, level }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isSelected = file.path === selectedPath;
  
  const handleToggle = () => {
    if (file.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(file);
    }
  };
  
  return (
    <div>
      <div 
        className={cn(
          "flex items-center py-1 px-2 rounded-md text-sm cursor-pointer",
          isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
        )}
        style={{ paddingLeft: `${level * 12 + 4}px` }}
        onClick={handleToggle}
      >
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
      
      {file.type === 'directory' && isExpanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileTreeNode
              key={child.path}
              file={child}
              onFileSelect={onFileSelect}
              selectedPath={selectedPath}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}