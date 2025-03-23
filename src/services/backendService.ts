/**
 * Service for communicating with the GPT Engineer backend
 */

import { ProjectSettings } from './gptEngineerService';

interface GenerateCodeRequest {
  prompt: string;
  settings: ProjectSettings;
}

interface ImproveCodeRequest {
  prompt: string;
  files: { path: string; content: string }[];
  settings: ProjectSettings;
}

/**
 * Generate code using GPT Engineer
 */
export async function generateCodeWithGPTEngineer(request: GenerateCodeRequest): Promise<{ files: { path: string; content: string }[] }> {
  // In a real implementation, this would make an API call to the GPT Engineer backend
  // For now, we'll simulate the API call
  console.log('Generating code with GPT Engineer:', request);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock response
  return {
    files: [
      {
        path: '/App.jsx',
        content: `// Generated based on prompt: ${request.prompt}\\n\\nimport React from 'react';\\n\\nfunction App() {\\n  return (\\n    <div>\\n      <h1>Hello from GPT Engineer!</h1>\\n    </div>\\n  );\\n}\\n\\nexport default App;`
      },
      {
        path: '/index.js',
        content: `import React from 'react';\\nimport ReactDOM from 'react-dom';\\nimport App from './App';\\n\\nReactDOM.render(\\n  <React.StrictMode>\\n    <App />\\n  </React.StrictMode>,\\n  document.getElementById('root')\\n);`
      }
    ]
  };
}

/**
 * Improve existing code using GPT Engineer
 */
export async function improveCodeWithGPTEngineer(request: ImproveCodeRequest): Promise<{ files: { path: string; content: string }[] }> {
  // In a real implementation, this would make an API call to the GPT Engineer backend
  // For now, we'll simulate the API call
  console.log('Improving code with GPT Engineer:', request);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock response with improved files
  return {
    files: request.files.map(file => ({
      path: file.path,
      content: `${file.content}\\n\\n// Improved based on prompt: ${request.prompt}`
    }))
  };
}

/**
 * Check if the GPT Engineer backend is available
 */
export async function checkBackendStatus(): Promise<{ available: boolean; version: string }> {
  // In a real implementation, this would make an API call to check the backend status
  // For now, we'll simulate the API call
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock response
  return {
    available: true,
    version: '0.3.1'
  };
}