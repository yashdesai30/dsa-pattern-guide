import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import hljs from "highlight.js";

// Stateful component to handle clipboard copy state on code blocks
function MarkdownCodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
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
    <div className="markdown-code-block-container">
      <div className="markdown-code-block-header">
        <span className="lang-tag">{displayLang}</span>
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
      <pre className="markdown-code-block">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

export function renderMarkdown(text) {
  if (!text || !text.trim()) return <span className="markdown-empty">No notes written yet. Click edit to write one.</span>;

  // Backwards compatibility check: render rich HTML directly if it starts with/contains tags
  if (text.trim().startsWith("<") || text.includes("<p>") || text.includes("<ul>") || text.includes("<ol>")) {
    return (
      <div 
        className="markdown-body-rendered html-rendered" 
        dangerouslySetInnerHTML={{ __html: text }} 
      />
    );
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
