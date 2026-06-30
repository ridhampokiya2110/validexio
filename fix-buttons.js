const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.tsx') || dirPath.endsWith('.jsx') || dirPath.endsWith('.ts')) {
        callback(path.join(dir, f));
      }
    }
  });
}

function fixButtons(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace <button missing type with <button type="button"
  // This regex matches <button and any attributes until the closing >, checking that it doesn't already have type=
  let newContent = content.replace(/<button(?![^>]*\btype=)/g, '<button type="button"');
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Fixed buttons in:', filePath);
  }
}

const dirsToCheck = [
  path.join(process.cwd(), 'app'),
  path.join(process.cwd(), 'components'),
];

dirsToCheck.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, fixButtons);
  }
});
