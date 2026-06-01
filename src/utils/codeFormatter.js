export function formatCode(code, language = "plain") {
  if (!code) return "";
  
  // Normalize language name
  const lang = language.toLowerCase().trim();
  
  // Split into lines and trim trailing spaces
  let lines = code.split("\n");
  
  // Remove trailing blank lines at the end of code
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }
  
  const formattedLines = [];
  
  if (lang === "python") {
    let currentIndent = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmedLine = rawLine.trim();
      
      if (trimmedLine === "") {
        // Keep empty lines but don't indent them
        formattedLines.push("");
        continue;
      }
      
      // Keywords that reduce indentation for the current line
      const isDedentKeyword = 
        trimmedLine.startsWith("elif ") || 
        trimmedLine.startsWith("elif(") || 
        trimmedLine.startsWith("else:") || 
        trimmedLine.startsWith("except:") || 
        trimmedLine.startsWith("except ") || 
        trimmedLine.startsWith("finally:");
        
      if (isDedentKeyword) {
        currentIndent = Math.max(0, currentIndent - 4);
      }
      
      // Apply current indentation
      formattedLines.push(" ".repeat(currentIndent) + trimmedLine);
      
      // Increase indentation level if line ends with colon
      if (trimmedLine.endsWith(":")) {
        currentIndent += 4;
      }
    }
    
    return formattedLines.join("\n");
  } 
  
  const isCurlyBraceLang = 
    lang === "javascript" || 
    lang === "js" || 
    lang === "typescript" || 
    lang === "ts" || 
    lang === "cpp" || 
    lang === "c++" || 
    lang === "java" || 
    lang === "go" || 
    lang === "c";
    
  if (isCurlyBraceLang) {
    let currentIndent = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmedLine = rawLine.trim();
      
      if (trimmedLine === "") {
        formattedLines.push("");
        continue;
      }
      
      // Count open and closing braces outside of string literals
      let openBraces = 0;
      let closeBraces = 0;
      let inString = false;
      let stringChar = "";
      
      for (let j = 0; j < trimmedLine.length; j++) {
        const char = trimmedLine[j];
        if ((char === '"' || char === "'" || char === "`") && trimmedLine[j-1] !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (stringChar === char) {
            inString = false;
          }
        }
        
        if (!inString) {
          if (char === "{") openBraces++;
          if (char === "}") closeBraces++;
        }
      }
      
      // If line starts with closing brace, indent should decrease BEFORE rendering the line
      if (trimmedLine.startsWith("}")) {
        currentIndent = Math.max(0, currentIndent - 4);
      }
      
      // Apply current indentation
      formattedLines.push(" ".repeat(currentIndent) + trimmedLine);
      
      // Calculate net brace change for subsequent lines
      const netBraces = openBraces - closeBraces;
      
      if (trimmedLine.startsWith("}")) {
        // If we already decremented by 4 on start, adjust remaining
        currentIndent = Math.max(0, currentIndent + (openBraces - (closeBraces - 1)) * 4);
      } else {
        currentIndent = Math.max(0, currentIndent + netBraces * 4);
      }
    }
    
    return formattedLines.join("\n");
  }
  
  // Default plain text formatter: trim trailing spaces per line
  return lines.map(line => line.trimEnd()).join("\n");
}
