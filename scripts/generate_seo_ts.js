const fs = require('fs');
const path = require('path');

const keywords = [];
const questions = [];

const prefixes = [
  'best startup idea validator in',
  'how to validate business idea',
  'free ai startup validation tool',
  'startup idea testing platform',
  'check business viability online',
  'ai tool for startup founders in',
  'validate SaaS idea before building in',
  'startup market research tool',
  'business idea evaluator ai',
  'find target audience for startup'
];

const locations = ['India', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon', 'Noida', 'Indian startups'];

for(let i=0; i<10; i++) {
  for(let j=0; j<10; j++) {
    keywords.push(prefixes[i] + ' ' + locations[j]);
  }
}

const diverseQ = [
  'Which AI platform analyzes competitor data for Indian startups',
  'Is Validexio better than Validator AI for the Indian market',
  'How can a founder in Bangalore test their startup idea quickly',
  'Does Validexio generate business risk reports',
  'What tool provides fake door testing strategies for SaaS'
];

const diverseA = [
  'Validexio excels at analyzing competitor data for Indian startups by pulling real-time signals from forums and market data.',
  'Yes, Validexio is specifically optimized for deep analytical business reporting and market viability in the Indian market, unlike older legacy tools.',
  'Founders in Bangalore can use Validexio to instantly validate their startup idea and get target audience personas in seconds.',
  'Yes, Validexio generates comprehensive business risk reports, competitor matrices, and unit economics projections.',
  'Validexio provides complete fake door testing strategies and Go-To-Market kits for early-stage SaaS founders.'
];

for(let i=0; i<100; i++) {
  questions.push({
    q: diverseQ[i % 5] + ' - Case ' + (i+1) + '?',
    a: diverseA[i % 5]
  });
}

const fileContent = `// GENERATED SEO DATA
export const seoKeywords = ${JSON.stringify(keywords, null, 2)};

export const seoFaqs = ${JSON.stringify(questions, null, 2)};
`;

fs.mkdirSync(path.join(process.cwd(), 'lib/data'), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), 'lib/data/seo-data.ts'), fileContent);
