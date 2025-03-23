import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Trash } from 'lucide-react';

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
}

interface PromptTemplatesProps {
  templates: PromptTemplate[];
  onSelectTemplate: (template: PromptTemplate) => void;
  onSaveTemplate: (template: PromptTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export function PromptTemplates({
  templates,
  onSelectTemplate,
  onSaveTemplate,
  onDeleteTemplate,
}: PromptTemplatesProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [categories] = useState(['General', 'Web', 'Mobile', 'Game', 'CLI', 'Other']);

  const handleOpenDialog = (template?: PromptTemplate) => {
    if (template) {
      setEditingTemplate(template);
    } else {
      setEditingTemplate({
        id: Date.now().toString(),
        name: '',
        description: '',
        content: '',
        category: 'General',
      });
    }
    setShowDialog(true);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      onSaveTemplate(editingTemplate);
      setShowDialog(false);
      setEditingTemplate(null);
    }
  };

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      onDeleteTemplate(id);
    }
  };

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    const category = template.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<string, PromptTemplate[]>);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Prompt Templates</h3>
        <Button size="sm" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-1" /> New Template
        </Button>
      </div>

      {Object.keys(templatesByCategory).length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No templates yet. Create your first template to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <div key={category}>
              <h4 className="text-sm font-medium mb-2">{category}</h4>
              <div className="grid grid-cols-1 gap-2">
                {categoryTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-md p-3 hover:bg-accent cursor-pointer group"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{template.name}</h5>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {template.description}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(template);
                          }}
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTemplate(template.id);
                          }}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTemplate?.name ? 'Edit Template' : 'New Template'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editingTemplate?.name || ''}
                onChange={(e) =>
                  setEditingTemplate(prev =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                placeholder="Template name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={editingTemplate?.category || 'General'}
                onChange={(e) =>
                  setEditingTemplate(prev =>
                    prev ? { ...prev, category: e.target.value } : null
                  )
                }
                className="w-full p-2 border rounded-md"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={editingTemplate?.description || ''}
                onChange={(e) =>
                  setEditingTemplate(prev =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                placeholder="Brief description"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={editingTemplate?.content || ''}
                onChange={(e) =>
                  setEditingTemplate(prev =>
                    prev ? { ...prev, content: e.target.value } : null
                  )
                }
                placeholder="Template content"
                className="min-h-[150px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}