import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filters: ProjectFilters) => void;
}

export interface ProjectFilters {
  favorites?: boolean;
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  models?: string[];
}

export function ProjectSearch({ onSearch, onFilter }: ProjectSearchProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [availableModels] = useState(['gpt-4', 'gpt-3.5-turbo', 'gpt-4-vision-preview']);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query, onSearch]);

  const handleFilterChange = (newFilters: Partial<ProjectFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8 pr-8"
        />
        {query && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setQuery('')}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex items-center gap-1"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-3 w-3" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>

        {Object.keys(filters).length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="bg-muted/30 rounded-md p-3 space-y-3">
          <div>
            <label className="text-xs font-medium block mb-1">Favorites</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="favorites-filter"
                checked={filters.favorites || false}
                onChange={(e) => handleFilterChange({ favorites: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="favorites-filter" className="text-sm">
                Show only favorites
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="From"
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  handleFilterChange({
                    dateRange: {
                      from: date,
                      to: filters.dateRange?.to || null,
                    },
                  });
                }}
                value={filters.dateRange?.from?.toISOString().split('T')[0] || ''}
                className="text-xs"
              />
              <Input
                type="date"
                placeholder="To"
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  handleFilterChange({
                    dateRange: {
                      from: filters.dateRange?.from || null,
                      to: date,
                    },
                  });
                }}
                value={filters.dateRange?.to?.toISOString().split('T')[0] || ''}
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Models</label>
            <div className="space-y-1">
              {availableModels.map((model) => (
                <div key={model} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`model-${model}`}
                    checked={(filters.models || []).includes(model)}
                    onChange={(e) => {
                      const currentModels = filters.models || [];
                      const newModels = e.target.checked
                        ? [...currentModels, model]
                        : currentModels.filter((m) => m !== model);
                      handleFilterChange({ models: newModels });
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`model-${model}`} className="text-sm">
                    {model}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}