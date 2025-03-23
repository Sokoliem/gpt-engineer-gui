import React, { useState } from 'react';
import { LogsViewer } from '@/components/logs/logs-viewer';
import { Button } from '@/components/ui/button';
import { logger } from '@/services/logging-service';
import { notifier } from '@/services/notification-service';

export function LogsPage() {
  const [showDetails, setShowDetails] = useState(false);

  const generateSampleLogs = () => {
    logger.info('Application started', { version: '0.1.0' }, 'App');
    logger.debug('Configuration loaded', { config: { theme: 'dark' } }, 'Config');
    logger.warning('API rate limit approaching', { remaining: 10 }, 'API');
    logger.error('Failed to connect to server', { error: 'Connection refused' }, 'Network');
    
    notifier.info('Info Notification', 'This is an information message');
    notifier.success('Success Notification', 'Operation completed successfully');
    notifier.warning('Warning Notification', 'This action might cause issues');
    notifier.error('Error Notification', 'An error occurred during the operation');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Logs</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
          <Button onClick={generateSampleLogs}>Generate Sample Logs</Button>
        </div>
      </div>

      <div className="space-y-6">
        <LogsViewer maxHeight="calc(100vh - 200px)" showDetails={showDetails} />
      </div>
    </div>
  );
}