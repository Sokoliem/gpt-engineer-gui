import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/vision/image-upload';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Save, Sliders } from 'lucide-react';
import { CodeEditor } from '@/components/editor/code-editor';
import { ModelParametersDialog } from '@/components/settings/model-parameters-dialog';
import { gptEngineerService } from '@/services/gpt-engineer-service';
import { useProjectStore } from '@/store/project-store';
import { useModelParametersStore } from '@/store/model-parameters-store';
import { logger } from '@/services/logging-service';
import { notifier } from '@/services/notification-service';

export function VisionPage() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [model, setModel] = useState('gpt-4-vision-preview');
  const [apiKey, setApiKey] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showParametersDialog, setShowParametersDialog] = useState(false);
  const { addProject } = useProjectStore();
  const { getParameters } = useModelParametersStore();
  
  const handleImagesSelected = (files: File[]) => {
    // Convert files to data URLs for preview
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
    setImageFiles([...imageFiles, ...files]);
  };
  
  const handleImageRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
  };
  
  const handleRun = async () => {
    if (!apiKey) {
      setOutput('Error: API key is required');
      notifier.error('API Key Required', 'Please enter your API key');
      return;
    }
    
    if (!prompt) {
      setOutput('Error: Prompt is required');
      notifier.error('Prompt Required', 'Please enter a prompt');
      return;
    }
    
    if (images.length === 0) {
      setOutput('Error: At least one image is required');
      notifier.error('Image Required', 'Please upload at least one image');
      return;
    }
    
    setIsRunning(true);
    setOutput('Running...');
    logger.info('Running vision project', { model, imageCount: images.length }, 'Vision');
    
    try {
      // Get model parameters
      const modelParameters = getParameters(model);
      
      // In a real implementation, we would upload the images to a server
      // and pass the URLs to the GPT Engineer service
      
      const result = await gptEngineerService.runProject({
        prompt,
        model,
        apiKey,
        useVision: true,
        imageDirectory: 'temp', // This would be the path to the uploaded images
        modelParameters,
      });
      
      if (result.success) {
        setOutput(result.output || '');
        notifier.success('Vision Project Complete', 'Code generation completed successfully');
        logger.info('Vision code generation completed', {}, 'Vision');
      } else {
        setOutput(`Error: ${result.error}`);
        notifier.error('Generation Failed', result.error || 'An unknown error occurred');
        logger.error('Vision code generation failed', { error: result.error }, 'Vision');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setOutput(`Error: ${errorMessage}`);
      notifier.error('Generation Failed', errorMessage);
      logger.error('Vision code generation failed', { error: errorMessage }, 'Vision');
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleSave = () => {
    const projectName = prompt.split('\\n')[0].slice(0, 30) || 'Vision Project';
    
    addProject({
      name: projectName,
      description: `Vision project with ${images.length} images`,
      prompt,
      isFavorite: false,
      output,
      settings: {
        model,
        apiKey,
        improveMode: false,
        useVision: true,
        imageFiles: images,
      }
    });
    
    notifier.success('Project Saved', 'Vision project has been saved successfully');
    logger.info(`Vision project "${projectName}" saved`, { imageCount: images.length }, 'Vision');
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vision Projects</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} className="gap-2" disabled={!output}>
            <Save className="h-4 w-4" />
            Save Project
          </Button>
          <Button 
            onClick={handleRun} 
            className="gap-2" 
            disabled={isRunning || !prompt || !apiKey || images.length === 0}
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Prompt</h2>
            <Textarea
              placeholder="Describe what you want to build based on the images..."
              className="min-h-[150px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Images</h2>
            <ImageUpload 
              onImagesSelected={handleImagesSelected}
              existingImages={images}
              onImageRemove={handleImageRemove}
            />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Model</label>
                <div className="flex gap-2">
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4-vision-preview">GPT-4 Vision</SelectItem>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowParametersDialog(true)}
                    title="Model Parameters"
                  >
                    <Sliders className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your API key"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Output</h2>
          <div className="border rounded-md h-[500px]">
            <CodeEditor
              value={output || "Run the project to see the output here."}
              language="plaintext"
              readOnly={true}
              height="100%"
            />
          </div>
        </div>
      </div>
      
      <ModelParametersDialog
        open={showParametersDialog}
        onOpenChange={setShowParametersDialog}
        model={model}
      />
    </div>
  );
}