import React, { useState } from 'react';
import '../styles/CommandPalette.css';

interface CommandPaletteProps {
  onClose: () => void;
  onCommand: (command: string) => void;
}

const COMMANDS = [
  { id: 'new-file', label: 'New File', key: 'Ctrl+N' },
  { id: 'open-file', label: 'Open File', key: 'Ctrl+O' },
  { id: 'save-file', label: 'Save', key: 'Ctrl+S' },
  { id: 'find', label: 'Find', key: 'Ctrl+F' },
  { id: 'run', label: 'Run', key: 'F5' },
  { id: 'stop', label: 'Stop', key: 'F7' },
  { id: 'toggle-comment', label: 'Toggle Comment', key: 'Ctrl+/' },
  { id: 'format', label: 'Format Document', key: 'Shift+Alt+F' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onClose, onCommand }) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);

  const filtered = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onCommand(filtered[selectedIdx].id);
      onClose();
    }
  };

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Search commands..."
          className="command-input"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setSelectedIdx(0);
          }}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="command-list">
          {filtered.length > 0 ? (
            filtered.map((cmd, idx) => (
              <div
                key={cmd.id}
                className={`command-item ${idx === selectedIdx ? 'selected' : ''}`}
                onClick={() => {
                  onCommand(cmd.id);
                  onClose();
                }}
              >
                <span className="command-label">{cmd.label}</span>
                <span className="command-key">{cmd.key}</span>
              </div>
            ))
          ) : (
            <div className="command-empty">No commands found</div>
          )}
        </div>
      </div>
    </div>
  );
};
