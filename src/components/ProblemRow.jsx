import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Circle, ExternalLink, FileText, Trash2, X, Edit2, EyeOff, Eye } from "lucide-react";
import RichEditor from "./RichEditor";
import { renderMarkdown } from "./markdownParser";

const DIFF_STYLE = {
  Easy: { bg: "var(--easy-bg)", color: "var(--easy-color)" },
  Medium: { bg: "var(--med-bg)", color: "var(--med-color)" },
  Hard: { bg: "var(--hard-bg)", color: "var(--hard-color)" },
};

export default function ProblemRow({ 
  problem, 
  isDone, 
  toggleProblem, 
  patternId, 
  notes = {}, 
  saveNote 
}) {
  const ds = DIFF_STYLE[problem.difficulty];
  const noteKey = `${patternId}::${problem.name}`;
  const currentNote = notes[noteKey] || "";
  
  const [showEditor, setShowEditor] = useState(false);
  const [showInlineView, setShowInlineView] = useState(false);
  const [noteText, setNoteText] = useState(currentNote);
  const [saveStatus, setSaveStatus] = useState("");
  const saveTimeoutRef = useRef(null);

  const handleTextChange = (val) => {
    setNoteText(val);
    setSaveStatus("Saving...");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveNote(patternId, problem.name, val);
      setSaveStatus("Saved!");
      setTimeout(() => setSaveStatus(""), 1000);
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`problem-row-container ${showEditor ? "editor-active" : ""} ${showInlineView ? "inline-note-open" : ""}`}>
      <div className={`problem-row ${isDone ? "completed" : ""}`}>
        <div className="problem-left">
          <button className="problem-check" onClick={toggleProblem}>
            {isDone ? <CheckCircle2 size={18} className="success-color" /> : <Circle size={18} />}
          </button>
          <span className="problem-name">{problem.name}</span>
        </div>
        <div className="problem-right">
          <span className="diff-badge" style={{ backgroundColor: ds.bg, color: ds.color }}>
            {problem.difficulty}
          </span>
          <a href={problem.lc} target="_blank" rel="noopener noreferrer" className="lc-link">
            <ExternalLink size={14} />
          </a>
          <button 
            className={`note-toggle-btn ${currentNote ? "has-note" : ""} ${showInlineView ? "view-active" : ""}`}
            onClick={() => {
              if (currentNote) {
                setShowInlineView(!showInlineView);
              } else {
                setShowEditor(true);
                setNoteText("");
              }
            }}
            title={currentNote ? (showInlineView ? "Hide note" : "Read note guide inline") : "Add note"}
          >
            <FileText size={14} />
            {currentNote && <span className="note-indicator-dot" />}
          </button>
        </div>
      </div>

      {/* Premium Collapsible Inline Reader Drawer */}
      {currentNote && showInlineView && (
        <div className="problem-row-inline-note animate-fade-in card">
          <div className="inline-note-header">
            <div className="inline-note-title">
              <FileText size={12} className="text-primary" />
              <span>Study Note Guide</span>
            </div>
            <div className="inline-note-actions">
              <button 
                type="button" 
                className="btn-inline-edit"
                onClick={() => {
                  setShowEditor(true);
                  setNoteText(currentNote);
                }}
              >
                <Edit2 size={12} />
                <span>Edit Notes</span>
              </button>
              <button 
                type="button" 
                className="btn-inline-close"
                onClick={() => setShowInlineView(false)}
              >
                <EyeOff size={12} />
                <span>Hide</span>
              </button>
            </div>
          </div>
          <div className="inline-note-content html-rendered">
            {renderMarkdown(currentNote)}
          </div>
        </div>
      )}

      {showEditor && createPortal(
        <div className="notes-modal-overlay animate-fade-in" onClick={() => setShowEditor(false)}>
          <div className="notes-modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="notes-modal-header">
              <div className="notes-modal-title-group">
                <span className="notes-modal-subtitle">{problem.difficulty} • {patternId.toUpperCase().replace("-", " ")}</span>
                <h3>{problem.name} Notes</h3>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setShowEditor(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="notes-modal-body">
              <div className="editor-header">
                <span className="editor-title">Visual Rich Editor</span>
                
                <div className="editor-actions">
                  {saveStatus && <span className={`save-status ${saveStatus === "Saved!" ? "saved" : "saving"}`}>{saveStatus}</span>}
                  {currentNote && (
                    <button 
                      className="delete-note-btn-inline"
                      onClick={() => {
                        if (confirm(`Delete note for "${problem.name}"?`)) {
                          saveNote(patternId, problem.name, "");
                          setNoteText("");
                          setShowInlineView(false);
                          setShowEditor(false);
                        }
                      }}
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>

              <RichEditor 
                value={noteText} 
                onChange={handleTextChange} 
                placeholder="Write your study notes, paste code snippets, or list bullet points directly..."
              />
            </div>

            <div className="notes-modal-footer">
              <span className="char-count">{noteText.length} characters</span>
              <button type="button" className="btn-modal-close" onClick={() => setShowEditor(false)}>
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
