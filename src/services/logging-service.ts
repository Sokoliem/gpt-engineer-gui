export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  details?: any;
  source?: string;
}

export class LoggingService {
  private static instance: LoggingService;
  private logs: LogEntry[] = [];
  private listeners: ((logs: LogEntry[]) => void)[] = [];
  private maxLogs: number = 1000;

  private constructor() {}

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  public log(level: LogLevel, message: string, details?: any, source?: string): LogEntry {
    const entry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message,
      details,
      source,
    };

    this.logs.unshift(entry);
    
    // Trim logs if they exceed the maximum
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Notify listeners
    this.notifyListeners();

    return entry;
  }

  public info(message: string, details?: any, source?: string): LogEntry {
    return this.log('info', message, details, source);
  }

  public warning(message: string, details?: any, source?: string): LogEntry {
    return this.log('warning', message, details, source);
  }

  public error(message: string, details?: any, source?: string): LogEntry {
    return this.log('error', message, details, source);
  }

  public debug(message: string, details?: any, source?: string): LogEntry {
    return this.log('debug', message, details, source);
  }

  public getLogs(filter?: { level?: LogLevel; source?: string }): LogEntry[] {
    if (!filter) return [...this.logs];

    return this.logs.filter(log => {
      if (filter.level && log.level !== filter.level) return false;
      if (filter.source && log.source !== filter.source) return false;
      return true;
    });
  }

  public clearLogs(): void {
    this.logs = [];
    this.notifyListeners();
  }

  public subscribe(listener: (logs: LogEntry[]) => void): () => void {
    this.listeners.push(listener);
    
    // Immediately notify the new listener with current logs
    listener([...this.logs]);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    const logs = [...this.logs];
    this.listeners.forEach(listener => listener(logs));
  }
}

export const logger = LoggingService.getInstance();