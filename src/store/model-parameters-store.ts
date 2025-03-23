import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ModelParameters, DEFAULT_PARAMETERS } from '@/components/settings/model-parameters';

interface ModelParametersState {
  parameters: Record<string, ModelParameters>;
  getParameters: (model: string) => ModelParameters;
  updateParameters: (model: string, parameters: ModelParameters) => void;
  resetParameters: (model: string) => void;
  resetAllParameters: () => void;
}

export const useModelParametersStore = create<ModelParametersState>()(
  persist(
    (set, get) => ({
      parameters: { ...DEFAULT_PARAMETERS },
      
      getParameters: (model: string) => {
        const { parameters } = get();
        return parameters[model] || DEFAULT_PARAMETERS[model] || DEFAULT_PARAMETERS['gpt-4'];
      },
      
      updateParameters: (model: string, parameters: ModelParameters) => {
        set((state) => ({
          parameters: {
            ...state.parameters,
            [model]: parameters,
          },
        }));
      },
      
      resetParameters: (model: string) => {
        set((state) => ({
          parameters: {
            ...state.parameters,
            [model]: DEFAULT_PARAMETERS[model] || DEFAULT_PARAMETERS['gpt-4'],
          },
        }));
      },
      
      resetAllParameters: () => {
        set({ parameters: { ...DEFAULT_PARAMETERS } });
      },
    }),
    {
      name: 'gpt-engineer-model-parameters',
    }
  )
);