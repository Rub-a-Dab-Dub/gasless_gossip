const fs = require('fs');
const path = require('path');

const dir = './src'; // root folder of your code
const exts = ['.ts']; // only TypeScript files

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // regex to match class properties like: name: string; or createdAt: Date;
  const propertyRegex = /^(\s*)([a-zA-Z0-9_]+)\s*:\s*([^;]+);/gm;

  const fixed = content.replace(propertyRegex, (match, spaces, prop, type) => {
    // skip readonly or already definite assigned
    if (match.includes('!')) return match;
    if (match.includes('readonly')) return match;

    return `${spaces}${prop}!: ${type};`;
  });

  fs.writeFileSync(filePath, fixed, 'utf8');
  console.log(`Fixed: ${filePath}`);
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (exts.includes(path.extname(fullPath))) {
      processFile(fullPath);
    }
  });
}

walk(dir);
console.log('✅ All DTOs and entities fixed!');
