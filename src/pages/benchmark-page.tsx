import React, { useState } from 'react';
import { BenchmarkSelector, Benchmark } from '@/components/benchmark/benchmark-selector';
import { BenchmarkResults, BenchmarkResult } from '@/components/benchmark/benchmark-results';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Sliders } from 'lucide-react';
import { ModelParametersDialog } from '@/components/settings/model-parameters-dialog';
import { benchmarkService } from '@/services/benchmark-service';
import { useModelParametersStore } from '@/store/model-parameters-store';
import { logger } from '@/services/logging-service';
import { notifier } from '@/services/notification-service';

export function BenchmarkPage() {
  const [selectedBenchmark, setSelectedBenchmark] = useState<Benchmark | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showParametersDialog, setShowParametersDialog] = useState(false);
  const { getParameters } = useModelParametersStore();
  
  const handleBenchmarkSelect = (benchmark: Benchmark) => {
    setSelectedBenchmark(benchmark);
  };
  
  const handleRunBenchmark = async (benchmark: Benchmark, options: any) => {
    if (!apiKey) {
      notifier.error('API Key Required', 'Please enter your API key');
      return;
    }
    
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    setStartTime(new Date());
    setEndTime(null);
    
    logger.info(`Starting benchmark: ${benchmark.name}`, { model, taskCount: options.taskCount }, 'Benchmark');
    
    try {
      // Get model parameters
      const modelParameters = getParameters(model);
      
      await benchmarkService.runBenchmark(
        benchmark.id,
        {
          model,
          apiKey,
          taskCount: options.taskCount,
          modelParameters,
        },
        (progress, result) => {
          setProgress(progress * 100);
          if (result) {
            setResults(prev => [...prev, result]);
            logger.info(`Completed task: ${result.taskName}`, { 
              success: result.success, 
              executionTime: result.executionTime 
            }, 'Benchmark');
          }
        }
      );
      
      notifier.success('Benchmark Complete', `Completed ${options.taskCount} tasks for ${benchmark.name}`);
      logger.info(`Benchmark completed: ${benchmark.name}`, { 
        taskCount: options.taskCount,
        successRate: results.filter(r => r.success).length / results.length
      }, 'Benchmark');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      notifier.error('Benchmark Failed', errorMessage);
      logger.error('Benchmark failed', { error: errorMessage }, 'Benchmark');
      console.error('Benchmark error:', error);
    } finally {
      setIsRunning(false);
      setEndTime(new Date());
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Benchmark</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Key</label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Model</label>
                  <div className="flex gap-2">
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3-opus">Claude 3 Opus</option>
                      <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    </select>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setShowParametersDialog(true)}
                      title="Model Parameters"
                    >
                      <Sliders className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <BenchmarkSelector
                  onBenchmarkSelect={handleBenchmarkSelect}
                  onRunBenchmark={handleRunBenchmark}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {isRunning ? (
            <Card>
              <CardHeader>
                <CardTitle>Running Benchmark</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                  
                  {results.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Results so far</h3>
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
                                <td className="py-2 px-4">{result.executionTime}ms</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : results.length > 0 && selectedBenchmark && startTime ? (
            <BenchmarkResults
              results={results}
              benchmarkName={selectedBenchmark.name}
              startTime={startTime}
              endTime={endTime || undefined}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg p-12 text-center">
              <div>
                <h2 className="text-xl font-medium mb-2">No benchmark results yet</h2>
                <p className="text-muted-foreground">
                  Select a benchmark and run it to see results here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ModelParametersDialog
        open={showParametersDialog}
        onOpenChange={setShowParametersDialog}
        model={model}
      />
    </div>
  );
}