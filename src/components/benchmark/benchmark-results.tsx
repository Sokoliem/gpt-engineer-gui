import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface BenchmarkResult {
  taskId: string;
  taskName: string;
  success: boolean;
  executionTime: number;
  output?: string;
  error?: string;
}

interface BenchmarkResultsProps {
  results: BenchmarkResult[];
  benchmarkName: string;
  startTime: Date;
  endTime?: Date;
}

export function BenchmarkResults({ results, benchmarkName, startTime, endTime }: BenchmarkResultsProps) {
  const successCount = results.filter(r => r.success).length;
  const successRate = results.length > 0 ? (successCount / results.length) * 100 : 0;
  const averageTime = results.length > 0 
    ? results.reduce((sum, r) => sum + r.executionTime, 0) / results.length 
    : 0;
  
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };
  
  const totalDuration = endTime 
    ? endTime.getTime() - startTime.getTime() 
    : new Date().getTime() - startTime.getTime();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{benchmarkName} Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold">{results.length}</div>
              <div className="text-sm text-muted-foreground">Tasks</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold">{formatDuration(averageTime)}</div>
              <div className="text-sm text-muted-foreground">Avg. Time</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold">{formatDuration(totalDuration)}</div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Task Results</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="py-2 px-4 text-left">Task</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.taskId} className="border-t">
                  <td className="py-2 px-4">{result.taskName}</td>
                  <td className="py-2 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.success ? 'Success' : 'Failed'}
                    </span>
                  </td>
                  <td className="py-2 px-4">{formatDuration(result.executionTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}