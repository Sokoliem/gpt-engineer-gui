import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { KeyboardShortcut } from '@/lib/keyboard-shortcuts';
import { Trash, RefreshCw } from 'lucide-react';

interface KeyboardShortcutsSettingsProps {
  shortcuts: KeyboardShortcut[];
  onUpdateShortcut: (id: string, keys: string[]) => void;
  onResetShortcut: (id: string) => void;
  onResetAllShortcuts: () => void;
}

export function KeyboardShortcutsSettings({
  shortcuts,
  onUpdateShortcut,
  onResetShortcut,
  onResetAllShortcuts,
}: KeyboardShortcutsSettingsProps) {
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [keys, setKeys] = useState<string[]>([]);
  const recordingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!recordingId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      const newKeys: string[] = [];
      if (e.ctrlKey) newKeys.push('Ctrl');
      if (e.metaKey) newKeys.push('Cmd');
      if (e.altKey) newKeys.push('Alt');
      if (e.shiftKey) newKeys.push('Shift');
      if (
        e.key !== 'Control' &&
        e.key !== 'Meta' &&
        e.key !== 'Alt' &&
        e.key !== 'Shift'
      ) {
        newKeys.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
      }

      setKeys(newKeys);

      // Reset recording after a short delay
      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current);
      }

      recordingTimeout.current = setTimeout(() => {
        if (newKeys.length > 0) {
          onUpdateShortcut(recordingId, [newKeys.join('+')]);
        }
        setRecordingId(null);
        setKeys([]);
      }, 1000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current);
      }
    };
  }, [recordingId, onUpdateShortcut]);

  const handleStartRecording = (id: string) => {
    setRecordingId(id);
    setKeys([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Keyboard Shortcuts</h2>
        <Button variant="outline" size="sm" onClick={onResetAllShortcuts}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset All
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="py-2 px-4 text-left">Action</th>
              <th className="py-2 px-4 text-left">Shortcut</th>
              <th className="py-2 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shortcuts.map((shortcut) => (
              <tr key={shortcut.id} className="border-t">
                <td className="py-2 px-4">
                  <div className="font-medium">{shortcut.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {shortcut.description}
                  </div>
                </td>
                <td className="py-2 px-4">
                  {recordingId === shortcut.id ? (
                    <div className="text-sm font-mono bg-primary/10 px-2 py-1 rounded">
                      {keys.length > 0 ? keys.join('+') : 'Recording...'}
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm font-mono"
                      onClick={() => handleStartRecording(shortcut.id)}
                    >
                      {shortcut.keys.join(' or ')}
                    </Button>
                  )}
                </td>
                <td className="py-2 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onResetShortcut(shortcut.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}