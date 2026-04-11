const fs = require('fs');
const path = require('path');

const files = [
  'client/data/algos/graphs.ts',
  'client/data/algos/graphs_advanced.ts',
  'client/data/algos/trees.ts',
  'client/data/algos/dynamic_programming.ts'
];

function removeCommentsFromCodeString(codeStr) {
  // The codeStr contains literal \n characters (escaped newlines)
  // Split on the actual \n characters
  const lines = codeStr.split('\\n');
  const cleanedLines = [];
  
  for (let line of lines) {
    let cleaned = line;
    
    // Remove full-line comments (lines that start with // or # after optional whitespace)
    cleaned = cleaned.replace(/^\s*(\/\/|#)\s.*$/, '');
    
    // Remove inline comments at end of lines
    // Match whitespace followed by // or # followed by any characters until end of line
    cleaned = cleaned.replace(/\s*(\/\/|#)\s.*$/, '');
    
    // Trim trailing whitespace
    cleaned = cleaned.trimRight();
    
    // Only add non-empty lines
    if (cleaned.trim() !== '' || cleaned === '') {
      cleanedLines.push(cleaned);
    }
  }
  
  // Join back with escaped newlines
  const result = cleanedLines.join('\\n');
  return result;
}

function processFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  console.log(`Processing ${filePath}...`);
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Find all code: strings and process them
  // The code strings can span multiple lines and contain escaped newlines
  // Match from code: " to the closing "
  const codeRegex = /code:\s*"((?:[^"\\]|\\.)*?)"/gs;
  
  let matchCount = 0;
  content = content.replace(codeRegex, (match, codeStr) => {
    matchCount++;
    console.log(`  Found code string #${matchCount}, length: ${codeStr.length}`);
    const cleanedCode = removeCommentsFromCodeString(codeStr);
    if (cleanedCode !== codeStr) {
      console.log(`  Cleaned code string #${matchCount}`);
    }
    return `code: "${cleanedCode}"`;
  });
  
  console.log(`  Total code strings found: ${matchCount}`);
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✓ Processed ${filePath}`);
}

files.forEach(processFile);
console.log('\\nAll files processed!');
