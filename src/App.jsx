import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import DashboardOverview from "./components/DashboardOverview";
import PatternDetail from "./components/PatternDetail";
import RevisionDesk from "./components/RevisionDesk";
import { PATTERNS, TOTAL_PROBLEMS } from "./data/patterns";
import { useSync } from "./hooks/useSync";

export default function App() {
  const [done, setDone] = useState({});
  const [notes, setNotes] = useState({});
  const [activePattern, setActivePattern] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");

  const syncState = useSync(done, setDone, notes, setNotes);

  useEffect(() => {
    // Defaulting to dark theme, no local storage persistence
    document.body.className = `theme-${theme}`;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.body.className = `theme-${nextTheme}`;
  };

  const toggleProblem = (patternId, name) => {
    const key = `${patternId}::${name}`;
    const next = { ...done, [key]: !done[key] };
    if (!next[key]) delete next[key];

    setDone(next);
    syncState.syncProgress(next, notes);
  };

  const saveNote = (patternId, name, text) => {
    const key = `${patternId}::${name}`;
    const next = { ...notes, [key]: text };
    if (!text.trim()) {
      delete next[key];
    }
    setNotes(next);
    syncState.syncProgress(done, next);
  };

  const deleteNote = (patternId, name) => {
    const key = `${patternId}::${name}`;
    const next = { ...notes };
    delete next[key];
    setNotes(next);
    syncState.syncProgress(done, next);
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
      notes={notes}
    >
      {!activePattern ? (
        <DashboardOverview
          solvedCount={solvedCount}
          totalProblems={TOTAL_PROBLEMS}
          pct={pct}
          done={done}
          setActivePattern={setActivePattern}
        />
      ) : activePattern === "revision-desk" ? (
        <RevisionDesk
          notes={notes}
          saveNote={saveNote}
          deleteNote={deleteNote}
          setActivePattern={setActivePattern}
          done={done}
          toggleProblem={toggleProblem}
        />
      ) : (
        <PatternDetail
          patternId={activePattern}
          done={done}
          toggleProblem={toggleProblem}
          notes={notes}
          saveNote={saveNote}
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
