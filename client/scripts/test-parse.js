const fs = require('fs');

try {
  const content = fs.readFileSync('./client/data/algos/generated_striver_algos.ts', 'utf8');
  const jsContent = content
      .replace(/import \{ AlgorithmEntry \} from "\.\/types";/g, '')
      .replace(/export const generatedStriverAlgorithms: AlgorithmEntry\[\] = /g, 'const generatedStriverAlgorithms = ');

  // parse it natively using acorn to get exact row/col
  const acorn = require('acorn');
  acorn.parse(jsContent, { ecmaVersion: 2020 });
  console.log("Parsed cleanly!");
} catch(e) {
  console.error("Syntax Error found at:", e.loc.line, ":", e.loc.column);
  
  const content = fs.readFileSync('./client/data/algos/generated_striver_algos.ts', 'utf8');
  const lines = content.split('\\n');
  console.log("Context around error:");
  for(let i = Math.max(0, e.loc.line - 5); i < Math.min(lines.length, e.loc.line + 5); i++) {
     console.log(`${i+1}: ${lines[i]}`);
  }
}
