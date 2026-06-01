import React, { useState } from "react";
import { createPortal } from "react-dom";
import { PATTERNS } from "../data/patterns";
import { 
  Search, 
  Trash2, 
  ExternalLink, 
  Notebook, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  FileText,
  AlertCircle,
  X,
  Edit2,
  Maximize2
} from "lucide-react";
import { renderMarkdown } from "./markdownParser";
import RichEditor from "./RichEditor";

export default function RevisionDesk({ 
  notes, 
  saveNote, 
  deleteNote, 
  setActivePattern, 
  done, 
  toggleProblem 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saveStatus, setSaveStatus] = useState(""); // "Saving...", "Saved!"
  
  // Dedicated state for Focus Spacious Read Mode
  const [viewingNote, setViewingNote] = useState(null);

  // Resolve all notes into a full metadata list
  const annotatedProblems = Object.entries(notes).map(([key, text]) => {
    const [patternId, problemName] = key.split("::");
    const pattern = PATTERNS.find(p => p.id === patternId);
    const problem = pattern ? pattern.problems.find(pr => pr.name === problemName) : null;
    
    return {
      key,
      patternId,
      patternName: pattern ? pattern.name : "Unknown Pattern",
      patternColor: pattern ? pattern.color : "#3b82f6",
      problemName,
      difficulty: problem ? problem.difficulty : "Medium",
      lc: problem ? problem.lc : "#",
      text,
      isDone: !!done[`${patternId}::${problemName}`]
    };
  }).filter(item => item.problemName); // filter out unresolved problems

  // Compute statistics
  const totalNotesCount = annotatedProblems.length;
  const easyCount = annotatedProblems.filter(p => p.difficulty === "Easy").length;
  const mediumCount = annotatedProblems.filter(p => p.difficulty === "Medium").length;
  const hardCount = annotatedProblems.filter(p => p.difficulty === "Hard").length;

  // Filter lists based on search query & difficulty
  const filteredProblems = annotatedProblems.filter(item => {
    const matchesSearch = 
      item.problemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patternName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDifficulty = 
      difficultyFilter === "All" || 
      item.difficulty === difficultyFilter;
      
    return matchesSearch && matchesDifficulty;
  });

  const handleStartEditing = (key, currentText) => {
    setEditingKey(key);
    setEditValue(currentText);
    setSaveStatus("");
  };

  const handleSaveEdit = (patternId, name) => {
    setSaveStatus("Saving...");
    saveNote(patternId, name, editValue);
    setTimeout(() => {
      setSaveStatus("Saved!");
      setTimeout(() => {
        setEditingKey(null);
        setSaveStatus("");
      }, 800);
    }, 500);
  };

  const activeEditingItem = annotatedProblems.find(item => item.key === editingKey);

  return (
    <div className="revision-desk animate-fade-in">
      
      {/* Premium Header */}
      <div className="revision-desk-header">
        <div className="header-left">
          <div className="header-icon-wrapper">
            <Notebook size={24} />
          </div>
          <div>
            <h1>Revision Desk</h1>
            <p>Review, search, and refine your custom problem notes</p>
          </div>
        </div>
        
        {totalNotesCount > 0 && (
          <div className="revision-stats-mini card">
            <div className="stat-pill">
              <span className="stat-label">Total Notes</span>
              <span className="stat-val">{totalNotesCount}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-pill text-easy">
              <span className="stat-label">Easy</span>
              <span className="stat-val">{easyCount}</span>
            </div>
            <div className="stat-pill text-med">
              <span className="stat-label">Medium</span>
              <span className="stat-val">{mediumCount}</span>
            </div>
            <div className="stat-pill text-hard">
              <span className="stat-label">Hard</span>
              <span className="stat-val">{hardCount}</span>
            </div>
          </div>
        )}
      </div>

      {totalNotesCount === 0 ? (
        /* Stunning Empty State */
        <div className="card empty-desk-card animate-fade-in">
          <div className="empty-desk-icon">
            <Sparkles size={36} />
          </div>
          <h3>Your Desk is Clear!</h3>
          <p>
            You haven't written any revision notes yet. Notes are the perfect tool to remember 
            intricate edge cases, optimal time complexities, or trick questions during your revision phase.
          </p>
          <button className="btn-primary-large" onClick={() => setActivePattern("arrays")}>
            <span>Browse Patterns & Start Writing</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        /* Active Revision Content */
        <div className="revision-content-grid">
          
          {/* Filters Bar */}
          <div className="card filters-card">
            <div className="desk-search-container">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search notes, problems, or patterns..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="desk-search-input"
              />
            </div>
            
            <div className="filter-group">
              {["All", "Easy", "Medium", "Hard"].map(diff => (
                <button 
                  key={diff}
                  className={`filter-btn ${difficultyFilter === diff ? "active" : ""}`}
                  onClick={() => setDifficultyFilter(diff)}
                >
                  {diff} ({
                    diff === "All" ? totalNotesCount : 
                    diff === "Easy" ? easyCount : 
                    diff === "Medium" ? mediumCount : hardCount
                  })
                </button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          <div className="notes-list-container">
            {filteredProblems.length === 0 ? (
              <div className="card empty-search-card">
                <AlertCircle size={24} className="text-muted" />
                <p>No notes matched your search criteria.</p>
              </div>
            ) : (
              filteredProblems.map(item => (
                <div key={item.key} className="card note-card animate-fade-in">
                  
                  {/* Note Card Header */}
                  <div className="note-card-header">
                    <div className="note-header-left">
                      <button 
                        className="problem-check" 
                        onClick={() => toggleProblem(item.patternId, item.problemName)}
                      >
                        {item.isDone ? <CheckCircle2 size={18} className="success-color" /> : <Circle size={18} />}
                      </button>
                      
                      <div className="problem-info">
                        <span 
                          className="pattern-badge" 
                          style={{ backgroundColor: item.patternColor + "15", color: item.patternColor }}
                          onClick={() => setActivePattern(item.patternId)}
                        >
                          {item.patternName}
                        </span>
                        <h4 className={`problem-title ${item.isDone ? "completed" : ""}`}>
                          {item.problemName}
                        </h4>
                      </div>
                    </div>

                    <div className="note-header-actions">
                      <span className={`diff-badge diff-${item.difficulty.toLowerCase()}`}>
                        {item.difficulty}
                      </span>
                      <a href={item.lc} target="_blank" rel="noopener noreferrer" className="lc-link" title="Open on LeetCode">
                        <ExternalLink size={14} />
                      </a>
                      
                      {/* Premium Dedicated Action Buttons */}
                      <button 
                        className="view-note-btn-header"
                        onClick={() => setViewingNote(item)}
                        title="Spacious Study View Mode"
                      >
                        <Maximize2 size={14} />
                      </button>
                      
                      <button 
                        className="edit-note-btn-header"
                        onClick={() => handleStartEditing(item.key, item.text)}
                        title="Edit visual rich notes"
                      >
                        <Edit2 size={14} />
                      </button>
                      
                      <button 
                        className="delete-note-btn" 
                        onClick={() => {
                          if (confirm(`Delete note for "${item.problemName}"?`)) {
                            deleteNote(item.patternId, item.problemName);
                          }
                        }}
                        title="Delete notes"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Pure Static Note Content Area (Interactive: lets user copy, select text, click inline codes) */}
                  <div className="note-content-body">
                    <div className="note-text-display-static html-rendered">
                      {renderMarkdown(item.text)}
                    </div>
                  </div>

                  {/* Card Footer Jump Link */}
                  <div className="note-card-footer">
                    <button 
                      className="jump-to-pattern-btn" 
                      onClick={() => setActivePattern(item.patternId)}
                    >
                      <span>Go to Pattern Guide</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Unified Spacious Notes Editor Modal */}
      {activeEditingItem && createPortal(
        <div className="notes-modal-overlay animate-fade-in" onClick={() => setEditingKey(null)}>
          <div className="notes-modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="notes-modal-header">
              <div className="notes-modal-title-group">
                <span className="notes-modal-subtitle">
                  {activeEditingItem.difficulty} • {activeEditingItem.patternName.toUpperCase()}
                </span>
                <h3>{activeEditingItem.problemName} Notes</h3>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setEditingKey(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="notes-modal-body">
              <div className="editor-header">
                <span className="editor-title">Visual Rich Editor</span>
                
                <div className="editor-actions">
                  {saveStatus && <span className={`save-status ${saveStatus === "Saved!" ? "saved" : "saving"}`}>{saveStatus}</span>}
                </div>
              </div>

              <RichEditor 
                value={editValue} 
                onChange={(val) => setEditValue(val)} 
                placeholder="Write your study notes, paste code snippets, or list bullet points directly..."
              />
            </div>

            <div className="notes-modal-footer">
              <span className="char-count">{editValue.length} characters</span>
              <div className="editor-buttons">
                <button 
                  className="btn-cancel" 
                  onClick={() => setEditingKey(null)}
                  disabled={saveStatus === "Saving..."}
                >
                  Cancel
                </button>
                <button 
                  className="btn-save" 
                  onClick={() => handleSaveEdit(activeEditingItem.patternId, activeEditingItem.problemName)}
                  disabled={saveStatus === "Saving..."}
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Premium focus-spacious Read Mode Modal */}
      {viewingNote && createPortal(
        <div className="notes-modal-overlay animate-fade-in" onClick={() => setViewingNote(null)}>
          <div className="notes-modal-card read-mode-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="notes-modal-header">
              <div className="notes-modal-title-group">
                <span className="notes-modal-subtitle">
                  {viewingNote.difficulty} • {viewingNote.patternName.toUpperCase()} • STUDY GUIDE
                </span>
                <h3>{viewingNote.problemName} Notes</h3>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setViewingNote(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="notes-modal-body spacious-reading-body html-rendered">
              {renderMarkdown(viewingNote.text)}
            </div>

            <div className="notes-modal-footer">
              <span className="char-count">{viewingNote.text.length} characters</span>
              <div className="editor-buttons">
                <button 
                  className="btn-modal-close btn-cancel" 
                  onClick={() => setViewingNote(null)}
                >
                  Close
                </button>
                <button 
                  className="btn-primary-large btn-save" 
                  onClick={() => {
                    const item = viewingNote;
                    setViewingNote(null);
                    handleStartEditing(item.key, item.text);
                  }}
                >
                  <Edit2 size={13} />
                  <span>Edit Note Guide</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
