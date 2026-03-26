import React, { useState, useRef } from 'react';
import '../styles/FindReplace.css';

interface FindReplaceProps {
  content: string;
  onFind: (query: string) => void;
  onReplace: (query: string, replacement: string) => void;
  onClose: () => void;
}

export const FindReplace: React.FC<FindReplaceProps> = ({ content, onFind, onReplace, onClose }) => {
  const [findInput, setFindInput] = useState('');
  const [replaceInput, setReplaceInput] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [showReplace, setShowReplace] = useState(false);

  const handleFind = (query: string) => {
    setFindInput(query);
    if (query) {
      const regex = new RegExp(query, 'g');
      const matches = content.match(regex);
      setMatchCount(matches ? matches.length : 0);
      onFind(query);
    } else {
      setMatchCount(0);
    }
  };

  const handleReplace = () => {
    if (findInput && replaceInput !== undefined) {
      onReplace(findInput, replaceInput);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
      e.preventDefault();
      setShowReplace(!showReplace);
    }
  };

  return (
    <div className="find-replace-panel" onKeyDown={handleKeyDown}>
      <div className="find-replace-header">
        <div className="find-replace-controls">
          <input
            type="text"
            placeholder="Find"
            value={findInput}
            onChange={(e) => handleFind(e.target.value)}
            className="find-input"
            autoFocus
          />
          <span className="match-count">{matchCount > 0 ? `${matchCount}` : ''}</span>
          <button
            className="toggle-replace-btn"
            onClick={() => setShowReplace(!showReplace)}
            title="Toggle Replace (Ctrl+H)"
          >
            ⇄
          </button>
          <button className="close-find-btn" onClick={onClose} title="Close (Esc)">
            ✕
          </button>
        </div>

        {showReplace && (
          <div className="find-replace-controls">
            <input
              type="text"
              placeholder="Replace"
              value={replaceInput}
              onChange={(e) => setReplaceInput(e.target.value)}
              className="replace-input"
            />
            <button className="replace-btn" onClick={handleReplace} title="Replace">
              Replace
            </button>
            <button
              className="replace-all-btn"
              onClick={() => {
                const regex = new RegExp(findInput, 'g');
                onReplace(findInput, replaceInput);
              }}
              title="Replace All"
            >
              Replace All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
