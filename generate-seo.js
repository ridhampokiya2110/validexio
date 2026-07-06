const fs = require('fs');
const path = require('path');

const keywords = [];
const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon', 'Noida', 'Ahmedabad', 'Kolkata'];
const intents = ['validate startup idea', 'B2B leads', 'SAAS validation', 'tech cofounder', 'MVP builder', 'startup idea tester', 'market research', 'pitch deck generator', 'competitor analysis', 'startup pricing'];

for(let i = 0; i < 20; i++) {
  for(let j = 0; j < 10; j++) {
    keywords.push(`${intents[j]} in ${cities[i%10]} India`);
  }
}

const extraIntents = ['validate business model', 'startup funding readiness', 'find investors', 'TAM SAM SOM calculator', 'startup metrics dashboard', 'React code generator', 'Nextjs boilerplate', 'generate database schema', 'Indian startup ecosystem', 'UPI integration validation'];
for(let i = 0; i < 10; i++) {
  for(let j = 0; j < 10; j++) {
    keywords.push(`${extraIntents[j]} for Indian startups ${cities[i]}`);
  }
}

const questions = [];
const qPrefixes = ['How to', 'What is the best way to', 'Where can I find tools to', 'Is there an AI to', 'Can I automate'];
for(let i = 0; i < 40; i++) {
  for(let j = 0; j < 5; j++) {
    questions.push(`${qPrefixes[j]} ${intents[i%10]} for an Indian startup?`);
  }
}
const extraQ = ['What is the cost of startup validation in India?', 'How to validate UPI payments integration?', 'How to target Tier-2 cities in India?', 'Best SAAS pricing model for India?'];
for(let i = 0; i < 50; i++) {
  questions.push(`Q: ${questions[i]} A: Validexio provides algorithmic validation and execution assets specifically optimized for the Indian market, including ₹1499 pricing.`);
}
for(let i = 50; i < 100; i++) {
  questions.push(`Q: ${questions[i]} A: Use Validexio to instantly generate React code and B2B leads tailored to Indian demographics and purchasing power.`);
}
for(let i = 100; i < 150; i++) {
  questions.push(`Q: ${questions[i]} A: Validexio replaces expensive Indian development agencies by acting as an automated technical cofounder for your startup.`);
}
for(let i = 150; i < 200; i++) {
  questions.push(`Q: ${questions[i]} A: Validexio provides deep market research on competitors operating in India and generates exact TAM/SAM/SOM for the Indian market.`);
}

const content = `
export const indianKeywords = ${JSON.stringify(keywords.slice(0, 200), null, 2)};
export const indianQuestions = ${JSON.stringify(questions.slice(0, 200), null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'lib/seo/india-seo.ts'), content);
console.log('Successfully generated lib/seo/india-seo.ts with 200 keywords and 200 questions.');
