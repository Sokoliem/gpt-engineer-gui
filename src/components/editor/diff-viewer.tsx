import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

interface DiffViewerProps {
  originalCode: string;
  modifiedCode: string;
  language?: string;
  height?: string;
}

export function DiffViewer({
  originalCode,
  modifiedCode,
  language = 'plaintext',
  height = '100%',
}: DiffViewerProps) {
  const diffEditorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);

  useEffect(() => {
    if (diffEditorRef.current) {
      monacoEditorRef.current = monaco.editor.createDiffEditor(diffEditorRef.current, {
        automaticLayout: true,
        theme: document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs',
        readOnly: true,
        renderSideBySide: true,
        enableSplitViewResizing: true,
        originalEditable: false,
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        lineNumbers: 'on',
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
      });

      monacoEditorRef.current.setModel({
        original: monaco.editor.createModel(originalCode, language),
        modified: monaco.editor.createModel(modifiedCode, language),
      });

      // Update theme when system theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'class'
          ) {
            const isDark = document.documentElement.classList.contains('dark');
            monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs');
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      return () => {
        observer.disconnect();
        monacoEditorRef.current?.dispose();
      };
    }
  }, [originalCode, modifiedCode, language]);

  return <div ref={diffEditorRef} style={{ height, width: '100%' }} />;
}