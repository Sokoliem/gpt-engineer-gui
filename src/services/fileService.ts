/**
 * Service for handling file operations
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ProjectFile } from './gptEngineerService';

/**
 * Export project files as a ZIP archive
 */
export async function exportProjectAsZip(
  projectName: string,
  files: ProjectFile[]
): Promise<void> {
  try {
    const zip = new JSZip();
    
    // Add files to the ZIP archive
    files.forEach(file => {
      // Remove leading slash if present
      const filePath = file.path.startsWith('/') ? file.path.substring(1) : file.path;
      zip.file(filePath, file.content);
    });
    
    // Generate the ZIP file
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Save the ZIP file
    const sanitizedName = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    saveAs(content, `${sanitizedName}.zip`);
    
    return;
  } catch (error) {
    console.error('Failed to export project as ZIP:', error);
    throw new Error('Failed to export project as ZIP');
  }
}

/**
 * Read text file content
 */
export function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Read image file as data URL
 */
export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Determine file language based on extension
 */
export function getFileLanguage(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const languageMap: Record<string, string> = {
    // JavaScript and TypeScript
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    
    // Web
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'less': 'less',
    'json': 'json',
    
    // Python
    'py': 'python',
    
    // Java
    'java': 'java',
    
    // C/C++
    'c': 'c',
    'cpp': 'cpp',
    'h': 'cpp',
    'hpp': 'cpp',
    
    // C#
    'cs': 'csharp',
    
    // Ruby
    'rb': 'ruby',
    
    // PHP
    'php': 'php',
    
    // Go
    'go': 'go',
    
    // Rust
    'rs': 'rust',
    
    // Swift
    'swift': 'swift',
    
    // Kotlin
    'kt': 'kotlin',
    
    // Shell
    'sh': 'shell',
    'bash': 'shell',
    
    // Markdown
    'md': 'markdown',
    
    // YAML
    'yml': 'yaml',
    'yaml': 'yaml',
    
    // XML
    'xml': 'xml',
    
    // SQL
    'sql': 'sql',
  };
  
  return languageMap[extension] || 'plaintext';
}

/**
 * Parse uploaded files and convert them to ProjectFile format
 */
export async function parseUploadedFiles(
  files: File[]
): Promise<{ textFiles: ProjectFile[], imageFiles: { name: string, dataUrl: string }[] }> {
  const textFiles: ProjectFile[] = [];
  const imageFiles: { name: string, dataUrl: string }[] = [];
  
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp'];
  
  for (const file of files) {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (imageExtensions.includes(extension)) {
      // Handle image file
      try {
        const dataUrl = await readImageFile(file);
        imageFiles.push({
          name: file.name,
          dataUrl
        });
      } catch (error) {
        console.error(`Failed to read image file ${file.name}:`, error);
      }
    } else {
      // Handle text file
      try {
        const content = await readTextFile(file);
        textFiles.push({
          name: file.name,
          path: `/${file.name}`,
          content,
          language: getFileLanguage(file.name)
        });
      } catch (error) {
        console.error(`Failed to read text file ${file.name}:`, error);
      }
    }
  }
  
  return { textFiles, imageFiles };
}