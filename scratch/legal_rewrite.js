const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/data/competitors.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Defamatory / High-risk phrases
content = content.replace(/Generates fake TAM\/SAM\/SOM graphs\./g, "Uses automated estimates for TAM/SAM/SOM graphs.");
content = content.replace(/Validation is useless without execution\./g, "Validation is the first step. Execution is the next.");

// 2. Aggressive Framing / Denigrating
content = content.replace(/Preuve stops at market analysis\./g, "Preuve specializes in market analysis.");
content = content.replace(/DimeADozen gives you a 'validation score' and stops\./g, "DimeADozen provides a 'validation score' report.");
content = content.replace(/Verdikt stops at a PDF score\./g, "Verdikt provides a specialized PDF score.");
content = content.replace(/ValidatorAI stops after a quick chat conversation\./g, "ValidatorAI focuses on quick chat conversations.");
content = content.replace(/PainMap mines negative reviews and stops there\./g, "PainMap specializes in mining negative reviews.");
content = content.replace(/BizPlanAI Pro stops at Microsoft Word\./g, "BizPlanAI Pro focuses on business plan documents.");

// "Zero" / "Only" negative framing
content = content.replace(/Provides business plans but zero code\./g, "Delivers comprehensive business plans.");
content = content.replace(/Zero lead generation\./g, "Does not include lead generation.");
content = content.replace(/Zero customer acquisition support\./g, "Does not include customer acquisition support.");
content = content.replace(/Free chatbot, but provides zero execution value\./g, "A free conversational assistant for idea discussion.");
content = content.replace(/Zero UI\/UX assets provided\./g, "Does not provide UI/UX design assets.");
content = content.replace(/Focuses on investors, provides zero B2B leads\./g, "Focuses purely on investor pitch materials.");
content = content.replace(/Zero design assets\./g, "Does not provide design assets.");
content = content.replace(/Provides zero customer leads\./g, "Does not provide customer leads.");
content = content.replace(/Zero design deliverables\./g, "Does not include design deliverables.");

// "Just a"
content = content.replace(/Just a pitch deck\./g, "Focuses solely on pitch decks.");
content = content.replace(/Just a simple database to hold emails\./g, "A straightforward database for email collection.");
content = content.replace(/Not just a logo\./g, "More than a logo.");
content = content.replace(/not just a logo\./g, "not only a logo.");

// "Dead ends"
content = content.replace(/Only passes around 18% of ideas, preventing founders from pursuing dead ends\./g, "Selects a small percentage of ideas for further exploration.");

// Write back
fs.writeFileSync(filePath, content, 'utf-8');
console.log("Replaced successfully");
