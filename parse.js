const fs = require('fs');

const content = fs.readFileSync('C:/Users/kumar/Desktop/CodeVerse/client/data/algos/generated_striver_algos.ts', 'utf8');

const regex = /title:\s*"([^"]+)",[\s\S]*?approaches:\s*\[[\s\S]*?name:\s*"([^"]+)"/g;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
  if (match[2] === 'Standard Optimized') {
    console.log(match[1]);
    count++;
  }
}
console.log('Total:', count);
