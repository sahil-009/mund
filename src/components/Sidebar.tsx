import React, { useState } from 'react';
import '../styles/Sidebar.css';

interface SidebarProps {
  onOpenFile: (name: string, path: string, content: string, language: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenFile }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('explorer');

  const handleOpenFile = () => {
    // Placeholder for file dialog
    const sampleContent = '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, FORGE!" << endl;\n    return 0;\n}';
    onOpenFile('main.cpp', '/home/user/project/main.cpp', sampleContent, 'cpp');
  };

  const handleOpenFolder = () => {
    // Placeholder for folder dialog
    setFiles([
      { id: '1', name: 'main.cpp', type: 'file', path: '/main.cpp' },
      { id: '2', name: 'index.js', type: 'file', path: '/index.js' },
    ]);
  };

  return (
    <div className="sidebar">
      <div className="activity-bar">
        <button
          className={`activity-btn ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
          title="Explorer"
        >
          📁
        </button>
        <button
          className={`activity-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
          title="Search"
        >
          🔍
        </button>
        <button
          className={`activity-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          title="Settings"
        >
          ⚙️
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'explorer' && (
          <div className="explorer">
            <div className="explorer-header">EXPLORER</div>
            {files.length === 0 ? (
              <div className="explorer-empty">
                <button onClick={handleOpenFolder}>Open Folder</button>
                <button onClick={handleOpenFile}>Open File</button>
              </div>
            ) : (
              <div className="file-tree">
                {files.map(file => (
                  <div key={file.id} className="file-item" onClick={() => handleOpenFile()}>
                    {file.type === 'file' ? '📄' : '📁'} {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="search-panel">
            <input type="text" placeholder="Search..." className="search-input" />
            <div className="search-results">No results</div>
          </div>
        )}
      </div>
    </div>
  );
};
