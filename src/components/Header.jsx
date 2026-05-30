import React, { useState } from "react";
import { Search, Sun, Moon, Database, RefreshCw, Link as LinkIcon, X, Copy } from "lucide-react";

export default function Header({ theme, toggleTheme, searchQuery, setSearchQuery, syncState }) {
  const [newNickname, setNewNickname] = useState("");
  const [linkNickname, setLinkNickname] = useState("");

  const copyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?user=${syncState.userId}`);
    syncState.triggerToast("URL copied to clipboard!");
  };

  return (
    <>
      <header className="top-header">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search patterns or problems..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="header-actions">
          <div className={`db-sync-badge status-${syncState.dbStatus}`}>
            {syncState.dbStatus === "synced" && <><Database size={12} className="success-color" /> <span>Synced</span></>}
            {syncState.dbStatus === "syncing" && <><RefreshCw size={12} className="spinning" /> <span>Syncing</span></>}
            {syncState.dbStatus === "error" && <><Database size={12} className="danger-color" /> <span>Error</span></>}
            {syncState.dbStatus === "local" && <><Database size={12} /> <span>Local</span></>}
          </div>

          <button className="sync-btn" onClick={() => syncState.setShowSyncModal(!syncState.showSyncModal)}>
            <LinkIcon size={14} />
            <span>Link Device</span>
          </button>

          <button className="icon-button theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      {syncState.showSyncModal && (
        <div className="sync-modal-overlay">
          <div className="sync-modal card animate-fade-in">
            <div className="sync-modal-header">
              <h3>Cross-Browser Progress Sync</h3>
              <button className="close-btn" onClick={() => syncState.setShowSyncModal(false)}><X size={18} /></button>
            </div>
            
            <p className="sync-modal-desc">
              Sync your DSA progress across any browser instantly! Register a memorable custom nickname to save and load progress.
            </p>

            <div className="sync-step">
              <label>1. Set Your Custom Nickname</label>
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Enter custom nickname..." 
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="sync-input"
                />
                <button className="btn-primary" onClick={() => syncState.registerNickname(newNickname)}>Save</button>
              </div>
              <span className="active-id">Active ID: <code>{syncState.userId}</code></span>
            </div>

            <div className="sync-step">
              <label>2. Link to an Existing Nickname</label>
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Enter existing nickname..." 
                  value={linkNickname}
                  onChange={(e) => setLinkNickname(e.target.value)}
                  className="sync-input"
                />
                <button className="btn-success" onClick={() => syncState.linkNickname(linkNickname)}>Link</button>
              </div>
            </div>

            <div className="sync-step">
              <label>Quick Sync URL</label>
              <div className="input-group">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}${window.location.pathname}?user=${syncState.userId}`}
                  className="sync-input code-font"
                />
                <button className="icon-button-small" onClick={copyUrl}><Copy size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
