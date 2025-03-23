import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.svg" 
            alt="GPT Engineer Logo" 
            className="h-8 w-8" 
          />
          <h1 className="text-xl font-bold">GPT Engineer</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}