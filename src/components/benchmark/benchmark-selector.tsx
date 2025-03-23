import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Play, Info } from 'lucide-react';

export interface Benchmark {
  id: string;
  name: string;
  description: string;
  tasks: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

const BENCHMARKS: Benchmark[] = [
  {
    id: 'apps',
    name: 'APPS',
    description: 'Automated Programming Progress Standard - A benchmark for code generation',
    tasks: 10000,
    difficulty: 'mixed',
  },
  {
    id: 'mbpp',
    name: 'MBPP',
    description: 'Mostly Basic Programming Problems - A collection of simple programming tasks',
    tasks: 974,
    difficulty: 'easy',
  },
  {
    id: 'humaneval',
    name: 'HumanEval',
    description: 'OpenAI\'s benchmark for evaluating code generation models',
    tasks: 164,
    difficulty: 'medium',
  },
];

interface BenchmarkSelectorProps {
  onBenchmarkSelect: (benchmark: Benchmark) => void;
  onRunBenchmark: (benchmark: Benchmark, options: any) => void;
}

export function BenchmarkSelector({ onBenchmarkSelect, onRunBenchmark }: BenchmarkSelectorProps) {
  const [selectedBenchmarkId, setSelectedBenchmarkId] = React.useState<string>('');
  const [taskCount, setTaskCount] = React.useState<number>(10);
  
  const selectedBenchmark = BENCHMARKS.find(b => b.id === selectedBenchmarkId);
  
  const handleBenchmarkChange = (value: string) => {
    setSelectedBenchmarkId(value);
    const benchmark = BENCHMARKS.find(b => b.id === value);
    if (benchmark) {
      onBenchmarkSelect(benchmark);
    }
  };
  
  const handleRunBenchmark = () => {
    if (selectedBenchmark) {
      onRunBenchmark(selectedBenchmark, { taskCount });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Benchmark</label>
        <Select value={selectedBenchmarkId} onValueChange={handleBenchmarkChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a benchmark" />
          </SelectTrigger>
          <SelectContent>
            {BENCHMARKS.map((benchmark) => (
              <SelectItem key={benchmark.id} value={benchmark.id}>
                {benchmark.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedBenchmark && (
        <>
          <div className="bg-muted/50 p-4 rounded-md">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">{selectedBenchmark.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedBenchmark.description}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <div>
                    <span className="font-medium">Tasks:</span> {selectedBenchmark.tasks}
                  </div>
                  <div>
                    <span className="font-medium">Difficulty:</span> {selectedBenchmark.difficulty}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Tasks</label>
            <input
              type="range"
              min="1"
              max={Math.min(100, selectedBenchmark.tasks)}
              value={taskCount}
              onChange={(e) => setTaskCount(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>{taskCount}</span>
              <span>{Math.min(100, selectedBenchmark.tasks)}</span>
            </div>
          </div>
          
          <Button onClick={handleRunBenchmark} className="w-full gap-2">
            <Play className="h-4 w-4" />
            Run Benchmark
          </Button>
        </>
      )}
    </div>
  );
}