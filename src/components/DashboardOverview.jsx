import React from "react";
import { PATTERNS } from "../data/patterns";

export default function DashboardOverview({ solvedCount, totalProblems, pct, done, setActivePattern }) {

  const recommended = PATTERNS.slice(0, 3); // Mock logic for recommended
  const attempted = Math.floor(solvedCount * 0.3); // Mock logic for attempted
  const unsolved = totalProblems - solvedCount - attempted;

  return (
    <div className="dashboard-overview animate-fade-in">
      <div className="dashboard-welcome">
        <h1>Good Morning!</h1>
        <p>Your DSA Journey Today</p>
      </div>

      <div className="dashboard-grid">
        <div className="card progress-card">
          <h3 className="card-title">Your Activity</h3>
          <div className="progress-ring-container">
            <svg className="progress-ring" viewBox="0 0 100 100">
              <circle className="ring-bg" cx="50" cy="50" r="45" />
              <circle
                className="ring-fill"
                cx="50" cy="50" r="45"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * pct) / 100}
              />
            </svg>
            <div className="ring-content">
              <span className="ring-numbers">{solvedCount} / {totalProblems}</span>
              <span className="ring-label">Problems Solved</span>
              <span className="ring-pct">{pct}%</span>
            </div>
          </div>

          <div className="problem-breakdown">
            <h4 className="breakdown-title">Problem Breakdown</h4>
            <div className="breakdown-row">
              <span className="status-dot green" />
              <span>Solved</span>
              <span className="count-badge green">{solvedCount}</span>
            </div>
            <div className="breakdown-row">
              <span className="status-dot orange" />
              <span>Attempted</span>
              <span className="count-badge orange">{attempted}</span>
            </div>
            <div className="breakdown-row">
              <span className="status-dot grey" />
              <span>Unsolved</span>
              <span className="count-badge grey">{unsolved}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
