const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(file)) continue;
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      const original = content;
      content = content.replace(/<a aria-label="Link action"side/g, '<aside');
      content = content.replace(/<a aria-label="Link action"rticle/g, '<article');
      content = content.replace(/<a aria-label="Link action"ny/g, '<any');
      content = content.replace(/<a aria-label="Link action"ction/g, '<action');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDirectory('./app');
processDirectory('./components');
