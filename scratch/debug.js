const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/data/competitors.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const slugs = ["preuve", "dimeadozen", "pitchbob", "ideaproof", "verdikt", "validatorai", "painmap", "startupdeckai", "bizplanaiprofocus", "pitchdesk-in"];

for (const slug of slugs) {
    const searchString = '"slug": "' + slug + '",';
    const searchIndex = content.indexOf(searchString);
    const pipelineIndex = searchIndex !== -1 ? content.indexOf('"pipeline":', searchIndex) : -1;
    console.log(slug, "=>", "searchIndex:", searchIndex, "pipelineIndex:", pipelineIndex);
}
