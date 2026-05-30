import React, { useState } from "react";
import ProblemRow from "./ProblemRow";
import { PATTERNS } from "../data/patterns";
import { Lightbulb, Target, ListTodo } from "lucide-react";

export default function PatternDetail({ patternId, done, toggleProblem }) {
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  
  const pattern = PATTERNS.find(p => p.id === patternId);
  if (!pattern) return null;

  return (
    <div className="pattern-detail animate-fade-in">
      
      {/* Premium Hero Section */}
      <div className="card pattern-hero-card">
        <div className="pattern-hero-header">
          <span className="pattern-subtitle">ALGORITHM BLUEPRINT</span>
          <h2 className="pattern-title">{pattern.name}</h2>
        </div>
        
        <div className="pattern-hero-grid">
          {/* Left Column: Context & Signals */}
          <div className="hero-col">
            <h4 className="hero-col-title">
              <Lightbulb size={16} className="hero-icon text-warning" />
              When to apply this pattern
            </h4>
            <p className="hero-desc">{pattern.when}</p>
            
            <h4 className="hero-col-title mt-4">
              Trigger Signals
            </h4>
            <div className="signals-list">
              {pattern.signal.map(s => (
                <span key={s} className="signal-tag">{s}</span>
              ))}
            </div>
          </div>
          
          <div className="hero-divider" />
          
          {/* Right Column: Walkthrough */}
          <div className="hero-col">
            <h4 className="hero-col-title">
              <Target size={16} className="hero-icon text-primary" />
              Mental Walkthrough
            </h4>
            <span className="walkthrough-problem">Scenario: {pattern.walkthrough.problem}</span>
            <div className="walkthrough-steps-compact">
              {pattern.walkthrough.steps.map((step, idx) => (
                <div key={idx} className="walkthrough-step-compact">
                  <span className="step-num-compact">{idx + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Problems Table */}
      <div className="card problems-card-full">
        <div className="problems-header">
          <h3 className="problems-card-title">
            <ListTodo size={18} className="hero-icon" />
            Practice Problems
          </h3>
          <div className="filter-group">
            {["All", "Easy", "Medium", "Hard"].map(diff => (
              <button 
                key={diff}
                className={`filter-btn ${difficultyFilter === diff ? "active" : ""}`}
                onClick={() => setDifficultyFilter(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
        
        <div className="problems-list-full">
          {pattern.problems
            .filter(pr => difficultyFilter === "All" || pr.difficulty === difficultyFilter)
            .map((pr, idx) => (
              <ProblemRow 
                key={pr.name}
                problem={pr}
                isDone={!!done[`${pattern.id}::${pr.name}`]}
                toggleProblem={() => toggleProblem(pattern.id, pr.name)}
              />
            ))}
        </div>
      </div>

    </div>
  );
}
