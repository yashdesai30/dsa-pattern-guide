import React from "react";
import { BookOpen, Layers, CheckCircle, BrainCircuit, Activity, Settings, Code, BarChart2, Notebook } from "lucide-react";
import { PHASES, PATTERNS } from "../data/patterns";

export default function Sidebar({ activePattern, setActivePattern, solvedCount, totalProblems, pct, notes = {} }) {
  const notesCount = Object.keys(notes).length;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <BrainCircuit size={24} />
        </div>
        <span className="brand-name">AlgoMaster</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <button 
            className={`nav-item ${!activePattern ? "active" : ""}`}
            onClick={() => setActivePattern(null)}
          >
            <Activity size={18} />
            <span>Dashboard</span>
          </button>

          <button 
            className={`nav-item ${activePattern === "revision-desk" ? "active" : ""}`}
            onClick={() => setActivePattern("revision-desk")}
          >
            <Notebook size={18} />
            <span>Revision Desk</span>
            {notesCount > 0 && (
              <span className="notes-badge-count">{notesCount}</span>
            )}
          </button>
        </div>

        <div className="nav-section-title">PATTERNS</div>
        <div className="patterns-list">
          {PATTERNS.map((p) => {
            const isActive = activePattern === p.id;
            return (
              <button
                key={p.id}
                className={`pattern-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setActivePattern(p.id)}
              >
                <span className="pattern-name">{p.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="mini-progress">
          <div className="mini-progress-text">
            <span>Overall Progress</span>
            <span>{pct}%</span>
          </div>
          <div className="mini-progress-bar">
            <div className="mini-progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
