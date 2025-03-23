import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Moon, Sun, HelpCircle } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/logo.svg" 
            alt="GPT Engineer Logo" 
            className="h-8 w-8" 
          />
          <h1 className="text-xl font-bold">GPT Engineer</h1>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  href="https://github.com/gpt-engineer-org/gpt-engineer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="ghost" 
                    size="icon"
                    aria-label="Help"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                Documentation
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/settings">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    aria-label="Settings"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}