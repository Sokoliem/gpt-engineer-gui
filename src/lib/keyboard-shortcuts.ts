import { useEffect, useState } from 'react';

export interface KeyboardShortcut {
  id: string;
  name: string;
  description: string;
  defaultKeys: string[];
  keys: string[];
  action: () => void;
}

export interface KeyboardShortcutsState {
  shortcuts: KeyboardShortcut[];
  updateShortcut: (id: string, keys: string[]) => void;
  resetShortcut: (id: string) => void;
  resetAllShortcuts: () => void;
}

const DEFAULT_SHORTCUTS: Omit<KeyboardShortcut, 'action'>[] = [
  {
    id: 'run',
    name: 'Run',
    description: 'Run the current project',
    defaultKeys: ['Ctrl+Enter', 'Cmd+Enter'],
    keys: ['Ctrl+Enter', 'Cmd+Enter'],
  },
  {
    id: 'save',
    name: 'Save',
    description: 'Save the current project',
    defaultKeys: ['Ctrl+S', 'Cmd+S'],
    keys: ['Ctrl+S', 'Cmd+S'],
  },
  {
    id: 'new-project',
    name: 'New Project',
    description: 'Create a new project',
    defaultKeys: ['Ctrl+N', 'Cmd+N'],
    keys: ['Ctrl+N', 'Cmd+N'],
  },
  {
    id: 'toggle-theme',
    name: 'Toggle Theme',
    description: 'Switch between light and dark mode',
    defaultKeys: ['Ctrl+Shift+T', 'Cmd+Shift+T'],
    keys: ['Ctrl+Shift+T', 'Cmd+Shift+T'],
  },
  {
    id: 'search',
    name: 'Search',
    description: 'Search in code',
    defaultKeys: ['Ctrl+F', 'Cmd+F'],
    keys: ['Ctrl+F', 'Cmd+F'],
  },
];

export function useKeyboardShortcuts(actions: Record<string, () => void>) {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>(() => {
    const savedShortcuts = localStorage.getItem('keyboard-shortcuts');
    if (savedShortcuts) {
      try {
        const parsed = JSON.parse(savedShortcuts);
        return parsed.map((shortcut: any) => ({
          ...shortcut,
          action: actions[shortcut.id] || (() => {}),
        }));
      } catch (e) {
        console.error('Failed to parse saved shortcuts', e);
      }
    }
    
    return DEFAULT_SHORTCUTS.map(shortcut => ({
      ...shortcut,
      action: actions[shortcut.id] || (() => {}),
    }));
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      const keys: string[] = [];
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.metaKey) keys.push('Cmd');
      if (e.altKey) keys.push('Alt');
      if (e.shiftKey) keys.push('Shift');
      if (e.key !== 'Control' && e.key !== 'Meta' && e.key !== 'Alt' && e.key !== 'Shift') {
        keys.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
      }

      const keyString = keys.join('+');

      for (const shortcut of shortcuts) {
        if (shortcut.keys.some(k => k === keyString)) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);

  const updateShortcut = (id: string, keys: string[]) => {
    setShortcuts(prev => {
      const updated = prev.map(shortcut =>
        shortcut.id === id ? { ...shortcut, keys } : shortcut
      );
      localStorage.setItem(
        'keyboard-shortcuts',
        JSON.stringify(
          updated.map(({ action, ...rest }) => rest)
        )
      );
      return updated;
    });
  };

  const resetShortcut = (id: string) => {
    setShortcuts(prev => {
      const defaultShortcut = DEFAULT_SHORTCUTS.find(s => s.id === id);
      if (!defaultShortcut) return prev;

      const updated = prev.map(shortcut =>
        shortcut.id === id
          ? { ...shortcut, keys: defaultShortcut.defaultKeys }
          : shortcut
      );
      
      localStorage.setItem(
        'keyboard-shortcuts',
        JSON.stringify(
          updated.map(({ action, ...rest }) => rest)
        )
      );
      
      return updated;
    });
  };

  const resetAllShortcuts = () => {
    setShortcuts(prev => {
      const updated = prev.map(shortcut => {
        const defaultShortcut = DEFAULT_SHORTCUTS.find(s => s.id === shortcut.id);
        return {
          ...shortcut,
          keys: defaultShortcut?.defaultKeys || shortcut.defaultKeys,
        };
      });
      
      localStorage.setItem(
        'keyboard-shortcuts',
        JSON.stringify(
          updated.map(({ action, ...rest }) => rest)
        )
      );
      
      return updated;
    });
  };

  return {
    shortcuts,
    updateShortcut,
    resetShortcut,
    resetAllShortcuts,
  };
}