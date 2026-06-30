const fs = require('fs');
const path = require('path');

const unusedFiles = [
  'app/actions/track-interception.ts',
  'app/compare/[competitor]/TruthGraph.tsx',
  'components/AntiRoadmapCard.tsx',
  'components/EarlyAdopterCard.tsx',
  'components/FakeDoorCodeCard.tsx',
  'components/FreeTeaserReport.tsx',
  'components/GTMBrandingCard.tsx',
  'components/TechArchitectureCard.tsx',
  'components/compare/RigorGraph.tsx',
  'components/dashboard/SettingsForm.tsx',
  'components/showcase/ShowcaseHeader.tsx',
  'lib/ai/gemini.ts',
  'lib/schemas/checkout.schema.ts',
  'lib/schemas/intake.schema.ts'
];

unusedFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log('Deleted:', file);
  } else {
    console.log('File not found:', file);
  }
});
