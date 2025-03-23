/**
 * Service for interacting with GPT Engineer core functionality
 */

import { toast } from "@/components/ui/use-toast";

export interface Project {
  id: string;
  name: string;
  description: string;
  prompt: string;
  lastModified: Date;
  status: 'completed' | 'in-progress' | 'error';
  files: ProjectFile[];
}

export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

export interface ProjectSettings {
  model: string;
  useCustomPreprompts: boolean;
  improveMode: boolean;
  temperature: number;
  maxTokens?: number;
}

// Mock storage for projects (in a real app, this would be persistent)
const projectsStore: Record<string, Project> = {};

/**
 * Get all projects
 */
export async function getProjects(): Promise<Project[]> {
  try {
    // In a real implementation, this would fetch from an API or local storage
    return Object.values(projectsStore).sort(
      (a, b) => b.lastModified.getTime() - a.lastModified.getTime()
    );
  } catch (error) {
    console.error("Failed to get projects:", error);
    toast({
      title: "Error loading projects",
      description: "Failed to load your projects. Please try again.",
      variant: "destructive",
    });
    return [];
  }
}

/**
 * Get a project by ID
 */
export async function getProject(id: string): Promise<Project | null> {
  try {
    // In a real implementation, this would fetch from an API or local storage
    return projectsStore[id] || null;
  } catch (error) {
    console.error(`Failed to get project ${id}:`, error);
    toast({
      title: "Error loading project",
      description: "Failed to load the project. Please try again.",
      variant: "destructive",
    });
    return null;
  }
}

/**
 * Create a new project
 */
export async function createProject(
  name: string,
  prompt: string,
  description: string = ""
): Promise<Project> {
  try {
    // Generate a unique ID
    const id = `project-${Date.now()}`;
    
    // Create a new project
    const project: Project = {
      id,
      name,
      description,
      prompt,
      lastModified: new Date(),
      status: 'in-progress',
      files: [],
    };
    
    // Store the project
    projectsStore[id] = project;
    
    return project;
  } catch (error) {
    console.error("Failed to create project:", error);
    toast({
      title: "Error creating project",
      description: "Failed to create your project. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}

/**
 * Update a project
 */
export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<Project> {
  try {
    const project = projectsStore[id];
    if (!project) {
      throw new Error(`Project ${id} not found`);
    }
    
    // Update the project
    const updatedProject = {
      ...project,
      ...updates,
      lastModified: new Date(),
    };
    
    // Store the updated project
    projectsStore[id] = updatedProject;
    
    return updatedProject;
  } catch (error) {
    console.error(`Failed to update project ${id}:`, error);
    toast({
      title: "Error updating project",
      description: "Failed to update your project. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<void> {
  try {
    delete projectsStore[id];
  } catch (error) {
    console.error(`Failed to delete project ${id}:`, error);
    toast({
      title: "Error deleting project",
      description: "Failed to delete your project. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}

/**
 * Generate code for a project
 */
export async function generateCode(
  projectId: string,
  settings: ProjectSettings
): Promise<Project> {
  try {
    const project = projectsStore[projectId];
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }
    
    // Update project status
    projectsStore[projectId] = {
      ...project,
      status: 'in-progress',
      lastModified: new Date(),
    };
    
    // In a real implementation, this would call the GPT Engineer core
    // For now, we'll simulate the code generation with a timeout
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate mock files based on the project prompt
    const files = generateMockFiles(project.prompt);
    
    // Update the project with the generated files
    const updatedProject = {
      ...project,
      status: 'completed',
      files,
      lastModified: new Date(),
    };
    
    // Store the updated project
    projectsStore[projectId] = updatedProject;
    
    return updatedProject;
  } catch (error) {
    console.error(`Failed to generate code for project ${projectId}:`, error);
    
    // Update project status to error
    if (projectsStore[projectId]) {
      projectsStore[projectId] = {
        ...projectsStore[projectId],
        status: 'error',
        lastModified: new Date(),
      };
    }
    
    toast({
      title: "Error generating code",
      description: "Failed to generate code for your project. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}

/**
 * Improve code for a project
 */
export async function improveCode(
  projectId: string,
  prompt: string,
  settings: ProjectSettings
): Promise<Project> {
  try {
    const project = projectsStore[projectId];
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }
    
    // Update project status
    projectsStore[projectId] = {
      ...project,
      status: 'in-progress',
      lastModified: new Date(),
    };
    
    // In a real implementation, this would call the GPT Engineer core
    // For now, we'll simulate the code improvement with a timeout
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update some of the existing files to simulate improvement
    const improvedFiles = project.files.map(file => ({
      ...file,
      content: file.content + `\\n\\n// Improved based on prompt: ${prompt}\\n`,
    }));
    
    // Update the project with the improved files
    const updatedProject = {
      ...project,
      status: 'completed',
      files: improvedFiles,
      lastModified: new Date(),
    };
    
    // Store the updated project
    projectsStore[projectId] = updatedProject;
    
    return updatedProject;
  } catch (error) {
    console.error(`Failed to improve code for project ${projectId}:`, error);
    
    // Update project status to error
    if (projectsStore[projectId]) {
      projectsStore[projectId] = {
        ...projectsStore[projectId],
        status: 'error',
        lastModified: new Date(),
      };
    }
    
    toast({
      title: "Error improving code",
      description: "Failed to improve code for your project. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}

/**
 * Export project as a ZIP file
 */
export async function exportProject(projectId: string): Promise<void> {
  try {
    // In a real implementation, this would generate a ZIP file
    // and trigger a download
    toast({
      title: "Project exported",
      description: "Your project has been exported successfully.",
    });
  } catch (error) {
    console.error(`Failed to export project ${projectId}:`, error);
    toast({
      title: "Error exporting project",
      description: "Failed to export your project. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}

/**
 * Generate mock files based on a prompt
 * This is just for demonstration purposes
 */
function generateMockFiles(prompt: string): ProjectFile[] {
  // Extract keywords from the prompt to determine what kind of project to generate
  const keywords = prompt.toLowerCase();
  
  if (keywords.includes("todo") || keywords.includes("task")) {
    // Generate a todo app
    return [
      {
        name: "App.jsx",
        path: "/App.jsx",
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
        language: "javascript"
      },
      {
        name: "TodoList.jsx",
        path: "/components/TodoList.jsx",
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
        language: "javascript"
      },
      {
        name: "TodoItem.jsx",
        path: "/components/TodoItem.jsx",
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
        language: "javascript"
      },
      {
        name: "TodoForm.jsx",
        path: "/components/TodoForm.jsx",
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
        language: "javascript"
      },
      {
        name: "App.css",
        path: "/App.css",
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
        language: "css"
      }
    ];
  } else if (keywords.includes("weather") || keywords.includes("forecast")) {
    // Generate a weather app
    return [
      {
        name: "App.jsx",
        path: "/App.jsx",
        content: `import React, { useState } from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, you would use an actual API key
      const apiKey = 'YOUR_API_KEY';
      const response = await fetch(
        \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${apiKey}&units=metric\`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="App">
      <h1>Weather App</h1>
      <SearchBar onSearch={fetchWeather} />
      
      {loading && <p className="loading">Loading weather data...</p>}
      {error && <p className="error">{error}</p>}
      {weatherData && <WeatherDisplay data={weatherData} />}
    </div>
  );
}

export default App;`,
        language: "javascript"
      },
      {
        name: "SearchBar.jsx",
        path: "/components/SearchBar.jsx",
        content: `import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    onSearch(city);
  };
  
  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;`,
        language: "javascript"
      },
      {
        name: "WeatherDisplay.jsx",
        path: "/components/WeatherDisplay.jsx",
        content: `import React from 'react';

function WeatherDisplay({ data }) {
  const { name, main, weather, wind } = data;
  
  return (
    <div className="weather-display">
      <h2>{name}</h2>
      
      <div className="weather-main">
        <img
          src={\`http://openweathermap.org/img/wn/\${weather[0].icon}@2x.png\`}
          alt={weather[0].description}
        />
        <p className="temperature">{Math.round(main.temp)}°C</p>
        <p className="description">{weather[0].description}</p>
      </div>
      
      <div className="weather-details">
        <div className="detail">
          <span>Feels like</span>
          <span>{Math.round(main.feels_like)}°C</span>
        </div>
        <div className="detail">
          <span>Humidity</span>
          <span>{main.humidity}%</span>
        </div>
        <div className="detail">
          <span>Wind</span>
          <span>{wind.speed} m/s</span>
        </div>
        <div className="detail">
          <span>Pressure</span>
          <span>{main.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherDisplay;`,
        language: "javascript"
      },
      {
        name: "App.css",
        path: "/App.css",
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

.search-bar {
  display: flex;
  margin-bottom: 20px;
}

.search-bar input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
}

.search-bar button {
  padding: 10px 15px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

.error {
  color: #f44336;
}

.weather-display {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.weather-display h2 {
  margin-top: 0;
  text-align: center;
}

.weather-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.temperature {
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
}

.description {
  text-transform: capitalize;
  margin: 0;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.detail {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background-color: #fff;
  border-radius: 4px;
}`,
        language: "css"
      }
    ];
  } else {
    // Default to a simple React app
    return [
      {
        name: "App.jsx",
        path: "/App.jsx",
        content: `import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React App</h1>
        <p>
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            This app was generated by GPT Engineer based on your prompt.
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;`,
        language: "javascript"
      },
      {
        name: "App.css",
        path: "/App.css",
        content: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.card {
  padding: 2em;
}

button {
  font-size: 1em;
  padding: 1em 2em;
  border: none;
  border-radius: 4px;
  background-color: #61dafb;
  cursor: pointer;
  margin: 1em;
}

button:hover {
  background-color: #4fa8c9;
}`,
        language: "css"
      },
      {
        name: "index.js",
        path: "/index.js",
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        language: "javascript"
      },
      {
        name: "index.css",
        path: "/index.css",
        content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,
        language: "css"
      }
    ];
  }
}