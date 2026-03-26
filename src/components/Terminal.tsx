import React, { useRef, useEffect, useState } from 'react';
import '../styles/Terminal.css';

interface TerminalProps {
  height: number;
  onOpenFile?: (name: string, path: string, content: string, language: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ height, onOpenFile }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [output, setOutput] = useState<Array<{ type: 'output' | 'input' | 'error'; text: string }>>([
    { type: 'output', text: 'FORGE Terminal - Ready' },
    { type: 'output', text: 'Commands: help, clear, exit' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Listen for terminal output from Electron
    const handleTerminalOutput = (event: any) => {
      if (event.detail) {
        setOutput((prev) => [
          ...prev,
          { type: 'output', text: event.detail },
        ]);
      }
    };

    const handleProcessExit = (event: any) => {
      setIsRunning(false);
      if (event.detail && event.detail.code === 0) {
        setOutput((prev) => [...prev, { type: 'output', text: '[Process exited successfully]' }]);
      } else {
        setOutput((prev) => [...prev, { type: 'error', text: `[Process exited with code ${event.detail?.code || 1}]` }]);
      }
    };

    window.addEventListener('terminal-output', handleTerminalOutput as EventListener);
    window.addEventListener('process-exit', handleProcessExit as EventListener);

    return () => {
      window.removeEventListener('terminal-output', handleTerminalOutput as EventListener);
      window.removeEventListener('process-exit', handleProcessExit as EventListener);
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    setOutput((prev) => [...prev, { type: 'input', text: `$ ${command}` }]);
    setIsRunning(true);

    const parts = command.trim().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    const builtinCommands: { [key: string]: () => Promise<void> } = {
      help: async () => {
        setOutput((prev) => [
          ...prev,
          { type: 'output', text: 'Available commands:' },
          { type: 'output', text: '  help        - Show this help message' },
          { type: 'output', text: '  clear       - Clear terminal' },
          { type: 'output', text: '  pwd         - Print working directory' },
          { type: 'output', text: '  exit        - Exit terminal' },
          { type: 'output', text: '  ls          - List files (system command)' },
          { type: 'output', text: '  cat         - Show file contents (system command)' },
          { type: 'output', text: 'Or run any system command directly' },
          { type: 'output', text: '' },
        ]);
      },
      clear: async () => {
        setOutput([{ type: 'output', text: '' }]);
      },
      pwd: async () => {
        try {
          const path = await (window as any).api.getAppPath();
          setOutput((prev) => [
            ...prev,
            { type: 'output', text: path },
            { type: 'output', text: '' },
          ]);
        } catch (error) {
          setOutput((prev) => [...prev, { type: 'error', text: 'Error getting path' }]);
        }
      },
      exit: async () => {
        setOutput((prev) => [...prev, { type: 'output', text: 'Goodbye!' }, { type: 'output', text: '' }]);
      },
    };

    if (builtinCommands[cmd]) {
      await builtinCommands[cmd]();
      setIsRunning(false);
    } else {
      try {
        await (window as any).api.executeCommand(cmd, args);
      } catch (error) {
        setOutput((prev) => [
          ...prev,
          {
            type: 'error',
            text: `Command not found or error: ${cmd}`,
          },
        ]);
        setIsRunning(false);
      }
    }

    setInput('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="terminal" style={{ height: `${height}px` }} ref={terminalRef}>
      <div className="terminal-header">
        <span>TERMINAL</span>
        <span className="terminal-status">{isRunning ? '● Running' : '● Ready'}</span>
      </div>
      <div className="terminal-content">
        {output.map((line, idx) => (
          <div key={idx} className={`terminal-line ${line.type === 'error' ? 'error' : line.type === 'input' ? 'input' : 'output'}`}>
            {line.text}
          </div>
        ))}
        <div className="terminal-input-line">
          <span className="terminal-prompt">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            placeholder="Type command... (type 'help' for commands)"
            disabled={isRunning}
          />
        </div>
      </div>
    </div>
  );
};
