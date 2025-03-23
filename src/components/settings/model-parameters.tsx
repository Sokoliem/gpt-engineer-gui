import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCcw } from 'lucide-react';

export interface ModelParameters {
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  maxTokens: number;
  stopSequences: string[];
  systemMessage: string;
  streaming: boolean;
}

export const DEFAULT_PARAMETERS: Record<string, ModelParameters> = {
  'gpt-4': {
    temperature: 0.7,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    maxTokens: 4096,
    stopSequences: [],
    systemMessage: 'You are a helpful AI assistant that generates code based on user requirements.',
    streaming: true,
  },
  'gpt-3.5-turbo': {
    temperature: 0.7,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    maxTokens: 2048,
    stopSequences: [],
    systemMessage: 'You are a helpful AI assistant that generates code based on user requirements.',
    streaming: true,
  },
  'gpt-4-vision-preview': {
    temperature: 0.7,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    maxTokens: 4096,
    stopSequences: [],
    systemMessage: 'You are a helpful AI assistant that generates code based on user requirements and visual inputs.',
    streaming: false,
  },
  'claude-3-opus': {
    temperature: 0.7,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    maxTokens: 4096,
    stopSequences: [],
    systemMessage: 'You are a helpful AI assistant that generates code based on user requirements.',
    streaming: true,
  },
  'claude-3-sonnet': {
    temperature: 0.7,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    maxTokens: 4096,
    stopSequences: [],
    systemMessage: 'You are a helpful AI assistant that generates code based on user requirements.',
    streaming: true,
  },
  'local-model': {
    temperature: 0.7,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    maxTokens: 2048,
    stopSequences: [],
    systemMessage: 'You are a helpful AI assistant that generates code based on user requirements.',
    streaming: true,
  },
};

interface ModelParametersProps {
  model: string;
  parameters: ModelParameters;
  onChange: (parameters: ModelParameters) => void;
  onReset: () => void;
}

export function ModelParametersSettings({ model, parameters, onChange, onReset }: ModelParametersProps) {
  const [stopSequence, setStopSequence] = useState('');

  const handleAddStopSequence = () => {
    if (stopSequence && !parameters.stopSequences.includes(stopSequence)) {
      onChange({
        ...parameters,
        stopSequences: [...parameters.stopSequences, stopSequence],
      });
      setStopSequence('');
    }
  };

  const handleRemoveStopSequence = (sequence: string) => {
    onChange({
      ...parameters,
      stopSequences: parameters.stopSequences.filter((s) => s !== sequence),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Model Parameters</h3>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="system">System Message</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Label htmlFor="temperature" className="mr-2">Temperature</Label>
                  <HelpTooltip content="Controls randomness: Lower values make output more focused and deterministic, higher values make output more random and creative." />
                </div>
                <span className="text-sm font-mono">{parameters.temperature.toFixed(2)}</span>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={2}
                step={0.01}
                value={[parameters.temperature]}
                onValueChange={(value) => onChange({ ...parameters, temperature: value[0] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Precise (0.0)</span>
                <span>Balanced (0.7)</span>
                <span>Creative (2.0)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Label htmlFor="max-tokens" className="mr-2">Max Tokens</Label>
                  <HelpTooltip content="The maximum number of tokens to generate. One token is roughly 4 characters for normal English text." />
                </div>
                <span className="text-sm font-mono">{parameters.maxTokens}</span>
              </div>
              <Slider
                id="max-tokens"
                min={256}
                max={model.includes('gpt-4') ? 8192 : 4096}
                step={256}
                value={[parameters.maxTokens]}
                onValueChange={(value) => onChange({ ...parameters, maxTokens: value[0] })}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="streaming"
                checked={parameters.streaming}
                onCheckedChange={(checked) => onChange({ ...parameters, streaming: checked })}
                disabled={model === 'gpt-4-vision-preview'}
              />
              <div className="grid gap-1.5">
                <Label htmlFor="streaming">
                  Streaming
                </Label>
                <p className="text-sm text-muted-foreground">
                  Show results as they are generated
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Label htmlFor="top-p" className="mr-2">Top P</Label>
                  <HelpTooltip content="Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered." />
                </div>
                <span className="text-sm font-mono">{parameters.topP.toFixed(2)}</span>
              </div>
              <Slider
                id="top-p"
                min={0.01}
                max={1}
                step={0.01}
                value={[parameters.topP]}
                onValueChange={(value) => onChange({ ...parameters, topP: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Label htmlFor="frequency-penalty" className="mr-2">Frequency Penalty</Label>
                  <HelpTooltip content="Reduces repetition by penalizing tokens that have already appeared in the text." />
                </div>
                <span className="text-sm font-mono">{parameters.frequencyPenalty.toFixed(2)}</span>
              </div>
              <Slider
                id="frequency-penalty"
                min={-2}
                max={2}
                step={0.01}
                value={[parameters.frequencyPenalty]}
                onValueChange={(value) => onChange({ ...parameters, frequencyPenalty: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Label htmlFor="presence-penalty" className="mr-2">Presence Penalty</Label>
                  <HelpTooltip content="Encourages the model to talk about new topics by penalizing tokens that have appeared at all." />
                </div>
                <span className="text-sm font-mono">{parameters.presencePenalty.toFixed(2)}</span>
              </div>
              <Slider
                id="presence-penalty"
                min={-2}
                max={2}
                step={0.01}
                value={[parameters.presencePenalty]}
                onValueChange={(value) => onChange({ ...parameters, presencePenalty: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label className="mr-2">Stop Sequences</Label>
                <HelpTooltip content="Sequences that will cause the model to stop generating further tokens." />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stopSequence}
                  onChange={(e) => setStopSequence(e.target.value)}
                  placeholder="Enter stop sequence"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button onClick={handleAddStopSequence} type="button">
                  Add
                </Button>
              </div>
              {parameters.stopSequences.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {parameters.stopSequences.map((sequence) => (
                    <div
                      key={sequence}
                      className="flex items-center bg-muted px-2 py-1 rounded-md text-sm"
                    >
                      <span className="font-mono">{sequence}</span>
                      <button
                        onClick={() => handleRemoveStopSequence(sequence)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="system-message" className="mr-2">System Message</Label>
              <HelpTooltip content="Instructions that set the behavior of the AI assistant." />
            </div>
            <textarea
              id="system-message"
              value={parameters.systemMessage}
              onChange={(e) => onChange({ ...parameters, systemMessage: e.target.value })}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter system message"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}