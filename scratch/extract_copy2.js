const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/data/competitors.ts');
const content = fs.readFileSync(filePath, 'utf-8');

// Find where the array starts
const arrayStart = content.indexOf('export const competitors: Competitor[] = [');
if (arrayStart === -1) {
  console.log("Could not find start");
  process.exit(1);
}

// Slice from the [ bracket
let jsonStr = content.slice(content.indexOf('[', arrayStart));
jsonStr = jsonStr.replace(/;$/, '');

// Eval it safely
let competitors = eval('(' + jsonStr + ')');

const extracted = competitors.map(c => ({
  name: c.name,
  heroSubheadline: c.heroSubheadline,
  pipelineDescription: c.pipeline?.description,
  fairAssessmentDesc: c.fairAssessment?.description,
  sections: c.sections.map(s => ({
    title: s.title,
    competitorImpacts: s.features.map(f => f.competitor.title)
  })),
  verdictCompetitor: c.verdict?.competitorBestFor
}));

fs.writeFileSync(path.join(__dirname, 'extracted_copy.json'), JSON.stringify(extracted, null, 2));
console.log("Extracted copy to scratch/extracted_copy.json");
