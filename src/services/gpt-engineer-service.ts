import { pythonBridge } from './python-bridge';
import { ModelParameters } from '@/components/settings/model-parameters';

export interface RunOptions {
  prompt: string;
  model: string;
  apiKey?: string;
  improveMode?: boolean;
  useVision?: boolean;
  imageDirectory?: string;
  projectPath?: string;
  modelParameters?: ModelParameters;
}

export interface RunResult {
  success: boolean;
  output?: string;
  error?: string;
  files?: Array<{
    path: string;
    content: string;
  }>;
}

export class GptEngineerService {
  private outputBuffer: string = '';
  private errorBuffer: string = '';
  private files: Array<{ path: string; content: string }> = [];
  
  async runProject(options: RunOptions): Promise<RunResult> {
    console.log('Running GPT Engineer with options:', options);
    
    // Reset buffers
    this.outputBuffer = '';
    this.errorBuffer = '';
    this.files = [];
    
    // Check if API key is provided
    if (!options.apiKey) {
      return {
        success: false,
        error: 'API key is required',
      };
    }
    
    try {
      // In a real implementation, we would use the Python bridge
      // For now, we'll simulate the process
      
      // Set up event handlers
      const handleStdout = (data: string) => {
        this.outputBuffer += data + '\\n';
        
        // Parse file output
        if (data.startsWith('FILE:')) {
          const match = data.match(/FILE: (.+?)\\n([\s\S]+?)ENDFILE/);
          if (match) {
            const [, path, content] = match;
            this.files.push({ path, content });
          }
        }
      };
      
      const handleStderr = (data: string) => {
        this.errorBuffer += data + '\\n';
      };
      
      // Add model parameters to the output for demonstration
      if (options.modelParameters) {
        this.outputBuffer += `Using model: ${options.model}\\n`;
        this.outputBuffer += `Temperature: ${options.modelParameters.temperature}\\n`;
        this.outputBuffer += `Top P: ${options.modelParameters.topP}\\n`;
        this.outputBuffer += `Max Tokens: ${options.modelParameters.maxTokens}\\n`;
        this.outputBuffer += `System Message: ${options.modelParameters.systemMessage}\\n\\n`;
      }
      
      // Run GPT Engineer
      await pythonBridge.runGptEngineer({
        projectPath: options.projectPath || 'temp',
        prompt: options.prompt,
        model: options.model,
        apiKey: options.apiKey,
        improveMode: options.improveMode,
        useVision: options.useVision,
        imageDirectory: options.imageDirectory,
        modelParameters: options.modelParameters,
      });
      
      // Mock file generation for demonstration
      if (options.improveMode) {
        this.files = [
          {
            path: 'src/main.py',
            content: 'print("Hello, improved world!")',
          },
          {
            path: 'src/utils.py',
            content: 'def helper_function():\\n    return "I am a helper function"',
          },
        ];
      } else {
        this.files = [
          {
            path: 'src/main.py',
            content: 'print("Hello, world!")',
          },
          {
            path: 'README.md',
            content: '# Generated Project\\n\\nThis project was generated by GPT Engineer.',
          },
        ];
      }
      
      return {
        success: true,
        output: this.outputBuffer,
        files: this.files,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  
  async getModels(): Promise<string[]> {
    // In a real implementation, this would fetch available models
    return [
      'gpt-4',
      'gpt-3.5-turbo',
      'gpt-4-vision-preview',
      'claude-3-opus',
      'claude-3-sonnet',
      'local-model',
    ];
  }
  
  async checkInstallation(): Promise<boolean> {
    return pythonBridge.checkGptEngineer();
  }
  
  async getVersion(): Promise<string> {
    return pythonBridge.getGptEngineerVersion();
  }
}

export const gptEngineerService = new GptEngineerService();