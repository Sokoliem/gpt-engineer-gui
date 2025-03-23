import { gptEngineerService } from './gpt-engineer-service';
import { BenchmarkResult } from '@/components/benchmark/benchmark-results';

export interface BenchmarkTask {
  id: string;
  name: string;
  description: string;
  expectedOutput?: string;
  testCases?: Array<{
    input: string;
    output: string;
  }>;
}

export interface BenchmarkOptions {
  model: string;
  apiKey: string;
  taskCount: number;
  timeout?: number;
}

export class BenchmarkService {
  async runBenchmark(
    benchmarkId: string,
    options: BenchmarkOptions,
    onProgress?: (progress: number, result?: BenchmarkResult) => void
  ): Promise<BenchmarkResult[]> {
    // Get tasks for the benchmark
    const tasks = await this.getBenchmarkTasks(benchmarkId, options.taskCount);
    const results: BenchmarkResult[] = [];
    
    // Run each task
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const startTime = new Date();
      
      try {
        // Run the task with GPT Engineer
        const result = await gptEngineerService.runProject({
          prompt: `Solve the following programming problem:\\n\\n${task.description}`,
          model: options.model,
          apiKey: options.apiKey,
        });
        
        const endTime = new Date();
        const executionTime = endTime.getTime() - startTime.getTime();
        
        // Evaluate the result (in a real implementation, we would run tests)
        const success = result.success && result.files && result.files.length > 0;
        
        const benchmarkResult: BenchmarkResult = {
          taskId: task.id,
          taskName: task.name,
          success,
          executionTime,
          output: result.output,
          error: result.error,
        };
        
        results.push(benchmarkResult);
        
        // Report progress
        if (onProgress) {
          onProgress((i + 1) / tasks.length, benchmarkResult);
        }
      } catch (error) {
        const endTime = new Date();
        const executionTime = endTime.getTime() - startTime.getTime();
        
        const benchmarkResult: BenchmarkResult = {
          taskId: task.id,
          taskName: task.name,
          success: false,
          executionTime,
          error: error instanceof Error ? error.message : String(error),
        };
        
        results.push(benchmarkResult);
        
        // Report progress
        if (onProgress) {
          onProgress((i + 1) / tasks.length, benchmarkResult);
        }
      }
    }
    
    return results;
  }
  
  private async getBenchmarkTasks(benchmarkId: string, count: number): Promise<BenchmarkTask[]> {
    // In a real implementation, we would fetch tasks from a database or API
    // For now, we'll return mock tasks
    
    const mockTasks: BenchmarkTask[] = [];
    
    for (let i = 0; i < count; i++) {
      mockTasks.push({
        id: `${benchmarkId}-${i}`,
        name: `Task ${i + 1}`,
        description: this.getMockTaskDescription(benchmarkId, i),
      });
    }
    
    return mockTasks;
  }
  
  private getMockTaskDescription(benchmarkId: string, index: number): string {
    const tasks = {
      'apps': [
        'Write a function to find the longest common prefix string amongst an array of strings.',
        'Implement a function to check if a string is a palindrome.',
        'Write a function to convert a Roman numeral to an integer.',
        'Implement a function to find the first non-repeating character in a string.',
        'Write a function to determine if two strings are anagrams of each other.',
      ],
      'mbpp': [
        'Write a function to check if a number is even or odd.',
        'Implement a function to calculate the factorial of a number.',
        'Write a function to check if a number is prime.',
        'Implement a function to reverse a string.',
        'Write a function to find the sum of all elements in an array.',
      ],
      'humaneval': [
        'Write a function to find the maximum element in an array.',
        'Implement a function to check if a year is a leap year.',
        'Write a function to count the number of vowels in a string.',
        'Implement a function to find the GCD of two numbers.',
        'Write a function to check if a string contains only digits.',
      ],
    };
    
    const benchmarkTasks = tasks[benchmarkId as keyof typeof tasks] || tasks['mbpp'];
    return benchmarkTasks[index % benchmarkTasks.length];
  }
}

export const benchmarkService = new BenchmarkService();