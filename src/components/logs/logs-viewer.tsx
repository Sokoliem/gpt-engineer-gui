import React, { useState, useEffect } from 'react';
import { LogEntry, LogLevel, logger } from '@/services/logging-service';
import { Button } from '@/components/ui/button';
import { Info, AlertTriangle, AlertCircle, Bug, Trash2, Download } from 'lucide-react';

interface LogsViewerProps {
  maxHeight?: string;
  showControls?: boolean;
  showSource?: boolean;
  showDetails?: boolean;
  filter?: {
    level?: LogLevel;
    source?: string;
  };
}

export function LogsViewer({
  maxHeight = '400px',
  showControls = true,
  showSource = true,
  showDetails = false,
  filter,
}: LogsViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<LogLevel | 'all'>('all');

  useEffect(() => {
    const unsubscribe = logger.subscribe((newLogs) => {
      setLogs(newLogs);
    });

    return unsubscribe;
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter?.level && log.level !== filter.level) return false;
    if (filter?.source && log.source !== filter.source) return false;
    if (activeFilter !== 'all' && log.level !== activeFilter) return false;
    return true;
  });

  const handleClearLogs = () => {
    logger.clearLogs();
  };

  const handleDownloadLogs = () => {
    const logData = JSON.stringify(logs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gpt-engineer-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'debug':
        return <Bug className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-2">
      {showControls && (
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('all')}
            >
              All
            </Button>
            <Button
              variant={activeFilter === 'info' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('info')}
            >
              Info
            </Button>
            <Button
              variant={activeFilter === 'warning' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('warning')}
            >
              Warning
            </Button>
            <Button
              variant={activeFilter === 'error' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('error')}
            >
              Error
            </Button>
            <Button
              variant={activeFilter === 'debug' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('debug')}
            >
              Debug
            </Button>
          </div>
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" onClick={handleDownloadLogs}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearLogs}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div
        className="border rounded-md overflow-auto bg-muted/20"
        style={{ maxHeight }}
      >
        {filteredLogs.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No logs to display</div>
        ) : (
          <div className="divide-y">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-2 hover:bg-accent">
                <div className="flex items-start">
                  <div className="mr-2 mt-0.5">{getLogIcon(log.level)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{log.message}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {showSource && log.source && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Source: {log.source}
                      </div>
                    )}
                    {showDetails && log.details && (
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto max-h-32">
                        {typeof log.details === 'string'
                          ? log.details
                          : JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}