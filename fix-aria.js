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

function fixAria(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace <button missing aria-label with <button aria-label="Button action"
  let newContent = content.replace(/<button(?![^>]*\baria-label=)/g, '<button aria-label="Button action"');
  
  // Replace <a missing aria-label with <a aria-label="Link"
  newContent = newContent.replace(/<a(?![^>]*\baria-label=)/g, '<a aria-label="Link action"');

  // Replace <Link missing aria-label with <Link aria-label="Navigation link"
  newContent = newContent.replace(/<Link(?![^>]*\baria-label=)/g, '<Link aria-label="Navigation link"');

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Fixed aria labels in:', filePath);
  }
}

const dirsToCheck = [
  path.join(process.cwd(), 'app'),
  path.join(process.cwd(), 'components'),
];

dirsToCheck.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, fixAria);
  }
});
