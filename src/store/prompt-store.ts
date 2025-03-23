import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PromptTemplate } from '@/components/prompt/prompt-templates';
import { PromptHistoryEntry } from '@/components/prompt/prompt-history';

interface PromptState {
  templates: PromptTemplate[];
  history: PromptHistoryEntry[];
  addTemplate: (template: PromptTemplate) => void;
  updateTemplate: (template: PromptTemplate) => void;
  deleteTemplate: (id: string) => void;
  addHistoryEntry: (entry: Omit<PromptHistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

export const usePromptStore = create<PromptState>()(
  persist(
    (set) => ({
      templates: [
        {
          id: '1',
          name: 'Web App',
          description: 'Create a simple web application',
          content: 'Create a web application with the following features:\\n\\n- User authentication\\n- Dashboard\\n- CRUD operations\\n\\nUse React for the frontend and Node.js for the backend.',
          category: 'Web',
        },
        {
          id: '2',
          name: 'CLI Tool',
          description: 'Create a command-line tool',
          content: 'Create a command-line tool that can:\\n\\n- Parse arguments\\n- Process files\\n- Output results\\n\\nUse Python and make it cross-platform compatible.',
          category: 'CLI',
        },
        {
          id: '3',
          name: 'Game',
          description: 'Create a simple game',
          content: 'Create a simple game with the following features:\\n\\n- Player movement\\n- Enemies\\n- Score tracking\\n\\nUse Python with Pygame.',
          category: 'Game',
        },
      ],
      history: [],
      
      addTemplate: (template) => set((state) => ({
        templates: [...state.templates, template],
      })),
      
      updateTemplate: (template) => set((state) => ({
        templates: state.templates.map((t) =>
          t.id === template.id ? template : t
        ),
      })),
      
      deleteTemplate: (id) => set((state) => ({
        templates: state.templates.filter((t) => t.id !== id),
      })),
      
      addHistoryEntry: (entry) => set((state) => {
        const newEntry: PromptHistoryEntry = {
          ...entry,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        };
        
        // Keep only the last 50 entries
        const history = [newEntry, ...state.history];
        if (history.length > 50) {
          history.pop();
        }
        
        return { history };
      }),
      
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'gpt-engineer-prompts',
    }
  )
);