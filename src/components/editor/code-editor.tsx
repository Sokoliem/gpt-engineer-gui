import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({
  value,
  language = 'plaintext',
  onChange,
  readOnly = false,
  height = '100%',
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs',
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
        scrollBeyondLastLine: false,
        readOnly,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
      });

      if (onChange) {
        monacoEditorRef.current.onDidChangeModelContent(() => {
          onChange(monacoEditorRef.current?.getValue() || '');
        });
      }

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
  }, [value, language, onChange, readOnly]);

  // Update editor content when value prop changes
  useEffect(() => {
    if (monacoEditorRef.current) {
      const currentValue = monacoEditorRef.current.getValue();
      if (value !== currentValue) {
        monacoEditorRef.current.setValue(value);
      }
    }
  }, [value]);

  return <div ref={editorRef} style={{ height, width: '100%' }} />;
}