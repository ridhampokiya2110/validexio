const fs = require('fs');
const path = require('path');

const d1 = require('./data1.js');
const d2 = require('./data2.js');
const d3 = require('./data3.js');

const combined = [...d1, ...d2, ...d3];

const fileContent = `export interface DeepFeature {
  name: string;
  pill: string;
  validexio: {
    title: string;
    impact: string;
  };
  competitor: {
    title: string;
  };
}

export interface ComparisonSection {
  id: string;
  title: string;
  subtitle: string;
  features: DeepFeature[];
}

export interface PipelineStage {
  id: number;
  name: string;
  iconName: "Lightbulb" | "FileText" | "Code2" | "Users";
  competitorHas: boolean;
  validexioHas: boolean;
  description: string;
}

export interface CompetitorPipeline {
  title?: string;
  description: string;
  stages: PipelineStage[];
}

export interface Competitor {
  id: string;
  name: string;
  slug: string;
  website?: string;
  heroHeadline: string;
  validexioHeadline: string;
  heroSubheadline: string;
  targetOutputCompetitor: string;
  pipeline?: CompetitorPipeline;
  sections: ComparisonSection[];
}

export const competitors: Competitor[] = ${JSON.stringify(combined, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '..', 'lib', 'data', 'competitors.ts'), fileContent, 'utf8');
console.log("Successfully rewrote competitors.ts with massively detailed unique features");
