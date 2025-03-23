import { useState } from 'react'
import { FolderOpen, File, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileExplorerProps {
  files: {
    name: string
    path: string
    content: string
    language: string
  }[]
  selectedFile: string | null
  onSelectFile: (path: string) => void
}

interface FileTreeNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children: FileTreeNode[]
  language?: string
}

export default function FileExplorer({ files, selectedFile, onSelectFile }: FileExplorerProps) {
  // Build file tree structure
  const buildFileTree = () => {
    const root: FileTreeNode = {
      name: 'root',
      path: '/',
      type: 'directory',
      children: []
    }
    
    files.forEach(file => {
      const pathParts = file.path.split('/').filter(Boolean)
      let currentNode = root
      
      // Handle directories
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i]
        let childNode = currentNode.children.find(
          child => child.name === part && child.type === 'directory'
        )
        
        if (!childNode) {
          childNode = {
            name: part,
            path: '/' + pathParts.slice(0, i + 1).join('/'),
            type: 'directory',
            children: []
          }
          currentNode.children.push(childNode)
        }
        
        currentNode = childNode
      }
      
      // Add file
      const fileName = pathParts[pathParts.length - 1]
      currentNode.children.push({
        name: fileName,
        path: file.path,
        type: 'file',
        children: [],
        language: file.language
      })
    })
    
    return root
  }
  
  const fileTree = buildFileTree()
  
  // Track expanded directories
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({
    '/': true // Root is expanded by default
  })
  
  const toggleDir = (path: string) => {
    setExpandedDirs(prev => ({
      ...prev,
      [path]: !prev[path]
    }))
  }
  
  // Render file tree node
  const renderNode = (node: FileTreeNode, depth = 0) => {
    const isExpanded = expandedDirs[node.path] || false
    
    if (node.type === 'directory') {
      return (
        <div key={node.path}>
          <div 
            className={cn(
              "flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-accent",
              depth === 0 && "sr-only" // Hide root node
            )}
            style={{ paddingLeft: `${(depth) * 12 + 4}px` }}
            onClick={() => toggleDir(node.path)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
            )}
            <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm truncate">{node.name}</span>
          </div>
          
          {isExpanded && (
            <div>
              {node.children
                .sort((a, b) => {
                  // Directories first, then files
                  if (a.type !== b.type) {
                    return a.type === 'directory' ? -1 : 1
                  }
                  // Alphabetical sort within same type
                  return a.name.localeCompare(b.name)
                })
                .map(child => renderNode(child, depth + 1))
              }
            </div>
          )}
        </div>
      )
    } else {
      return (
        <div 
          key={node.path}
          className={cn(
            "flex items-center py-1 px-2 rounded-md cursor-pointer",
            selectedFile === node.path 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-accent"
          )}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
          onClick={() => onSelectFile(node.path)}
        >
          <File className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm truncate">{node.name}</span>
        </div>
      )
    }
  }
  
  return (
    <div className="h-full overflow-auto">
      <div className="mb-2 px-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">Files</h3>
      </div>
      <div className="space-y-1">
        {renderNode(fileTree)}
      </div>
    </div>
  )
}