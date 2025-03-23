import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowUp, ArrowDown } from 'lucide-react';

interface CodeSearchProps {
  onSearch: (query: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  resultsCount: number;
  currentResult: number;
}

export function CodeSearch({
  onSearch,
  onNext,
  onPrevious,
  resultsCount,
  currentResult,
}: CodeSearchProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button type="submit" size="sm" variant="outline">
          Search
        </Button>
      </form>
      
      {resultsCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {currentResult} of {resultsCount}
          </span>
          <Button size="icon" variant="ghost" onClick={onPrevious}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onNext}>
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}