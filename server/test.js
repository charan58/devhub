const jsKeywords = [
  "break", "case", "catch", "class", "const", "continue", "debugger", "default",
  "delete", "do", "else", "export", "extends", "finally", "for", "function", "if",
  "import", "in", "instanceof", "let", "new", "return", "super", "switch", "this",
  "throw", "try", "typeof", "var", "void", "while", "with", "yield", "await", "async"
];

function extractJSKeywords(code) {
  const tags = new Set();
  const normalizedCode = code.toLowerCase();

  for (const keyword of jsKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    if (regex.test(normalizedCode)) {
      tags.add(keyword);
    }
  }

  return Array.from(tags);
}

// Example usage:
const code = `
  import { npmKeyword } from "npm-keyword";
  async function loadData() {
    const res = await fetch('/api');
    if (res.ok) return res.json();
  }
`;

console.log(extractJSKeywords(code));
// Output: ['import', 'async', 'function', 'const', 'await', 'if', 'return']
