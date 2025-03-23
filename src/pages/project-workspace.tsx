import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Save, RefreshCw, Download, FileCode, Settings as SettingsIcon } from 'lucide-react'
import CodeEditor from '@/components/code-editor'
import FileExplorer from '@/components/file-explorer'

type Project = {
  id: string
  name: string
  prompt: string
  files: {
    name: string
    path: string
    content: string
    language: string
  }[]
}

export default function ProjectWorkspace() {
  const { projectId } = useParams<{ projectId: string }>()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  useEffect(() => {
    // Simulate loading project data
    const timer = setTimeout(() => {
      // Mock project data
      const mockProject: Project = {
        id: projectId || 'unknown',
        name: 'Todo App',
        prompt: 'Build a todo app with React that allows users to add, edit, delete, and mark tasks as complete. Include local storage for persistence.',
        files: [
          {
            name: 'App.jsx',
            path: '/App.jsx',
            content: `import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };
    setTodos([...todos, newTodo]);
  };
  
  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  return (
    <div className="App">
      <h1>Todo App</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList 
        todos={todos} 
        toggleTodo={toggleTodo} 
        deleteTodo={deleteTodo} 
      />
    </div>
  );
}

export default App;`,
            language: 'javascript'
          },
          {
            name: 'TodoList.jsx',
            path: '/components/TodoList.jsx',
            content: `import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, toggleTodo, deleteTodo }) {
  if (todos.length === 0) {
    return <p>No todos yet. Add one above!</p>;
  }
  
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;`,
            language: 'javascript'
          },
          {
            name: 'TodoItem.jsx',
            path: '/components/TodoItem.jsx',
            content: `import React from 'react';

function TodoItem({ todo, toggleTodo, deleteTodo }) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />
      <span 
        style={{ 
          textDecoration: todo.completed ? 'line-through' : 'none' 
        }}
      >
        {todo.text}
      </span>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  );
}

export default TodoItem;`,
            language: 'javascript'
          },
          {
            name: 'TodoForm.jsx',
            path: '/components/TodoForm.jsx',
            content: `import React, { useState } from 'react';

function TodoForm({ addTodo }) {
  const [text, setText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo(text);
    setText('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo"
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default TodoForm;`,
            language: 'javascript'
          },
          {
            name: 'App.css',
            path: '/App.css',
            content: `.App {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.todo-form {
  display: flex;
  margin-bottom: 20px;
}

.todo-form input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
}

.todo-form button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.todo-list {
  list-style-type: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-item input {
  margin-right: 10px;
}

.todo-item span {
  flex-grow: 1;
}

.todo-item button {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`,
            language: 'css'
          }
        ]
      };
      
      setProject(mockProject);
      setSelectedFile(mockProject.files[0].path);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [projectId]);
  
  const handleGenerateCode = async () => {
    if (!project) return;
    
    setIsGenerating(true);
    toast({
      title: "Generating code",
      description: "GPT Engineer is working on your project...",
    });
    
    try {
      // Simulate code generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Code generated",
        description: "Your code has been successfully generated",
      });
    } catch (error) {
      toast({
        title: "Error generating code",
        description: "There was an error generating your code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveProject = () => {
    toast({
      title: "Project saved",
      description: "Your project has been saved successfully",
    });
  };
  
  const handleExportProject = () => {
    toast({
      title: "Project exported",
      description: "Your project has been exported successfully",
    });
  };
  
  const getSelectedFileContent = () => {
    if (!project || !selectedFile) return '';
    const file = project.files.find(f => f.path === selectedFile);
    return file ? file.content : '';
  };
  
  const getSelectedFileLanguage = () => {
    if (!project || !selectedFile) return 'javascript';
    const file = project.files.find(f => f.path === selectedFile);
    return file ? file.language : 'javascript';
  };
  
  const handleUpdateFileContent = (content: string) => {
    if (!project || !selectedFile) return;
    
    setProject({
      ...project,
      files: project.files.map(file => 
        file.path === selectedFile ? { ...file, content } : file
      )
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Project not found</h2>
          <p className="text-muted-foreground mt-2">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-sm text-muted-foreground">Project ID: {project.id}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSaveProject}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportProject}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          <Button 
            size="sm"
            onClick={handleGenerateCode}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Generate Code
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="code">
            <FileCode className="mr-2 h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="code" className="flex-1 mt-0">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full border rounded-md"
          >
            <ResizablePanel defaultSize={20} minSize={15}>
              <div className="h-full p-2">
                <FileExplorer 
                  files={project.files}
                  selectedFile={selectedFile}
                  onSelectFile={setSelectedFile}
                />
              </div>
            </ResizablePanel>
            
            <ResizablePanel defaultSize={80}>
              <div className="h-full">
                <CodeEditor
                  value={getSelectedFileContent()}
                  language={getSelectedFileLanguage()}
                  onChange={handleUpdateFileContent}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
        
        <TabsContent value="prompt" className="flex-1 mt-0">
          <div className="h-full border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Project Prompt</h3>
            <textarea
              value={project.prompt}
              onChange={(e) => setProject({...project, prompt: e.target.value})}
              className="w-full h-[calc(100%-40px)] px-3 py-2 border rounded-md bg-background font-mono text-sm"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Project Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="project-name" className="block text-sm font-medium mb-1">
                  Project Name
                </label>
                <input
                  id="project-name"
                  type="text"
                  value={project.name}
                  onChange={(e) => setProject({...project, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </div>
              
              <div>
                <label htmlFor="model" className="block text-sm font-medium mb-1">
                  AI Model
                </label>
                <select
                  id="model"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  defaultValue="gpt-4"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="anthropic-claude">Claude (Anthropic)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Advanced Options
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="use-custom-preprompts"
                      type="checkbox"
                      className="mr-2"
                    />
                    <label htmlFor="use-custom-preprompts" className="text-sm">
                      Use custom preprompts
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="improve-mode"
                      type="checkbox"
                      className="mr-2"
                    />
                    <label htmlFor="improve-mode" className="text-sm">
                      Improve mode (modify existing code)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}