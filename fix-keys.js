const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.tsx') || dirPath.endsWith('.jsx')) {
        callback(path.join(dir, f));
      }
    }
  });
}

function fixKeys(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  content = content.replace(/key=\{idx\}/g, 'key={`item-${idx}`}');
  content = content.replace(/key=\{index\}/g, 'key={`item-${index}`}');
  content = content.replace(/key=\{i\}/g, 'key={`item-${i}`}');
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed keys in:', filePath);
  }
}

walkDir(path.join(process.cwd(), 'app'), fixKeys);
walkDir(path.join(process.cwd(), 'components'), fixKeys);
