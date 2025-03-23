import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ModelParametersSettings } from '@/components/settings/model-parameters';
import { useModelParametersStore } from '@/store/model-parameters-store';

interface ModelParametersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: string;
}

export function ModelParametersDialog({ open, onOpenChange, model }: ModelParametersDialogProps) {
  const { getParameters, updateParameters, resetParameters } = useModelParametersStore();
  const parameters = getParameters(model);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Model Parameters for {model}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <ModelParametersSettings
            model={model}
            parameters={parameters}
            onChange={(newParameters) => updateParameters(model, newParameters)}
            onReset={() => resetParameters(model)}
          />
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}