import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpTooltip } from '@/components/ui/help-tooltip';

interface WelcomeScreenProps {
  open: boolean;
  onClose: () => void;
  onComplete: (apiKey: string) => void;
}

export function WelcomeScreen({ open, onClose, onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState('');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(apiKey);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to GPT Engineer GUI</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Getting Started</h2>
              <p>
                GPT Engineer GUI helps you create code using AI. You can:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Create new projects from natural language descriptions</li>
                <li>Improve existing code</li>
                <li>Use vision capabilities to generate code from images</li>
                <li>Benchmark different models</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Let's set up your environment to get started.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">API Key Setup</h2>
              <p>
                GPT Engineer requires an OpenAI API key to function. Your API key is stored locally and never sent to our servers.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <label htmlFor="api-key" className="text-sm font-medium mr-2">
                    OpenAI API Key
                  </label>
                  <HelpTooltip content="You can find your API key in your OpenAI account settings." />
                </div>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Don't have an API key?{' '}
                  <a
                    href="https://platform.openai.com/account/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Get one here
                  </a>
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">You're All Set!</h2>
              <p>
                You're ready to start using GPT Engineer GUI. Here are some quick tips:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Create a new project by clicking the "New Project" button</li>
                <li>Use templates to get started quickly</li>
                <li>Save your projects to access them later</li>
                <li>Check the logs page if you encounter any issues</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Click "Finish" to start using GPT Engineer GUI.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
            <Button onClick={handleNext}>
              {step < 3 ? 'Next' : 'Finish'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}