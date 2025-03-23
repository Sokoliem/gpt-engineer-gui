import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';

export interface PromptHistoryEntry {
  id: string;
  content: string;
  timestamp: string;
  projectId?: string;
  projectName?: string;
}

interface PromptHistoryProps {
  history: PromptHistoryEntry[];
  onSelectPrompt: (prompt: string) => void;
  onClearHistory: () => void;
}

export function PromptHistory({
  history,
  onSelectPrompt,
  onClearHistory,
}: PromptHistoryProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Prompt History</h3>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearHistory}>
            Clear History
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No prompt history yet.
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="border rounded-md p-3 hover:bg-accent cursor-pointer group"
              onClick={() => onSelectPrompt(entry.content)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm line-clamp-2">{entry.content}</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                    {entry.projectName && (
                      <span className="ml-2">• {entry.projectName}</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPrompt(entry.content);
                  }}
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}