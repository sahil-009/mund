import React, { useRef, useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import '../styles/Editor.css';

interface EditorProps {
  tab: {
    id: string;
    name: string;
    content: string;
    language: string;
  };
  onChange: (content: string) => void;
  onRun?: () => void;
}

export const Editor: React.FC<EditorProps> = ({ tab, onChange, onRun }) => {
  const [isRunning, setIsRunning] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    if (onRun) {
      await onRun();
    }
    setTimeout(() => setIsRunning(false), 1000);
  };

  const monacoLanguageMap: { [key: string]: string } = {
    cpp: 'cpp',
    c: 'cpp',
    java: 'java',
    javascript: 'javascript',
    typescript: 'typescript',
    html: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    markdown: 'markdown',
    text: 'plaintext',
  };

  const monacoLang = monacoLanguageMap[tab.language] || 'plaintext';

  return (
    <div className="editor">
      <div className="editor-toolbar">
        <button 
          className={`run-btn ${isRunning ? 'running' : ''}`} 
          onClick={handleRun}
          title="Run (F5)"
          disabled={isRunning}
        >
          {isRunning ? '⏱️ Running...' : '▶️ Run'}
        </button>
        <span className="language-indicator">{tab.language.toUpperCase()}</span>
      </div>
      
      <MonacoEditor
        value={tab.content}
        language={monacoLang}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />

      <div className="editor-status-bar">
        <span>Ln {tab.content.split('\n').length}, Col 1</span>
        <span>UTF-8</span>
        <span>{tab.language.toUpperCase()}</span>
      </div>
    </div>
  );
};
