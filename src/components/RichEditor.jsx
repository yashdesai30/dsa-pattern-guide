import React, { useEffect, useRef } from "react";
import Quill from "quill";
import hljs from "highlight.js";
import { formatCode } from "../utils/codeFormatter";
import "quill/dist/quill.snow.css";
import "highlight.js/styles/atom-one-dark.css";

export default function RichEditor({ value, onChange, placeholder }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Clear any previous nodes inside the container (safeguard for React Strict Mode / hot-reloads)
    container.innerHTML = "";

    // Create unique child container for Quill canvas to bind to
    const editorDiv = document.createElement("div");
    container.appendChild(editorDiv);

    // Initialize core Quill engine
    const quill = new Quill(editorDiv, {
      theme: "snow",
      placeholder: placeholder || "Write notes here... Use headers, bold text, or lists snugly.",
      modules: {
        syntax: {
          hljs: hljs
        },
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['code', 'code-block'],
          ['clean']
        ]
      }
    });

    quillRef.current = quill;

    // Add helpful hover tooltips to all editor toolbar elements
    const addToolbarTooltips = () => {
      const toolbarContainer = container.querySelector(".ql-toolbar");
      if (!toolbarContainer) return;

      // Tooltips for buttons
      const buttons = toolbarContainer.querySelectorAll("button");
      buttons.forEach(btn => {
        const classes = Array.from(btn.classList);
        let tooltipText = "";
        
        if (classes.includes("ql-bold")) tooltipText = "Bold (Cmd+B)";
        else if (classes.includes("ql-italic")) tooltipText = "Italic (Cmd+I)";
        else if (classes.includes("ql-underline")) tooltipText = "Underline (Cmd+U)";
        else if (classes.includes("ql-strike")) tooltipText = "Strikethrough";
        else if (classes.includes("ql-code")) tooltipText = "Inline Code";
        else if (classes.includes("ql-code-block")) tooltipText = "Insert Code Block";
        else if (classes.includes("ql-clean")) tooltipText = "Clear Formatting";
        else if (classes.includes("ql-list")) {
          const val = btn.getAttribute("value");
          if (val === "ordered") tooltipText = "Numbered List";
          if (val === "bullet") tooltipText = "Bullet List";
        }
        
        if (tooltipText) {
          btn.setAttribute("data-tooltip", tooltipText);
        }
      });

      // Tooltips for pickers (like Headings select)
      const pickers = toolbarContainer.querySelectorAll(".ql-picker");
      pickers.forEach(picker => {
        if (picker.classList.contains("ql-header")) {
          picker.setAttribute("data-tooltip", "Headings / Text Style");
          const label = picker.querySelector(".ql-picker-label");
          if (label) {
            label.setAttribute("data-tooltip", "Headings / Text Style");
          }
        }
      });
    };

    addToolbarTooltips();

    // Dynamic button injection for auto-formatting code blocks in-place
    const injectFormatButtons = () => {
      const containers = container.querySelectorAll(".ql-code-block-container");
      containers.forEach(box => {
        // Double check we don't duplicate the button
        if (!box.querySelector(".btn-format-code-snippet")) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn-format-code-snippet";
          btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.3-6.3l-.7.7M6.7 17.3l-.7.7m12.6 0l-.7-.7M6.7 6.7l-.7-.7M18 12a6 6 0 0 1-6 6c-3.3 0-6-2.7-6-6a6 6 0 0 1 6-6c3.3 0 6 2.7 6 6z"/></svg>
            <span>Format</span>
          `;
          
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Resolve Blot representation
            const blot = Quill.find(box);
            if (!blot) return;
            
            const index = blot.offset(quill.scroll);
            const length = blot.length();
            
            // Get language attribute
            const selectEl = box.querySelector("select.ql-ui");
            const lang = selectEl ? selectEl.value : (box.getAttribute("data-language") || "plain");
            
            // Get raw unformatted text
            let rawCode = quill.getText(index, length);
            
            // Remove trailing newlines to prevent growing blocks
            if (rawCode.endsWith("\n")) {
              rawCode = rawCode.substring(0, rawCode.length - 1);
            }
            
            // Execute specialized formatter
            const formatted = formatCode(rawCode, lang);
            
            // Safely delete and re-insert formatted code line-by-line via official delta format methods
            isUpdatingRef.current = true;
            quill.deleteText(index, length, "user");
            
            const linesText = formatted.split("\n");
            let insertPointer = index;
            
            linesText.forEach((lineStr, lineIdx) => {
              quill.insertText(insertPointer, lineStr, "user");
              quill.insertText(insertPointer + lineStr.length, "\n", "user");
              quill.formatLine(insertPointer, lineStr.length + 1, "code-block", lang, "user");
              insertPointer += lineStr.length + 1;
            });
            
            // Restore selection and sync state
            quill.setSelection(index, 0, "user");
            isUpdatingRef.current = false;
            
            // Trigger text change manual update
            const html = quill.root.innerHTML;
            if (html === "<p><br></p>" || html === "") {
              onChange("");
            } else {
              onChange(html);
            }
          });
          
          box.appendChild(btn);
        }
      });
    };

    // Initial content load
    if (value) {
      quill.root.innerHTML = value;
    }
    setTimeout(injectFormatButtons, 50);

    // Capture text changes and feed them back to parent
    quill.on("text-change", () => {
      if (isUpdatingRef.current) return;
      
      const html = quill.root.innerHTML;
      
      // Treat empty editor states as empty values
      if (html === "<p><br></p>" || html === "") {
        onChange("");
      } else {
        onChange(html);
      }
      
      injectFormatButtons();
    });

    quill.on("selection-change", () => {
      injectFormatButtons();
    });

    // Intercept clicks on empty space below a trailing code block to escape the code block trap
    const editorEl = container.querySelector(".ql-editor");
    const handleCanvasClick = (e) => {
      if (e.target === editorEl) {
        const lastChild = editorEl.lastElementChild;
        if (lastChild && (
          lastChild.classList.contains("ql-code-block-container") || 
          lastChild.classList.contains("ql-syntax") || 
          lastChild.tagName === "PRE"
        )) {
          const len = quill.getLength();
          // Insert newline at the very end (right before the trailing blank element)
          quill.insertText(len - 1, "\n", "user");
          // De-format it to standard paragraph
          quill.formatLine(len - 1, 1, "code-block", false, "user");
          // Focus the cursor on the new empty line
          quill.setSelection(len, 0, "user");
        }
      }
    };

    if (editorEl) {
      editorEl.addEventListener("click", handleCanvasClick);
    }

    return () => {
      if (editorEl) {
        editorEl.removeEventListener("click", handleCanvasClick);
      }
      // Complete teardown on component unmount using captured container node
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  // Synchronize changes externally if they happen (avoids breaking standard cursors)
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      // If the editor is focused, do NOT forcefully overwrite the content (prevents cursor jumping and input lags during parent state re-renders/saves)
      if (quillRef.current.hasFocus()) return;

      isUpdatingRef.current = true;
      
      const selection = quillRef.current.getSelection();
      quillRef.current.root.innerHTML = value || "";
      
      if (selection) {
        quillRef.current.setSelection(selection);
      }
      
      isUpdatingRef.current = false;
    }
  }, [value]);

  return (
    <div className="rich-editor-wrapper" ref={containerRef} />
  );
}
