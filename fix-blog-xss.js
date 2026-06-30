const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
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

function fixXss(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  if (content.includes('dangerouslySetInnerHTML={{ __html: post.content }}') || content.includes('dangerouslySetInnerHTML={{ __html: competitor.validexioHeadline')) {
    if (!content.includes('isomorphic-dompurify')) {
      content = 'import DOMPurify from "isomorphic-dompurify";\n' + content;
    }
    content = content.replace(/dangerouslySetInnerHTML=\{\{\s*__html:\s*post\.content\s*\}\}/g, 'dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}');
    content = content.replace(/dangerouslySetInnerHTML=\{\{\s*__html:\s*(competitor\.validexioHeadline.*?)\s*\}\}/g, 'dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize($1) }}');
    
    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed XSS in:', filePath);
    }
  }
}

walkDir(path.join(process.cwd(), 'app', 'blog'), fixXss);
walkDir(path.join(process.cwd(), 'app', 'compare'), fixXss);
