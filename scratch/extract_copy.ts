import { competitors } from '../lib/data/competitors';
import * as fs from 'fs';
import * as path from 'path';

const extracted = competitors.map(c => ({
  name: c.name,
  heroSubheadline: c.heroSubheadline,
  pipelineDescription: c.pipeline?.description,
  sections: c.sections.flatMap(s => s.features.map(f => f.competitor.title)),
  verdictCompetitor: c.verdict?.competitorBestFor
}));

fs.writeFileSync(path.join(__dirname, 'extracted_copy.json'), JSON.stringify(extracted, null, 2));
console.log("Extracted copy to scratch/extracted_copy.json");
