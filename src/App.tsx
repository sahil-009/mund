import React, { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Sidebar } from './components/Sidebar';
import { Terminal } from './components/Terminal';
import { CommandPalette } from './components/CommandPalette';
import { Settings } from './components/Settings';
import { FindReplace } from './components/FindReplace';
import './styles/App.css';

interface EditorTab {
  id: string;
  name: string;
  path: string;
  content: string;
  modified: boolean;
  language: string;
}

const App: React.FC = () => {
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showFind, setShowFind] = useState(false);
  const [terminalHeight] = useState(200);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyP') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.code === 'Backquote') {
        e.preventDefault();
        setShowTerminal((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
        e.preventDefault();
        saveCurrentFile();
      }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyO') {
        e.preventDefault();
        handleOpenFile();
      }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyN') {
        e.preventDefault();
        addNewFile();
      }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyF') {
        e.preventDefault();
        setShowFind((prev) => !prev);
      }
      if (e.code === 'F5') {
        e.preventDefault();
        runCurrentFile();
      }
      if (e.code === 'F7') {
        e.preventDefault();
        stopExecution();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const addTab = (name: string, path: string, content: string, language: string) => {
    const newTab: EditorTab = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      path,
      content,
      modified: false,
      language,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTab(newTab.id);
  };

  const addNewFile = () => {
    addTab(`untitled-${tabs.length + 1}.txt`, '', '', 'text');
  };

  const handleOpenFile = async () => {
    try {
      const result = await (window as any).api.openFile();
      if (result) {
        addTab(result.fileName, result.filePath, result.content, result.language);
      }
    } catch (error) {
      console.error('Failed to open file:', error);
    }
  };

  const handleOpenFolder = async () => {
    try {
      const folderPath = await (window as any).api.openFolder();
      if (folderPath) {
        console.log('Opened folder:', folderPath);
      }
    } catch (error) {
      console.error('Failed to open folder:', error);
    }
  };

  const updateTab = (id: string, content: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === id ? { ...tab, content, modified: true } : tab
      )
    );
  };

  const closeTab = (id: string) => {
    setTabs((prev) => {
      const newTabs = prev.filter((tab) => tab.id !== id);
      if (activeTab === id) {
        setActiveTab(newTabs.length > 0 ? newTabs[0].id : null);
      }
      return newTabs;
    });
  };

  const saveCurrentFile = async () => {
    if (!activeTab) return;
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return;

    try {
      if (tab.path && tab.path !== '') {
        await (window as any).api.saveFile(tab.path, tab.content);
      } else {
        const result = await (window as any).api.saveFileAs(tab.content);
        if (result && result.success) {
          setTabs((prev) =>
            prev.map((t) =>
              t.id === activeTab ? { ...t, path: result.filePath, modified: false } : t
            )
          );
          return;
        }
      }
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTab ? { ...t, modified: false } : t
        )
      );
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  };

  const runCurrentFile = async () => {
    if (!activeTab) return;
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return;

    if (tab.path && tab.path !== '') {
      try {
        if (tab.language === 'cpp' || tab.language === 'c') {
          await (window as any).api.compileCpp(tab.path);
        } else if (tab.language === 'java') {
          await (window as any).api.compileJava(tab.path);
        } else if (tab.language === 'javascript') {
          await (window as any).api.executeCommand('node', [tab.path]);
        }
        setShowTerminal(true);
      } catch (error) {
        console.error('Failed to run file:', error);
      }
    }
  };

  const stopExecution = async () => {
    try {
      await (window as any).api.stopProcess();
    } catch (error) {
      console.error('Failed to stop process:', error);
    }
  };

  const executeCommand = (cmd: string) => {
    const commandMap: { [key: string]: () => void } = {
      'new-file': addNewFile,
      'open-file': handleOpenFile,
      'open-folder': handleOpenFolder,
      'save-file': saveCurrentFile,
      'run': runCurrentFile,
      'stop': stopExecution,
    };

    if (commandMap[cmd]) {
      commandMap[cmd]();
    }
  };

  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <div className="app-container">
      <Sidebar onOpenFile={(name, path, content, lang) => addTab(name, path, content, lang)} />

      <div className="main-content">
        <div className="editor-container">
          <div className="tabs-bar">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.modified ? '● ' : ''}{tab.name}</span>
                <button
                  className="close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button className="new-tab-btn" onClick={addNewFile} title="New File (Ctrl+N)">
              +
            </button>
          </div>

          {activeTab && currentTab && (
            <>
              {showFind && (
                <FindReplace
                  content={currentTab.content}
                  onFind={(query) => console.log('Find:', query)}
                  onReplace={(query, replacement) => {
                    const newContent = currentTab.content.replace(new RegExp(query, 'g'), replacement);
                    updateTab(activeTab, newContent);
                  }}
                  onClose={() => setShowFind(false)}
                />
              )}
              <Editor
                tab={currentTab}
                onChange={(content) => updateTab(activeTab, content)}
                onRun={runCurrentFile}
              />
            </>
          )}

          {!activeTab && (
            <div className="welcome-screen">
              <h1>FORGE</h1>
              <p>Welcome to FORGE - Fast Code Editor for Engineers</p>
              <div className="welcome-buttons">
                <button onClick={handleOpenFile} className="welcome-btn">
                  📂 Open File (Ctrl+O)
                </button>
                <button onClick={handleOpenFolder} className="welcome-btn">
                  📁 Open Folder
                </button>
                <button onClick={addNewFile} className="welcome-btn">
                  ✨ New File (Ctrl+N)
                </button>
              </div>
              <div className="feature-list">
                <h3>✨ Features</h3>
                <ul>
                  <li>✓ Multi-file editing with tabs</li>
                  <li>✓ Syntax highlighting (C++, Java, JS, HTML, CSS)</li>
                  <li>✓ Line numbers & auto-indent</li>
                  <li>✓ Auto-brackets & auto-close</li>
                  <li>✓ Find & replace (Ctrl+F)</li>
                  <li>✓ Integrated terminal</li>
                  <li>✓ Compile & run C++ and Java</li>
                  <li>✓ Command palette (Ctrl+Shift+P)</li>
                  <li>✓ Settings panel</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {showTerminal && (
          <Terminal
            height={terminalHeight}
            onOpenFile={(name, path, content, lang) => addTab(name, path, content, lang)}
          />
        )}
      </div>

      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          onCommand={executeCommand}
        />
      )}

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default App;
