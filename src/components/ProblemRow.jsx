import React from "react";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";

const DIFF_STYLE = {
  Easy: { bg: "var(--easy-bg)", color: "var(--easy-color)" },
  Medium: { bg: "var(--med-bg)", color: "var(--med-color)" },
  Hard: { bg: "var(--hard-bg)", color: "var(--hard-color)" },
};

export default function ProblemRow({ problem, isDone, toggleProblem }) {
  const ds = DIFF_STYLE[problem.difficulty];

  return (
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
      </div>
    </div>
  );
}
