import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'

interface CodeEditorProps {
  value: string
  language: string
  onChange: (value: string) => void
}

export default function CodeEditor({ value, language, onChange }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  
  useEffect(() => {
    if (editorRef.current) {
      // Dispose previous editor instance if it exists
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose()
      }
      
      // Create new editor instance
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs',
        automaticLayout: true,
        minimap: {
          enabled: true
        },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 2,
        wordWrap: 'on',
        lineNumbers: 'on',
        glyphMargin: true,
        folding: true,
        lineDecorationsWidth: 10,
        bracketPairColorization: {
          enabled: true
        }
      })
      
      // Add change event listener
      monacoEditorRef.current.onDidChangeModelContent(() => {
        const value = monacoEditorRef.current?.getValue() || ''
        onChange(value)
      })
    }
    
    return () => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose()
      }
    }
  }, [language]) // Only recreate editor when language changes
  
  // Update editor value when prop changes
  useEffect(() => {
    if (monacoEditorRef.current && value !== monacoEditorRef.current.getValue()) {
      monacoEditorRef.current.setValue(value)
    }
  }, [value])
  
  // Update editor theme when system theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class' &&
          monacoEditorRef.current
        ) {
          const isDark = document.documentElement.classList.contains('dark')
          monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs')
        }
      })
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => {
      observer.disconnect()
    }
  }, [])
  
  return (
    <div ref={editorRef} className="h-full w-full" />
  )
}