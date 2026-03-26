import React, { useState } from 'react';
import '../styles/Settings.css';

interface SettingsProps {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(4);
  const [wordWrap, setWordWrap] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [fontLigatures, setFontLigatures] = useState(true);

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="settings-content">
          <div className="settings-panel">
            <h3>Editor</h3>
            
            <div className="setting-group">
              <label>Font Size</label>
              <div className="setting-control">
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                />
                <span>{fontSize}</span>
              </div>
            </div>

            <div className="setting-group">
              <label>Tab Size</label>
              <div className="setting-control">
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={tabSize}
                  onChange={(e) => setTabSize(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={wordWrap}
                  onChange={(e) => setWordWrap(e.target.checked)}
                />
                Word Wrap
              </label>
            </div>

            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={lineNumbers}
                  onChange={(e) => setLineNumbers(e.target.checked)}
                />
                Line Numbers
              </label>
            </div>

            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={fontLigatures}
                  onChange={(e) => setFontLigatures(e.target.checked)}
                />
                Font Ligatures
              </label>
            </div>
          </div>

          <div className="keyboard-shortcuts">
            <h3>Keyboard Shortcuts</h3>
            <div className="shortcuts-list">
              <div className="shortcut-item">
                <span>New File</span>
                <code>Ctrl+N</code>
              </div>
              <div className="shortcut-item">
                <span>Open File</span>
                <code>Ctrl+O</code>
              </div>
              <div className="shortcut-item">
                <span>Save</span>
                <code>Ctrl+S</code>
              </div>
              <div className="shortcut-item">
                <span>Find</span>
                <code>Ctrl+F</code>
              </div>
              <div className="shortcut-item">
                <span>Command Palette</span>
                <code>Ctrl+Shift+P</code>
              </div>
              <div className="shortcut-item">
                <span>Terminal</span>
                <code>Ctrl+`</code>
              </div>
              <div className="shortcut-item run">
                <span>Run</span>
                <code>F5</code>
              </div>
              <div className="shortcut-item run">
                <span>Stop</span>
                <code>F7</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
