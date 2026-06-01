import React, { useState, useEffect, useRef } from "react";
import { Copy, Check, EyeOff, Eye } from "lucide-react";
import hljs from "highlight.js";

// Stateful component to handle clipboard copy state and active-recall hide/show on legacy code blocks
function MarkdownCodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false); // Hide code by default for active recall!

  const handleCopy = (e) => {
    e.stopPropagation(); // Prevent toggling when clicking copy
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang = language ? language.toUpperCase() : "CODE";

  // Perform dynamic syntax highlighting on legacy code block contents
  const highlighted = (() => {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language }).value;
      } catch (__) {}
    }
    try {
      return hljs.highlightAuto(code).value;
    } catch (__) {}
    return code;
  })();

  return (
    <div 
      className={`markdown-code-block-container ${!showCode ? "code-hidden" : ""}`}
      onClick={() => { if (!showCode) setShowCode(true); }}
    >
      <div className="markdown-code-block-header">
        <span className="lang-tag">{displayLang}</span>
        <div className="code-block-actions" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {showCode && (
            <button 
              type="button" 
              className="btn-hide-code" 
              style={{ background: "transparent", border: "none", fontSize: "11px", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
              onClick={(e) => { e.stopPropagation(); setShowCode(false); }}
            >
              <EyeOff size={11} />
              <span>Hide</span>
            </button>
          )}
          <button type="button" className="btn-copy-code" onClick={handleCopy}>
            {copied ? (
              <>
                <Check size={12} className="success-color" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="markdown-code-block">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

// React 19 safe component to render dynamic visual HTML notes with automatic active-recall code block hiding
export function HTMLNoteViewer({ html }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Find all Quill code block containers inside the rendered HTML
    const codeContainers = containerRef.current.querySelectorAll(".ql-code-block-container");
    codeContainers.forEach(box => {
      // Hide code block by default
      box.classList.add("code-hidden");
      
      // Inject Hide button if it doesn't exist
      if (!box.querySelector(".btn-hide-code-snippet")) {
        const hideBtn = document.createElement("button");
        hideBtn.type = "button";
        hideBtn.className = "btn-hide-code-snippet";
        hideBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
          <span>Hide</span>
        `;
        
        hideBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          box.classList.add("code-hidden");
        });
        
        box.appendChild(hideBtn);
      }

      // Toggle expansion when clicking the collapsed banner overlay
      const handleBannerClick = (e) => {
        if (box.classList.contains("code-hidden")) {
          // Prevent expanding if the user clicked the interactive language select dropdown
          if (e.target.tagName === "SELECT") return;
          
          e.preventDefault();
          e.stopPropagation();
          box.classList.remove("code-hidden");
        }
      };

      box.addEventListener("click", handleBannerClick);
    });
  }, [html]);

  return (
    <div 
      ref={containerRef} 
      className="markdown-body-rendered html-rendered" 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}

export function renderMarkdown(text) {
  if (!text || !text.trim()) return <span className="markdown-empty">No notes written yet. Click edit to write one.</span>;

  // Backwards compatibility check: render rich HTML directly if it starts with/contains tags
  if (text.trim().startsWith("<") || text.includes("<p>") || text.includes("<ul>") || text.includes("<ol>")) {
    return <HTMLNoteViewer html={text} />;
  }

  const lines = text.split("\n");
  let inCodeBlock = false;
  let codeBlockLanguage = "";
  let codeBlockLines = [];
  const elements = [];

  // Group adjacent list items
  let currentListType = null; // "ul" or "ol" or null
  let currentListItems = [];
  let currentListStart = 1;

  const flushList = (key) => {
    if (currentListItems.length > 0) {
      if (currentListType === "ul") {
        elements.push(
          <ul key={`ul-${key}`} className="markdown-list">
            {currentListItems}
          </ul>
        );
      } else if (currentListType === "ol") {
        elements.push(
          <ol key={`ol-${key}`} className="markdown-list" start={currentListStart}>
            {currentListItems}
          </ol>
        );
      }
      currentListItems = [];
      currentListType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for code blocks
    if (line.trim().startsWith("```")) {
      flushList(i);
      if (inCodeBlock) {
        elements.push(
          <MarkdownCodeBlock 
            key={`code-${i}`} 
            code={codeBlockLines.join("\n")} 
            language={codeBlockLanguage} 
          />
        );
        inCodeBlock = false;
        codeBlockLines = [];
        codeBlockLanguage = "";
      } else {
        inCodeBlock = true;
        codeBlockLanguage = line.trim().substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Heading format: ### text
    if (line.startsWith("#")) {
      flushList(i);
      const match = line.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const headingText = parseInlineMarkdown(match[2]);
        const Tag = `h${Math.min(level + 1, 6)}`; // Offset slightly to nest nicely in cards
        elements.push(<Tag key={`h-${i}`} className="markdown-header">{headingText}</Tag>);
        continue;
      }
    }

    // Bullet lists: - item
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      if (currentListType !== "ul") {
        flushList(i);
        currentListType = "ul";
      }
      const cleanLine = line.trim().substring(2);
      const listContent = parseInlineMarkdown(cleanLine);
      currentListItems.push(<li key={`li-${i}`}>{listContent}</li>);
      continue;
    }

    // Numbered lists: 1. item
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      const startNum = parseInt(numMatch[1]);
      if (currentListType !== "ol") {
        flushList(i);
        currentListType = "ol";
        currentListStart = startNum;
      }
      const listContent = parseInlineMarkdown(numMatch[2]);
      currentListItems.push(<li key={`li-${i}`}>{listContent}</li>);
      continue;
    }

    // Line break / Spacing
    if (!line.trim()) {
      flushList(i);
      elements.push(<div key={`br-${i}`} className="markdown-spacing" />);
      continue;
    }

    // Standard paragraph
    flushList(i);
    elements.push(
      <p key={`p-${i}`} className="markdown-p">
        {parseInlineMarkdown(line)}
      </p>
    );
  }

  // Flush any remaining list
  flushList("final");

  // Auto-close code block if unclosed
  if (inCodeBlock && codeBlockLines.length > 0) {
    elements.push(
      <MarkdownCodeBlock 
        key={`code-unclosed`} 
        code={codeBlockLines.join("\n")} 
        language={codeBlockLanguage} 
      />
    );
  }

  return <div className="markdown-body-rendered">{elements}</div>;
}

function parseInlineMarkdown(text) {
  if (!text) return "";
  let parts = [text];

  // 1. Inline code format `code`
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const subparts = part.split(/`([^`]+)`/g);
    return subparts.map((sub, idx) =>
      idx % 2 === 1 ? <code key={`icode-${idx}`} className="markdown-inline-code">{sub}</code> : sub
    );
  });

  // 2. Bold format **bold**
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const subparts = part.split(/\*\*([^*]+)\*\*/g);
    return subparts.map((sub, idx) =>
      idx % 2 === 1 ? <strong key={`bold-${idx}`}>{sub}</strong> : sub
    );
  });

  // 3. Italics format *italics*
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const subparts = part.split(/\*([^*]+)\*/g);
    return subparts.map((sub, idx) =>
      idx % 2 === 1 ? <em key={`ital-${idx}`}>{sub}</em> : sub
    );
  });

  return parts;
}
