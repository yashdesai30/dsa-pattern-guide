import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ 
  children, 
  activePattern, 
  setActivePattern, 
  theme, 
  toggleTheme, 
  searchQuery, 
  setSearchQuery,
  solvedCount,
  totalProblems,
  pct,
  syncState
}) {
  return (
    <div className={`dashboard-layout ${theme}`}>
      <Sidebar 
        activePattern={activePattern} 
        setActivePattern={setActivePattern} 
        solvedCount={solvedCount}
        totalProblems={totalProblems}
        pct={pct}
      />
      <div className="main-content">
        <Header 
          theme={theme} 
          toggleTheme={toggleTheme} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          syncState={syncState}
        />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
}
