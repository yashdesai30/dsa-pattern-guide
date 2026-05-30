import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import DashboardOverview from "./components/DashboardOverview";
import PatternDetail from "./components/PatternDetail";
import { PATTERNS, TOTAL_PROBLEMS } from "./data/patterns";
import { useSync } from "./hooks/useSync";

export default function App() {
  const [done, setDone] = useState({});
  const [activePattern, setActivePattern] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("dark");

  const syncState = useSync(done, setDone);

  useEffect(() => {
    const savedTheme = localStorage.getItem("dsa_theme_mode") || "dark";
    setTheme(savedTheme);
    document.body.className = `theme-${savedTheme}`;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("dsa_theme_mode", nextTheme);
    document.body.className = `theme-${nextTheme}`;
  };

  const toggleProblem = (patternId, name) => {
    const key = `${patternId}::${name}`;
    const next = { ...done, [key]: !done[key] };
    if (!next[key]) delete next[key];
    
    setDone(next);
    try {
      localStorage.setItem("dsa-nc150-v2", JSON.stringify(next));
    } catch (err) {
      console.error("Local storage writing error", err);
    }

    syncState.syncProgress(next);
  };

  const solvedCount = Object.values(done).filter(Boolean).length;
  const pct = Math.round((solvedCount / TOTAL_PROBLEMS) * 100) || 0;

  return (
    <Layout
      theme={theme}
      toggleTheme={toggleTheme}
      activePattern={activePattern}
      setActivePattern={setActivePattern}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      solvedCount={solvedCount}
      totalProblems={TOTAL_PROBLEMS}
      pct={pct}
      syncState={syncState}
    >
      {!activePattern ? (
        <DashboardOverview 
          solvedCount={solvedCount} 
          totalProblems={TOTAL_PROBLEMS} 
          pct={pct} 
          done={done}
          setActivePattern={setActivePattern}
        />
      ) : (
        <PatternDetail 
          patternId={activePattern} 
          done={done} 
          toggleProblem={toggleProblem} 
        />
      )}

      {syncState.showToast && (
        <div className="premium-toast animate-slide-up">
          <span className="toast-text">{syncState.toastMessage}</span>
        </div>
      )}
    </Layout>
  );
}
