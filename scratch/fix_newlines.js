const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/data/competitors.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the literal string "},\n    \"pipeline\": {" with actual newline
content = content.replace(/},\\n    "pipeline": {/g, '},\n    "pipeline": {');

fs.writeFileSync(filePath, content);
console.log("Fixed literal newlines!");
