const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/data/competitors.ts');
const content = fs.readFileSync(filePath, 'utf-8');

// Use a simple regex or execute the file in a sandbox to get the object
// Since it's a TS file exporting an array, we can strip the 'export const competitors = ' part and eval it.
let jsonStr = content.replace(/export const competitors(: Competitor\[\])? = /, '').replace(/;$/, '');
// It might have some types we can't eval easily, let's just write a script to parse it or just use regex to find heroSubheadline and descriptions.
// Actually, I can just require it if I compile it, or use ts-node, but I can also just regex it.
